<template>
  <div class="search-area">
    <!-- 검색창 -->
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="검색어를 입력해주세요"
        class="w-full bg-gray-100 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <svg
        class="w-5 h-5 absolute left-3 top-2.5 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-2.5 text-gray-500"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- 최근 검색어 -->
    <div
      v-if="showRecentSearches && !searchQuery && recentSearches.length > 0"
      class="mt-3"
    >
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm font-medium">최근 검색어</p>
        <button @click="clearAllRecentSearches" class="text-xs text-gray-500">
          전체 삭제
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(search, index) in recentSearches"
          :key="index"
          class="flex items-center bg-gray-100 rounded-full px-3 py-1"
        >
          <span class="text-sm mr-1" @click="selectRecentSearch(search)">{{
            search
          }}</span>
          <button @click="removeRecentSearch(index)">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SearchArea",

  props: {
    showRecentSearches: {
      type: Boolean,
      default: true,
    },
    redirectOnSearch: {
      type: Boolean,
      default: true,
    },
    initialQuery: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      searchQuery: this.initialQuery,
      recentSearches: [],
    };
  },

  mounted() {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      this.recentSearches = JSON.parse(savedSearches);
    }
  },

  methods: {
    ...mapActions("search", ["searchItems"]),

    async handleSearch() {
      if (!this.searchQuery.trim()) return;

      if (
        this.$route.name === "ItemListPage" &&
        this.$route.query.q === this.searchQuery
      ) {
        this.$emit("search", this.searchQuery);
        return;
      }

      this.addToRecentSearches(this.searchQuery);

      try {
        await this.$router.push({
          name: "ItemListPage",
          query: { q: this.searchQuery },
        });
        this.$emit("search", this.searchQuery);
      } catch (error) {
        if (error.name !== "NavigationDuplicated") {
          console.error("검색 오류:", error);
        } else {
          this.$emit("search", this.searchQuery);
        }
      }
    },

    clearSearch() {
      this.searchQuery = "";
      this.$emit("clear");
    },

    addToRecentSearches(query) {
      const index = this.recentSearches.indexOf(query);
      if (index !== -1) {
        this.recentSearches.splice(index, 1);
      }

      this.recentSearches.unshift(query);

      if (this.recentSearches.length > 10) {
        this.recentSearches.pop();
      }

      localStorage.setItem(
        "recentSearches",
        JSON.stringify(this.recentSearches)
      );
    },

    selectRecentSearch(search) {
      this.searchQuery = search;
      this.handleSearch();
    },

    removeRecentSearch(index) {
      this.recentSearches.splice(index, 1);
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(this.recentSearches)
      );
    },

    clearAllRecentSearches() {
      this.recentSearches = [];
      localStorage.removeItem("recentSearches");
    },
  },

  watch: {
    initialQuery: {
      handler(newVal) {
        this.searchQuery = newVal;
      },
    },
  },
};
</script>
