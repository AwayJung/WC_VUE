<template>
  <div>
    <!-- 헤더 고정 위치 -->
    <header class="fixed top-0 left-0 right-0 bg-white z-50 border-b">
      <div class="flex items-center justify-between px-4 h-14">
        <div class="flex items-center space-x-2">
          <!-- 로고 -->
          <router-link to="/" class="flex items-center">
            <img
              src="@/assets/logo/logo.svg"
              alt="당근마켓 로고"
              class="h-11"
            />
          </router-link>
        </div>

        <div class="flex items-center space-x-3">
          <!-- 검색 버튼 -->
          <button class="p-2" @click="toggleSearchBar">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <!-- 메뉴 버튼 -->
          <button class="p-2" v-if="!isLoggedIn" @click="$emit('toggle-menu')">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- 알림 버튼 (로그인 시) -->
          <button class="p-2" v-if="isLoggedIn">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <!-- 메뉴 버튼 (로그인 시) -->
          <button class="p-2" v-if="isLoggedIn" @click="$emit('toggle-menu')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 검색창 (토글 시 표시) -->
      <div v-if="showSearchBar" class="w-full px-4 py-3 border-t bg-white">
        <SearchArea
          :redirectOnSearch="false"
          :currentSearchQuery="currentSearchQuery"
          @search="onSearch"
          @clear="onSearchClear"
        />
      </div>
    </header>

    <!-- 실제 헤더 높이만큼 공간 확보-->
    <div ref="headerSpacer" class="w-full"></div>
  </div>
</template>

<script>
import SearchArea from "@/components/layout/SearchArea.vue";

export default {
  name: "MarketHeader",
  components: {
    SearchArea,
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSearchBar: false,
      currentSearchQuery: "",
      headerObserver: null,
    };
  },
  mounted() {
    // ResizeObserver 설정
    this.setupHeaderObserver();

    // 초기 높이 설정
    this.$nextTick(() => {
      this.updateHeaderHeight();
    });
  },
  beforeDestroy() {
    // ResizeObserver 정리
    if (this.headerObserver) {
      this.headerObserver.disconnect();
    }
  },
  watch: {
    // 검색창 상태 변경 감시
    showSearchBar() {
      this.$nextTick(() => {
        this.updateHeaderHeight();
      });
    },
    // 검색어 변경 감시
    currentSearchQuery() {
      this.$nextTick(() => {
        this.updateHeaderHeight();
      });
    },
  },
  methods: {
    setupHeaderObserver() {
      if (typeof ResizeObserver !== "undefined") {
        this.headerObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === this.$el.querySelector("header")) {
              this.updateHeaderHeight();
            }
          }
        });

        // 헤더 요소 관찰 시작
        const headerEl = this.$el.querySelector("header");
        if (headerEl) {
          this.headerObserver.observe(headerEl);
        }
      }
    },

    // 헤더 높이 업데이트
    updateHeaderHeight() {
      const headerEl = this.$el.querySelector("header");
      const spacerEl = this.$refs.headerSpacer;

      if (headerEl && spacerEl) {
        const height = headerEl.offsetHeight;
        spacerEl.style.height = `${height}px`;
        this.$emit("header-height-changed", height);
      }
    },

    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar;
      if (!this.showSearchBar) {
        this.currentSearchQuery = "";
        this.$emit("search-clear");
      }
    },

    onSearch(query) {
      this.currentSearchQuery = query;

      this.$router
        .push({
          name: "ItemListPage",
          query: { q: query },
        })
        .catch((err) => {
          if (err.name !== "NavigationDuplicated") {
            console.error("라우팅 오류:", err);
          }
        });

      this.$emit("search", query);
    },

    onSearchClear() {
      this.currentSearchQuery = "";
      this.$emit("search-clear");
    },
  },
};
</script>
