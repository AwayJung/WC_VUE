<template>
  <div class="min-h-screen bg-gray-50">
    <MarketHeader
      :is-logged-in="isLoggedIn"
      @toggle-menu="showMenu = !showMenu"
      @search="handleSearch"
      @search-clear="clearSearch"
      @header-height-changed="updateHeaderHeight"
    />

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
import BottomNavigation from "@/components/layout/BottomNavigation.vue";

export default {
  name: "ItemListPage",
  components: {
    ItemList,
    MarketHeader,
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
  watch: {
    // URL의 카테고리 파라미터 변경 감지
    "$route.query.category": {
      immediate: false, // created에서 처리하므로 false
      handler(newCategoryId) {
        this.selectedCategory = newCategoryId ? parseInt(newCategoryId) : null;
        this.loadItemsWithLikes();
      },
    },
  },
  computed: {
    ...mapState("item", ["items", "loading", "error"]),
    ...mapState("itemLike", ["likedItems"]), // itemLike 스토어의 상태 추가

    processedItems() {
      if (!this.items) return [];

      let result = [];
      if (this.items.data && Array.isArray(this.items.data)) {
        result = this.items.data;
      } else if (this.items.data) {
        result = Object.values(this.items.data);
      } else {
        return [];
      }

      // likedItems의 상태 정보를 processedItems에 병합
      return this.mergeLikeInfo(result);
    },

    filteredItems() {
      let result = this.processedItems;

      // 검색어 필터링만 프론트엔드에서 처리 (카테고리는 백엔드에서 이미 필터링됨)
      if (this.searchQuery) {
        // 검색어의 공백 제거 및 소문자 변환
        const query = this.searchQuery.toLowerCase().trim();

        // 여러 필드에 대해 검색어가 포함된 아이템 필터링
        result = result.filter((item) => {
          const title = (item.title || "").toLowerCase();
          const description = (item.description || "").toLowerCase();
          const categoryName = (item.categoryName || "").toLowerCase();

          return (
            title.includes(query) ||
            description.includes(query) ||
            categoryName.includes(query)
          );
        });
      }

      return result;
    },
  },
  methods: {
    ...mapActions("item", ["fetchItems", "fetchItemsByCategory"]),
    ...mapActions("itemLike", ["fetchMyLikes"]),

    // 좋아요 정보를 아이템 목록에 병합하는 메서드
    mergeLikeInfo(items) {
      // likedItems가 없거나 비어있으면 원래 아이템 목록 반환
      if (!this.likedItems || this.likedItems.length === 0) {
        return items;
      }

      // likedItems를 맵으로 변환하여 빠른 조회 가능하게 함
      const likeMap = {};
      this.likedItems.forEach((likedItem) => {
        const itemId = likedItem.itemId;
        if (itemId) {
          likeMap[itemId] = {
            isLiked: true,
            likeCount: likedItem.likeCount || 1,
          };
        }
      });

      // 각 아이템에 좋아요 정보 적용
      return items.map((item) => {
        const itemId = item.itemId || (item.data && item.data.itemId);

        if (itemId && likeMap[itemId]) {
          // item.data가 있는 경우
          if (item.data) {
            return {
              ...item,
              data: {
                ...item.data,
                isLiked: likeMap[itemId].isLiked,
                likeCount: likeMap[itemId].likeCount,
              },
            };
          }
          // item에 직접 데이터가 있는 경우
          else {
            return {
              ...item,
              isLiked: likeMap[itemId].isLiked,
              likeCount: likeMap[itemId].likeCount,
            };
          }
        }

        return item;
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
      this.headerHeight = height;
    },

    // 아이템 목록과 좋아요 정보를 함께 로드
    async loadItemsWithLikes() {
      try {
        const categoryId = this.$route.query.category;
        let itemsPromise;

        if (categoryId) {
          // 카테고리가 있으면 카테고리별 조회
          console.log("카테고리별 조회:", categoryId);
          itemsPromise = this.fetchItemsByCategory(parseInt(categoryId));
        } else {
          // 없으면 전체 조회
          console.log("전체 아이템 조회");
          itemsPromise = this.fetchItems();
        }

        // 아이템과 좋아요 정보를 병렬로 가져옴
        await Promise.all([itemsPromise, this.fetchMyLikes()]);

        console.log("아이템과 좋아요 정보 로드 완료");
        console.log("선택된 카테고리:", categoryId);
        console.log("아이템 수:", this.processedItems.length);
        console.log("좋아요 아이템 수:", this.likedItems?.length || 0);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    },
  },
  async created() {
    // URL에서 검색어와 카테고리 가져오기
    if (this.$route.query.q) {
      this.searchQuery = this.$route.query.q;
    }

    // URL에서 카테고리 가져오기
    if (this.$route.query.category) {
      this.selectedCategory = parseInt(this.$route.query.category);
    }

    // 아이템 데이터와 찜 목록 함께 가져오기
    await this.loadItemsWithLikes();

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
