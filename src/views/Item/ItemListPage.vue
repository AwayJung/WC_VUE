<template>
  <div class="min-h-screen bg-gray-50">
    <MarketHeader
      :is-logged-in="isAuthenticated"
      @toggle-menu="showMenu = !showMenu"
      @search="handleSearch"
      @search-clear="clearSearch"
      @header-height-changed="updateHeaderHeight"
    />

    <div
      v-if="!selectedCategory"
      class="bg-white border-b border-gray-200 px-4 py-3"
    >
      <div class="flex items-center space-x-4">
        <button
          @click="changeSortType('latest')"
          :class="[
            'px-3 py-1 text-sm font-medium rounded-md transition-colors',
            currentSort === 'latest'
              ? 'bg-orange-100 text-orange-600'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          최신순
        </button>
        <button
          @click="changeSortType('popular')"
          :class="[
            'px-3 py-1 text-sm font-medium rounded-md transition-colors',
            currentSort === 'popular'
              ? 'bg-orange-100 text-orange-600'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          인기순
        </button>
      </div>
    </div>

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

    <!-- 기존 하단 네비게이션, 글쓰기 버튼 동일 -->
    <BottomNavigation activePage="home" :userId="currentUserId" />
    <button
      @click="goToWritePage"
      class="fixed bottom-24 right-6 z-50 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <span class="font-medium text-base whitespace-nowrap">글쓰기</span>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
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
      searchQuery: "",
      showMenu: false,
      headerHeight: 56,
      searchLoading: false,
      selectedCategory: null,
    };
  },
  watch: {
    // ✅ 수정: 카테고리와 정렬 파라미터 모두 감지
    "$route.query": {
      deep: true,
      handler(newQuery, oldQuery) {
        // 카테고리나 정렬이 변경되었을 때만 데이터 다시 로드
        if (
          newQuery.category !== oldQuery.category ||
          newQuery.sort !== oldQuery.sort
        ) {
          this.selectedCategory = newQuery.category
            ? parseInt(newQuery.category)
            : null;
          this.loadItemsWithLikes();
        }
      },
    },
  },
  computed: {
    ...mapState("item", ["items", "loading", "error"]),
    ...mapState("itemLike", ["likedItems"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    currentSort() {
      return this.$route.query.sort || "latest";
    },

    currentUserId() {
      return this.currentUser?.userId || null;
    },

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
      return this.mergeLikeInfo(result);
    },

    filteredItems() {
      let result = this.processedItems;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
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
    ...mapActions("item", [
      "fetchItems",
      "fetchItemsByCategory",
      "fetchPopularItems",
    ]),
    ...mapActions("itemLike", ["fetchMyLikes"]),

    changeSortType(sortType) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          sort: sortType === "latest" ? undefined : sortType,
        },
      });
    },

    async loadItemsWithLikes() {
      try {
        const categoryId = this.$route.query.category;
        const sortType = this.$route.query.sort || "latest";

        let itemsPromise;

        if (categoryId) {
          // 카테고리가 있으면 무조건 카테고리별 조회 (최신순만)
          console.log("카테고리별 조회:", categoryId);
          itemsPromise = this.fetchItemsByCategory(parseInt(categoryId));
        } else if (sortType === "popular") {
          // 전체 인기순 조회
          console.log("전체 인기순 조회");
          itemsPromise = this.fetchPopularItems();
        } else {
          // 전체 최신순 조회
          console.log("전체 최신순 조회");
          itemsPromise = this.fetchItems();
        }

        const promises = [itemsPromise];
        if (this.isAuthenticated) {
          promises.push(this.fetchMyLikes());
        }

        await Promise.all(promises);
        console.log(
          "데이터 로드 완료 - 정렬:",
          sortType,
          "카테고리:",
          categoryId
        );
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    },

    goToWritePage() {
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }
      this.$router.push("/items/create");
    },

    mergeLikeInfo(items) {
      if (!this.likedItems || this.likedItems.length === 0) {
        return items;
      }
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
      return items.map((item) => {
        const itemId = item.itemId || (item.data && item.data.itemId);
        if (itemId && likeMap[itemId]) {
          if (item.data) {
            return {
              ...item,
              data: {
                ...item.data,
                isLiked: likeMap[itemId].isLiked,
                likeCount: likeMap[itemId].likeCount,
              },
            };
          } else {
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
      this.searchLoading = true;
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
        this.searchLoading = false;
      }
    },

    clearSearch() {
      this.searchQuery = "";
      const query = { ...this.$route.query };
      delete query.q;
      this.$router.push({
        path: this.$route.path,
        query,
      });
    },

    updateHeaderHeight(height) {
      this.headerHeight = height;
    },
  },
  async created() {
    if (this.$route.query.q) {
      this.searchQuery = this.$route.query.q;
    }
    if (this.$route.query.category) {
      this.selectedCategory = parseInt(this.$route.query.category);
    }
    await this.loadItemsWithLikes();
  },
};
</script>
