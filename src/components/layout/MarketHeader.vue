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

          <!-- 공유  버튼 (로그인 시) -->
          <button class="p-2" v-if="isLoggedIn" @click="shareContent">
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
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

    shareContent() {
      // 현재 페이지 URL 가져오기
      const url = window.location.href;

      // 공유 기능 지원 확인
      if (navigator.share) {
        navigator
          .share({
            title: "당근마켓에서 공유하기",
            url: url,
          })
          .catch((error) => {
            console.error("공유하기 에러:", error);
          });
      } else {
        // 기본 클립보드 복사 대체 기능
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert("URL이 클립보드에 복사되었습니다.");
          })
          .catch((err) => {
            console.error("클립보드 복사 실패:", err);
          });
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

    // 검색창 토글 (보이기/숨기기)
    toggleSearchBar() {
      this.showSearchBar = !this.showSearchBar;

      // 검색창을 닫을 때만 검색어 초기화 및 이벤트 발생
      if (!this.showSearchBar) {
        this.hideSearchBar();
      }
    },

    // 검색창 숨기기
    hideSearchBar() {
      if (this.showSearchBar) {
        this.showSearchBar = false;
      }

      // 검색어 초기화
      this.currentSearchQuery = "";

      // 검색어 초기화 이벤트 발생 (라우터 관련 코드는 부모에서 처리 안 하도록 특별 이벤트 발생)
      this.$emit("search-clear-no-route");
    },

    onSearch(query) {
      this.currentSearchQuery = query;

      // 현재 라우트와 같은 경우 NavigationDuplicated 에러 방지
      const currentQuery = this.$route.query.q || "";
      if (currentQuery === query) {
        return;
      }

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

      // 부모 컴포넌트에서는 이 이벤트를 받아서 라우터 조작을 하지 않도록 안내 필요
      this.$emit("search-clear-no-route");
    },
  },
};
</script>
