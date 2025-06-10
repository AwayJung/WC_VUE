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
      @close="showProfileEdit = false"
      @save="handleSaveProfile"
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
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),
    ...mapState("itemLike", ["likedItems"]),

    // 현재 사용자의 판매상품만 필터링
    mySalesData() {
      if (!this.allItems || !this.currentUser) return [];

      return this.allItems.filter((item) => {
        const itemSellerId = item.sellerId || (item.data && item.data.sellerId);
        return itemSellerId === this.currentUser.userId;
      });
    },

    // 필터에 따른 판매상품
    filteredSalesData() {
      if (this.salesFilter === "all") return this.mySalesData;

      return this.mySalesData.filter((item) => {
        const status =
          item.status || (item.data && item.data.status) || "selling";
        return status === this.salesFilter;
      });
    },
  },

  watch: {
    // 탭 변경 감지
    activeTab(newTab, oldTab) {
      console.log(`탭 변경: ${oldTab} → ${newTab}`);

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
          console.log("찜 목록 통계 업데이트:", newItems.length);
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions("item", ["fetchItems"]),
    ...mapActions("itemLike", ["fetchMyLikes", "refreshLikedItems"]),

    handleEditProfile() {
      this.showProfileEdit = true;
    },

    handleSalesFilterChange(filter) {
      this.salesFilter = filter;
      console.log("판매내역 필터 변경:", filter);
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
      // 전체 아이템 목록으로 이동
      this.$router.push("/items");
    },

    // 통계 업데이트 핸들러
    handleUpdateStats(statsUpdate) {
      console.log("통계 업데이트:", statsUpdate);

      // 전달받은 통계로 업데이트
      Object.assign(this.userStats, statsUpdate);
    },

    async handleSaveProfile(profileData) {
      try {
        console.log("프로필 저장:", profileData);

        this.showProfileEdit = false;
        alert("프로필이 수정되었습니다.");
      } catch (error) {
        console.error("프로필 수정 실패:", error);
        alert("프로필 수정에 실패했습니다.");
      }
    },

    // API 호출 메서드들
    async fetchAllItems() {
      try {
        console.log("전체 아이템 데이터 조회");
        // Vuex store에서 아이템 가져오기
        await this.fetchItems();

        const items = this.$store.state.item.items;
        if (items && items.data) {
          if (Array.isArray(items.data)) {
            this.allItems = items.data;
          } else {
            this.allItems = Object.values(items.data);
          }
        }

        console.log("내 판매상품:", this.mySalesData);
      } catch (error) {
        console.error("아이템 데이터 조회 실패:", error);
      }
    },

    async refreshLikesData() {
      try {
        console.log("=== 찜 목록 새로고침 시작 ===");

        if (this.isAuthenticated) {
          // Vuex action을 통해 찜 목록 새로고침
          await this.refreshLikedItems();
          console.log("찜 목록 새로고침 완료");
        }
      } catch (error) {
        console.error("찜 목록 새로고침 실패:", error);
      }
    },

    async fetchUserStats() {
      try {
        console.log("사용자 통계 조회");

        // 판매상품 통계
        this.userStats.sales = this.mySalesData.length;

        // 찜 목록 통계 (Vuex에서 가져오기)
        if (this.likedItems && Array.isArray(this.likedItems)) {
          this.userStats.likes = this.likedItems.length;
        }

        console.log("현재 통계:", this.userStats);
      } catch (error) {
        console.error("사용자 통계 조회 실패:", error);
      }
    },
  },

  async created() {
    console.log("=== MyPage 생성 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);

    // 인증 체크
    if (!this.isAuthenticated) {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    // 초기 데이터 로딩
    try {
      await Promise.all([this.fetchAllItems(), this.refreshLikesData()]);

      // 아이템 로드 후 통계 업데이트
      await this.fetchUserStats();

      console.log("=== MyPage 초기화 완료 ===");
    } catch (error) {
      console.error("초기 데이터 로딩 실패:", error);
    }
  },
};
</script>
