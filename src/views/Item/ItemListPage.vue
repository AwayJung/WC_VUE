<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 당근마켓 스타일 헤더 컴포넌트 -->
    <MarketHeader
      :is-logged-in="isLoggedIn"
      @toggle-menu="showMenu = !showMenu"
      @search="handleSearch"
      @search-clear="clearSearch"
      @header-height-changed="updateHeaderHeight"
    />

    <!-- 카테고리 필터 컴포넌트 -->
    <!-- <CategoryFilter @category-selected="handleCategorySelect" /> -->

    <!-- 메인 컨텐츠 -->
    <main class="pb-20">
      <div
        v-if="loading || searchLoading"
        class="flex justify-center items-center p-4"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"
        ></div>
        <span>로딩 중...</span>
      </div>
      <div v-else-if="error" class="text-red-500 text-center p-4">
        {{ error }}
      </div>
      <div
        v-else-if="searchQuery && filteredItems.length === 0"
        class="text-center p-8"
      >
        <div class="flex flex-col items-center justify-center py-10">
          <svg
            class="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-gray-500 font-medium">검색 결과가 없습니다.</p>
          <p class="text-sm text-gray-400 mt-2">다른 검색어로 시도해보세요.</p>
        </div>
      </div>
      <div v-else>
        <ItemList :items="filteredItems" />
      </div>
    </main>

    <!-- 하단 네비게이션 -->
    <BottomNavigation activePage="home" :userId="userId" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ItemList from "@/components/Item/List/ItemList.vue";
import MarketHeader from "@/components/layout/MarketHeader.vue";
// import ListCategoryFilter from "@/components/Item/category/ListCategoryFilter.vue";
import BottomNavigation from "@/components/layout/BottomNavigation.vue";

export default {
  name: "ItemListPage",
  components: {
    ItemList,
    MarketHeader,
    // CategoryFilter: ListCategoryFilter,
    BottomNavigation,
  },
  data() {
    return {
      isLoggedIn: false,
      userId: "3", // 로그인 구현 전까지 기본값으로 설정
      searchQuery: "",
      showMenu: false,
      headerHeight: 56, // 기본 헤더 높이
      searchLoading: false, // 검색 로딩 상태 추가
      selectedCategory: null, // 선택된 카테고리
    };
  },
  computed: {
    ...mapState("item", ["items", "loading", "error"]),
    processedItems() {
      if (!this.items) return [];
      if (this.items.data && Array.isArray(this.items.data)) {
        return this.items.data;
      }
      if (this.items.data) {
        return Object.values(this.items.data);
      }
      return [];
    },
    filteredItems() {
      let result = this.processedItems;

      // 카테고리 필터링
      if (this.selectedCategory) {
        result = result.filter(
          (item) => item.category && item.category.id === this.selectedCategory
        );
      }

      // 검색어 필터링
      if (this.searchQuery) {
        // 검색어의 공백 제거 및 소문자 변환
        const query = this.searchQuery.toLowerCase().trim();

        // 여러 필드에 대해 검색어가 포함된 아이템 필터링
        result = result.filter((item) => {
          const title = (item.title || "").toLowerCase();
          const description = (item.description || "").toLowerCase();
          const location = (item.location || "").toLowerCase();
          const category = (item.category?.name || "").toLowerCase();
          const tags = (item.tags || []).join(" ").toLowerCase();

          return (
            title.includes(query) ||
            description.includes(query) ||
            location.includes(query) ||
            category.includes(query) ||
            tags.includes(query)
          );
        });
      }

      return result;
    },
  },
  methods: {
    ...mapActions("item", ["fetchItems"]),

    handleCategorySelect(categoryId) {
      this.selectedCategory = categoryId;
      console.log("선택된 카테고리:", categoryId);

      // URL에 카테고리 반영
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          category: categoryId || undefined,
        },
      });
    },

    async handleSearch(query) {
      this.searchQuery = query;
      this.searchLoading = true; // 로딩 시작
      console.log("검색어:", query);

      // URL에 검색어 반영
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          q: query || undefined,
        },
      });

      try {
        // 필요한 경우 API 호출이나 다른 비동기 작업
        // await this.fetchItems({ search: query });

        // 비동기 작업이 없어도 약간의 딜레이로 로딩 효과 제공
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      } finally {
        this.searchLoading = false; // 로딩 종료
      }
    },

    clearSearch() {
      this.searchQuery = "";

      // URL에서 검색어 파라미터 제거
      const query = { ...this.$route.query };
      delete query.q;

      this.$router.push({
        path: this.$route.path,
        query,
      });
    },

    // 헤더 높이가 변경될 때 호출되는 메서드
    updateHeaderHeight(height) {
      console.log("헤더 높이 변경됨:", height);
      this.headerHeight = height;
    },
  },
  async created() {
    // URL에서 검색어와 카테고리 가져오기
    if (this.$route.query.q) {
      this.searchQuery = this.$route.query.q;
    }

    if (this.$route.query.category) {
      this.selectedCategory = this.$route.query.category;
    }

    // 아이템 데이터 가져오기
    await this.fetchItems();

    // 로그인 상태 확인 (실제 구현에 맞게 수정 필요)
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      this.userId = storedUserId;
    }
  },
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
