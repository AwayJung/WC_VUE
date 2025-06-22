<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <TheHeader />

    <main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
      <ProfileCard @edit-profile="handleEditProfile" />

      <!-- 통계 카드들 -->
      <StatsCards :stats="userStats" />

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

    <!-- 🔥 프로필 수정 모달 - save 이벤트 추가 -->
    <ProfileEditModal
      :visible="showProfileEdit"
      @close="handleCloseProfileEdit"
      @save="handleProfileSaved"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import TheHeader from "@/components/layout/TheHeader.vue";
import ProfileCard from "@/components/mypage/ProfileCard.vue";
import StatsCards from "@/components/mypage/StatsCards.vue";
import ProfileEditModal from "@/components/mypage/ProfileEditModal.vue";
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
    SalesTab,
    LikesTab,
    SupportTab,
    TheFooter,
  },

  data() {
    return {
      activeTab: "sales",
      showProfileEdit: false,
      salesFilter: "all",
      allItems: [],

      tabs: [
        { id: "sales", name: "판매내역" },
        { id: "likes", name: "관심목록" },
        { id: "support", name: "고객지원" },
      ],

      userStats: {
        sales: 0,
        likes: 0,
        chats: 0,
        completed: 0,
      },
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated", "userProfile"]),
    ...mapState("itemLike", ["likedItems"]),

    // 현재 사용자의 판매상품만 필터링
    mySalesData() {
      if (!this.allItems || !this.currentUser) {
        return [];
      }

      return this.allItems.filter((item) => {
        const itemSellerId = item.sellerId || (item.data && item.data.sellerId);
        const normalizedItemSellerId = String(itemSellerId);
        const normalizedCurrentUserId = String(this.currentUser.userId);

        return normalizedItemSellerId === normalizedCurrentUserId;
      });
    },

    // 필터에 따른 판매상품
    filteredSalesData() {
      if (this.salesFilter === "all") {
        return this.mySalesData;
      }

      return this.mySalesData.filter((item) => {
        const status =
          item.status || (item.data && item.data.status) || "SELLING";
        const normalizedStatus = status.toUpperCase();
        const normalizedFilter = this.salesFilter.toUpperCase();

        return normalizedStatus === normalizedFilter;
      });
    },
  },

  watch: {
    // 탭 변경 감지
    activeTab(newTab) {
      // 관심목록 탭으로 변경 시 찜 목록 새로고침
      if (newTab === "likes") {
        this.refreshLikesData();
      }
    },

    // 찜 목록 변경 감지하여 통계 업데이트
    likedItems: {
      handler(newItems) {
        if (newItems && Array.isArray(newItems)) {
          this.userStats.likes = newItems.length;
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions("item", ["fetchItems"]),
    ...mapActions("itemLike", ["refreshLikedItems"]),
    ...mapActions("auth", ["fetchUserProfile"]),

    handleEditProfile() {
      this.showProfileEdit = true;
    },

    // 프로필 수정 모달 닫기
    handleCloseProfileEdit() {
      this.showProfileEdit = false;
    },

    // 프로필 수정 완료 후 처리
    async handleProfileSaved() {
      try {
        // 프로필 정보 새로고침해서 ProfileCard에 반영
        await this.fetchUserProfile();

        this.showProfileEdit = false;

        // 성공 알림 (토스트 메시지 있으면 사용, 없으면 alert)
        if (this.$toast?.success) {
          this.$toast.success("프로필이 성공적으로 수정되었습니다.");
        } else {
          alert("프로필이 성공적으로 수정되었습니다.");
        }
      } catch (error) {
        console.error("프로필 새로고침 실패:", error);

        // 에러가 발생해도 모달은 닫고 사용자에게 알림
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

    handleSalesFilterChange(filter) {
      this.salesFilter = filter;
    },

    handleCreateItem() {
      this.$router.push("/items/create");
    },

    // 내 판매상품 전체보기
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

    // 통계 업데이트 핸들러
    handleUpdateStats(statsUpdate) {
      Object.assign(this.userStats, statsUpdate);
    },

    // 아이템 상태 변경 핸들러
    handleItemStatusChanged({ itemId, newStatus }) {
      // allItems에서 해당 아이템의 상태 업데이트
      const item = this.allItems.find((item) => {
        const id = item.itemId || (item.data && item.data.itemId) || item.id;
        return String(id) === String(itemId);
      });

      if (item) {
        // 아이템 상태 업데이트
        if (item.data) {
          item.data.status = newStatus;
        }
        item.status = newStatus;

        // Vue 반응성 트리거
        this.$forceUpdate();
      }
    },

    // 🔥 기존 handleSaveProfile 메서드 제거 (ProfileEditModal에서 자체 처리)

    // API 호출 메서드들
    async fetchAllItems(forceRefresh = false) {
      try {
        if (forceRefresh) {
          // Vuex 우회하고 직접 API 호출
          const { getItemList } = await import("@/api/item");
          const response = await getItemList();

          if (response.data) {
            if (Array.isArray(response.data)) {
              this.allItems = response.data;
            } else if (
              response.data.data &&
              Array.isArray(response.data.data)
            ) {
              this.allItems = response.data.data;
            } else {
              this.allItems = Object.values(response.data);
            }
          }
        } else {
          // 기존 Vuex 방식
          await this.fetchItems();
          const items = this.$store.state.item.items;
          if (items && items.data) {
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

    fetchUserStats() {
      // 판매상품 통계
      this.userStats.sales = this.mySalesData.length;

      // 찜 목록 통계
      if (this.likedItems && Array.isArray(this.likedItems)) {
        this.userStats.likes = this.likedItems.length;
      }
    },
  },

  async created() {
    // 인증 체크
    if (!this.isAuthenticated) {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    // 🔥 초기 데이터 로딩 - 프로필 정보도 함께 로드
    try {
      await Promise.all([
        this.fetchUserProfile(), // 프로필 정보 로드 추가
        this.fetchAllItems(true), // 강제 새로고침
        this.refreshLikesData(),
      ]);

      // 아이템 로드 후 통계 업데이트
      this.fetchUserStats();
    } catch (error) {
      console.error("초기 데이터 로딩 실패:", error);
    }
  },
};
</script>
