<template>
  <div class="min-h-screen bg-gray-50">
    <TheHeader />

    <div class="max-w-6xl mx-auto px-4 py-8">
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
            :likes-data="likesData"
            @navigate-items="handleNavigateItems"
            @toggle-like="handleToggleLike"
          />

          <SupportTab v-if="activeTab === 'support'" />
        </div>
      </div>
    </div>

    <!-- 프로필 수정 모달 (props도 제거) -->
    <ProfileEditModal
      :visible="showProfileEdit"
      @close="showProfileEdit = false"
      @save="handleSaveProfile"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TheHeader from "@/components/layout/TheHeader.vue";
import ProfileCard from "@/components/mypage/ProfileCard.vue";
import StatsCards from "@/components/mypage/StatsCards.vue";
import ProfileEditModal from "@/components/mypage/ProfileEditModal.vue";
import SalesTab from "@/components/mypage/SalesTab.vue";
import LikesTab from "@/components/mypage/LikesTab.vue";
import SupportTab from "@/components/mypage/SupportTab.vue";

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

      likesData: [],
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

  methods: {
    ...mapActions("item", ["fetchItems"]),

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

    // 내 판매상품 전체보기 (새로 추가)
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
      // 전체 아이템 목록으로 이동 (기존 관심목록 기능)
      this.$router.push("/items");
    },

    handleToggleLike(itemId) {
      console.log("찜 해제:", itemId);
      // 실제로는 API 호출하여 찜 해제
      this.removeLikeItem(itemId);
    },

    async handleSaveProfile(profileData) {
      try {
        console.log("프로필 저장:", profileData);

        // 실제 API 호출 예시
        // const formData = new FormData();
        // formData.append('nickname', profileData.nickname);
        // formData.append('bio', profileData.bio);
        // if (profileData.profileImage) {
        //   formData.append('profileImage', profileData.profileImage);
        // }
        //
        // const response = await userApi.updateProfile(formData);
        //
        // // Vuex 스토어 업데이트
        // this.$store.commit('auth/UPDATE_USER_PROFILE', response.data);

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

        // store에서 데이터 구조에 맞게 가져오기
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

    async fetchLikesData() {
      try {
        console.log("관심목록 데이터 조회");
        // 실제 API 호출
        // const response = await likesApi.getLikesList(this.currentUser.userId);
        // this.likesData = response.data;
      } catch (error) {
        console.error("관심목록 데이터 조회 실패:", error);
      }
    },

    async fetchUserStats() {
      try {
        console.log("사용자 통계 조회");
        // 실제 API 호출
        // const response = await userApi.getUserStats(this.currentUser.userId);
        // this.userStats = response.data;

        // 임시로 내 판매상품 개수 업데이트
        this.userStats.sales = this.mySalesData.length;
      } catch (error) {
        console.error("사용자 통계 조회 실패:", error);
      }
    },

    async removeLikeItem(itemId) {
      try {
        // 실제 API 호출
        // await likesApi.removeLike(itemId);

        // 로컬 데이터에서 제거
        this.likesData = this.likesData.filter((item) => item.id !== itemId);

        // 통계 업데이트
        if (this.userStats.likes > 0) {
          this.userStats.likes--;
        }

        console.log("찜 해제 완료:", itemId);
      } catch (error) {
        console.error("찜 해제 실패:", error);
        alert("찜 해제에 실패했습니다.");
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

    // 초기 데이터 로딩
    try {
      await Promise.all([this.fetchAllItems(), this.fetchLikesData()]);

      // 아이템 로드 후 통계 업데이트
      await this.fetchUserStats();
    } catch (error) {
      console.error("초기 데이터 로딩 실패:", error);
    }
  },
};
</script>
