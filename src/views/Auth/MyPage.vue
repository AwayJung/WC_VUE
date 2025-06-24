<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
      <ProfileCard
        @edit-profile="handleEditProfile"
        @change-password="handleChangePassword"
      />

      <!-- 통계 카드들 -->
      <StatsCards :stats="finalUserStats" />

      <!-- 탭 콘텐츠 -->
      <div class="bg-white rounded-xl shadow-sm border">
        <!-- 탭 헤더 -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- 탭 내용 -->
        <div class="p-6">
          <SalesTab
            v-if="activeTab === 'sales'"
            :sales-data="filteredSalesData"
            :filter="salesFilter"
            @filter-change="handleSalesFilterChange"
            @create-item="handleCreateItem"
            @view-all-sales="handleViewAllSales"
            @status-changed="handleItemStatusChanged"
          />

          <LikesTab
            v-if="activeTab === 'likes'"
            @navigate-items="handleNavigateItems"
            @update-stats="handleUpdateStats"
          />

          <SupportTab v-if="activeTab === 'support'" />
        </div>
      </div>
    </main>
    <TheFooter />

    <!-- 프로필 수정 모달 -->
    <ProfileEditModal
      :visible="showProfileEdit"
      @close="handleCloseProfileEdit"
      @save="handleProfileSaved"
    />

    <!-- 비밀번호 변경 모달 -->
    <ChangePasswordModal
      :visible="showPasswordModal"
      @close="handleClosePasswordModal"
      @success="handlePasswordChanged"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import TheHeader from "@/components/layout/TheHeader.vue";
import ProfileCard from "@/components/mypage/ProfileCard.vue";
import StatsCards from "@/components/mypage/StatsCards.vue";
import ProfileEditModal from "@/components/mypage/ProfileEditModal.vue";
import ChangePasswordModal from "@/components/mypage/ChangePasswordModal.vue";
import SalesTab from "@/components/mypage/SalesTab.vue";
import LikesTab from "@/components/mypage/LikesTab.vue";
import SupportTab from "@/components/mypage/SupportTab.vue";
import TheFooter from "@/components/layout/TheFooter.vue";

