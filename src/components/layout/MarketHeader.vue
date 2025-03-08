<template>
  <div>
    <!-- 헤더 고정 위치 -->
    <header class="fixed top-0 left-0 right-0 bg-white z-40 border-b">
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
          <button class="p-2" v-if="!isLoggedIn" @click="toggleSidebar">
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
          <button class="p-2" v-if="isLoggedIn" @click="toggleSidebar">
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

    <!-- 사이드바 -->
    <div>
      <!-- 사이드바 오버레이 -->
      <div
        v-if="showSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-45"
        @click="closeSidebar"
      ></div>

      <!-- 사이드바 메뉴 -->
      <div
        class="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-lg transition-transform duration-300 transform"
        :class="showSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <!-- 사이드바 헤더 -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-medium">MENU</h2>
          <button @click="closeSidebar" class="p-2">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 사이드바 콘텐츠 -->
        <div class="p-4">
          <nav class="space-y-4">
            <!-- 로그인/비로그인 상태에 따라 다른 메뉴 표시 -->
            <div v-if="!isLoggedIn" class="space-y-4">
              <router-link
                to="/login"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                로그인
              </router-link>
              <router-link
                to="/signup"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                회원가입
              </router-link>
            </div>

            <!-- 로그인한 경우 메뉴 -->
            <div v-else class="space-y-4">
              <router-link
                to="/profile"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                내 프로필
              </router-link>
              <router-link
                to="/items/create"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                물건 등록하기
              </router-link>
              <router-link
                to="/favorites"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                관심목록
              </router-link>
              <button
                @click="handleLogout"
                class="w-full text-left py-2 px-4 rounded hover:bg-gray-100 text-red-500"
              >
                로그아웃
              </button>
            </div>

            <!-- 공통 메뉴 -->
            <div class="pt-4 mt-4 border-t space-y-4">
              <router-link
                to="/items"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                판매 내역
              </router-link>
              <router-link
                to="/settings"
                class="block py-2 px-4 rounded hover:bg-gray-100"
                @click="closeSidebar"
              >
                고객 센터
              </router-link>
            </div>
          </nav>
        </div>
      </div>
    </div>

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
      showSidebar: false,
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

    // ESC 키를 눌렀을 때 사이드바 닫기
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroy() {
    // ResizeObserver 정리
    if (this.headerObserver) {
      this.headerObserver.disconnect();
    }

    // 이벤트 리스너 정리
    window.removeEventListener("keydown", this.handleKeyDown);
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
    // 사이드바 상태 변경 감시
    showSidebar(newVal) {
      if (newVal) {
        // 사이드바가 열리면 body 스크롤 방지
        document.body.style.overflow = "hidden";
      } else {
        // 사이드바가 닫히면 body 스크롤 허용
        document.body.style.overflow = "";
      }
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

    // 사이드바 토글
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },

    // 사이드바 닫기
    closeSidebar() {
      this.showSidebar = false;
    },

    // ESC 키 처리
    handleKeyDown(e) {
      if (e.key === "Escape") {
        this.closeSidebar();
      }
    },

    // 로그아웃 처리
    handleLogout() {
      // 로그아웃 로직 구현
      // 예: this.$store.dispatch('auth/logout');

      // 사이드바 닫기
      this.closeSidebar();

      // 홈으로 이동
      this.$router.push("/");
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

<style scoped>
/* 사이드바 트랜지션 효과 */
.transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
