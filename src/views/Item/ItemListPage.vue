<template>
  <div class="min-h-screen bg-gray-50">
    <MarketHeader
      :is-logged-in="isAuthenticated"
      menu-mode="default"
      @toggle-menu="showMenu = !showMenu"
      @search="handleSearch"
      @search-clear="clearSearch"
      @header-height-changed="updateHeaderHeight"
    />

    <!-- 페이지 제목 표시 (내 판매상품일 경우) -->
    <div
      v-if="pageTitle && pageTitle !== '상품목록'"
      class="bg-white border-b border-gray-200 px-4 py-3"
    >
      <h1 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h1>
    </div>

    <!-- 정렬 버튼 (카테고리가 선택되지 않았고, 판매자 필터가 없을 때만 표시) -->
    <div
      v-if="!selectedCategory && !isSellerFilter"
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
        v-else-if="
          (searchQuery && filteredItems.length === 0) ||
          (isSellerFilter && filteredItems.length === 0)
        "
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
          <p class="text-gray-500 font-medium">
            {{
              isSellerFilter
                ? "등록된 상품이 없습니다."
                : "검색 결과가 없습니다."
            }}
          </p>
          <p class="text-sm text-gray-400 mt-2">
            {{
              isSellerFilter
                ? "첫 상품을 등록해보세요!"
                : "다른 검색어로 시도해보세요."
            }}
          </p>
          <!-- 내 판매상품 페이지에서 상품 등록 버튼 -->
          <button
            v-if="isMySellerPage"
            @click="goToWritePage"
            class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            상품 등록하기
          </button>
        </div>
      </div>
      <div v-else>
        <ItemList :items="filteredItems" />
      </div>
    </main>

    <!-- 하단 네비게이션 -->
    <BottomNavigation activePage="home" :userId="currentUserId" />

    <!-- 글쓰기 버튼 (내 판매상품 페이지가 아닐 때만 표시) -->
    <button
      v-if="!isSellerFilter"
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
    "$route.query": {
      deep: true,
      handler(newQuery, oldQuery) {
        if (
          newQuery.category !== oldQuery.category ||
          newQuery.sort !== oldQuery.sort ||
          newQuery.sellerId !== oldQuery.sellerId ||
          newQuery.type !== oldQuery.type
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

    isSellerFilter() {
      return !!this.$route.query.sellerId;
    },

    isMySellerPage() {
      return (
        this.isSellerFilter &&
        this.$route.query.sellerId === this.currentUserId?.toString() &&
        this.$route.query.type === "my-sales"
      );
    },

    pageTitle() {
      const type = this.$route.query.type;
      const customTitle = this.$route.query.title;

      if (customTitle) return customTitle;

      switch (type) {
        case "my-sales":
          return "내 판매상품";
        case "my-likes":
          return "관심목록";
        default:
          return "상품목록";
      }
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

      if (this.isSellerFilter) {
        const sellerId = parseInt(this.$route.query.sellerId);
        result = result.filter((item) => {
          const itemSellerId =
            item.sellerId || (item.data && item.data.sellerId);
          return itemSellerId === sellerId;
        });
      }

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
        const sellerId = this.$route.query.sellerId;

        let itemsPromise;

        if (sellerId) {
          itemsPromise = this.fetchItems();
        } else if (categoryId) {
          itemsPromise = this.fetchItemsByCategory(parseInt(categoryId));
        } else if (sortType === "popular") {
          itemsPromise = this.fetchPopularItems();
        } else {
          itemsPromise = this.fetchItems();
        }

        const promises = [itemsPromise];
        if (this.isAuthenticated) {
          promises.push(this.fetchMyLikes());
        }

        await Promise.all(promises);
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