export default {
  name: "MyPage",

  components: {
    TheHeader,
    ProfileCard,
    StatsCards,
    ProfileEditModal,
    ChangePasswordModal,
    SalesTab,
    LikesTab,
    SupportTab,
    TheFooter,
  },

  data() {
    return {
      activeTab: "sales",
      showProfileEdit: false,
      showPasswordModal: false,
      salesFilter: "all",
      allItems: [],
      tabs: [
        { id: "sales", name: "판매내역" },
        { id: "likes", name: "관심목록" },
        { id: "support", name: "고객지원" },
      ],
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated", "userProfile"]),
    ...mapGetters("chat", ["chatCount"]),
    ...mapState("itemLike", ["likedItems"]),

    mySalesData() {
      if (!this.allItems || !this.currentUser) {
        return [];
      }

      return this.allItems.filter((item) => {
        const itemSellerId = item.sellerId || item.data?.sellerId;
        const normalizedItemSellerId = String(itemSellerId);
        const normalizedCurrentUserId = String(this.currentUser.userId);

        return normalizedItemSellerId === normalizedCurrentUserId;
      });
    },

    filteredSalesData() {
      if (this.salesFilter === "all") {
        return this.mySalesData;
      }

      return this.mySalesData.filter((item) => {
        const status = item.status || item.data?.status || "SELLING";
        const normalizedStatus = status.toUpperCase();
        const normalizedFilter = this.salesFilter.toUpperCase();

        return normalizedStatus === normalizedFilter;
      });
    },

    completedItems() {
      return this.mySalesData.filter((item) => {
        const status = item.status || item.data?.status || "SELLING";
        return status.toUpperCase() === "SOLD";
      });
    },

    finalUserStats() {
      return {
        sales: this.mySalesData.length,
        likes: this.likedItems?.length || 0,
        chats: this.chatCount,
        completed: this.completedItems.length,
      };
    },
  },

  watch: {
    activeTab(newTab) {
      if (newTab === "likes") {
        this.refreshLikesData();
      }
    },
  },

  async created() {
    if (!this.isAuthenticated) {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    try {
      await Promise.all([
        this.fetchUserProfile(),
        this.fetchAllItems(true),
        this.refreshLikesData(),
        this.fetchChatRoomCount(),
      ]);
    } catch (error) {
      console.error("초기 데이터 로딩 실패:", error);
    }
  },

  methods: {
    ...mapActions("item", ["fetchItems"]),
    ...mapActions("itemLike", ["refreshLikedItems"]),
    ...mapActions("auth", ["fetchUserProfile"]),
    ...mapActions("chat", ["fetchUserChatCount"]),

    handleEditProfile() {
      this.showProfileEdit = true;
    },

    handleChangePassword() {
      this.showPasswordModal = true;
    },

    handleCloseProfileEdit() {
      this.showProfileEdit = false;
    },

    handleClosePasswordModal() {
      this.showPasswordModal = false;
    },

    async handleProfileSaved() {
      try {
        await this.fetchUserProfile();
        this.showProfileEdit = false;

        if (this.$toast?.success) {
          this.$toast.success("프로필이 성공적으로 수정되었습니다.");
        } else {
          alert("프로필이 성공적으로 수정되었습니다.");
        }
      } catch (error) {
        console.error("프로필 새로고침 실패:", error);
        this.showProfileEdit = false;

        if (this.$toast?.warning) {
          this.$toast.warning(
            "프로필이 수정되었지만 새로고침에 실패했습니다. 페이지를 새로고침해주세요."
          );
        } else {
          alert(
            "프로필이 수정되었지만 새로고침에 실패했습니다. 페이지를 새로고침해주세요."
          );
        }
      }
    },

    handlePasswordChanged() {
      this.showPasswordModal = false;

      if (this.$toast?.success) {
        this.$toast.success("비밀번호가 성공적으로 변경되었습니다.");
      } else {
        alert("비밀번호가 성공적으로 변경되었습니다.");
      }
    },

    handleSalesFilterChange(filter) {
      this.salesFilter = filter;
    },

    handleCreateItem() {
      this.$router.push("/items/create");
    },

    handleViewAllSales() {
      this.$router.push({
        path: "/items",
        query: {
          sellerId: this.currentUser.userId,
          type: "my-sales",
          title: "내 판매상품",
        },
      });
    },

    handleNavigateItems() {
      this.$router.push("/items");
    },

    handleItemStatusChanged({ itemId, newStatus }) {
      const item = this.allItems.find((item) => {
        const id = item.itemId || item.data?.itemId || item.id;
        return String(id) === String(itemId);
      });

      if (item) {
        if (item.data) {
          item.data.status = newStatus;
        }
        item.status = newStatus;
        this.$forceUpdate();
      }
    },

    async fetchAllItems(forceRefresh = false) {
      try {
        if (forceRefresh) {
          const { getItemList } = await import("@/api/item");
          const response = await getItemList();

          if (response.data) {
            if (Array.isArray(response.data)) {
              this.allItems = response.data;
            } else if (Array.isArray(response.data.data)) {
              this.allItems = response.data.data;
            } else {
              this.allItems = Object.values(response.data);
            }
          }
        } else {
          await this.fetchItems();
          const items = this.$store.state.item.items;
          if (items?.data) {
            if (Array.isArray(items.data)) {
              this.allItems = items.data;
            } else {
              this.allItems = Object.values(items.data);
            }
          }
        }
      } catch (error) {
        console.error("아이템 데이터 조회 실패:", error);
      }
    },

    async refreshLikesData() {
      try {
        if (this.isAuthenticated) {
          await this.refreshLikedItems();
        }
      } catch (error) {
        console.error("찜 목록 새로고침 실패:", error);
      }
    },

    async fetchChatRoomCount() {
      try {
        if (!this.currentUser?.userId) {
          return;
        }

        await this.fetchUserChatCount(this.currentUser.userId);
      } catch (error) {
        console.error("채팅방 수 조회 실패:", error);
      }
    },
  },
};
</script>
