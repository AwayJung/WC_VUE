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
          <!-- 검색 버튼 (조건부 표시) -->
          <button v-if="showSearchButton" class="p-2" @click="toggleSearchBar">
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

          <!-- 상태 변경 버튼 (자동으로 소유자만 표시) -->
          <button
            v-if="shouldShowStatusButton"
            @click="handleStatusToggle"
            :disabled="statusChanging"
            :class="getStatusButtonClass(currentItemStatus)"
            class="px-3 py-1 text-sm font-medium rounded-full transition-colors hover:opacity-80 disabled:opacity-50"
          >
            <span v-if="statusChanging" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              변경중...
            </span>
            <span v-else>
              {{ getStatusText(currentItemStatus) }}
            </span>
          </button>

          <!-- 메뉴 버튼 (미로그인 시) -->
          <div class="relative" v-if="!isLoggedIn">
            <button
              class="p-2"
              @click="toggleGuestMenu"
              :class="{ 'bg-gray-100 rounded': showGuestMenu }"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- 미로그인 드롭다운 메뉴 -->
            <div
              v-if="showGuestMenu"
              class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
              @click.stop
            >
              <router-link
                to="/login"
                class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeAllMenus"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                로그인
              </router-link>
              <router-link
                to="/signup"
                class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeAllMenus"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                회원가입
              </router-link>
              <div class="border-t border-gray-100 my-1"></div>

              <a
                href="notice"
                class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeAllMenus"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                공지사항
              </a>
            </div>
          </div>

          <!-- 로그인 시 버튼들 -->
          <div v-if="isLoggedIn" class="flex items-center space-x-3">
            <!-- 사용자 메뉴 버튼 -->
            <div class="relative">
              <button
                class="p-2"
                @click="toggleUserMenu"
                :class="{ 'bg-gray-100 rounded': showUserMenu }"
              >
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

              <!-- 사용자 드롭다운 메뉴 -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border py-2 z-50"
                @click.stop
              >
                <router-link
                  to="/mypage"
                  class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  @click="closeAllMenus"
                >
                  <svg
                    class="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  내 프로필
                </router-link>
                <router-link
                  to="/items/create"
                  class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  @click="closeAllMenus"
                >
                  <svg
                    class="w-5 h-5 mr-3"
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
                  상품 등록
                </router-link>
                <router-link
                  to="/chat"
                  class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  @click="closeAllMenus"
                >
                  <svg
                    class="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  채팅
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>

                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg
                    class="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  로그아웃
                </button>
              </div>
            </div>
          </div>
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

    <!-- 메뉴 바깥 클릭 시 닫기 위한 오버레이 -->
    <div
      v-if="showGuestMenu || showUserMenu"
      class="fixed inset-0 z-40"
      @click="closeAllMenus"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
    showSearchButton: {
      type: Boolean,
      default: true,
    },
    // 🔧 상태 변경 버튼 관련 props 추가
    showStatusButton: {
      type: Boolean,
      default: false,
    },
    currentItemId: {
      type: [String, Number],
      default: null,
    },
    currentItemStatus: {
      type: String,
      default: null,
    },
    currentItemSellerId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      showSearchBar: false,
      currentSearchQuery: "",
      headerObserver: null,
      statusChanging: false, // 🔧 상태 변경 로딩

      // 메뉴 상태
      showGuestMenu: false,
      showUserMenu: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["currentUser"]),

    // 🔧 자동으로 소유자인지 판단
    isItemOwner() {
      if (!this.currentUser?.userId || !this.currentItemSellerId) {
        return false;
      }

      // 타입 안전한 비교
      const currentUserId = String(this.currentUser.userId);
      const sellerId = String(this.currentItemSellerId);

      return currentUserId === sellerId;
    },

    // 🔧 상태 버튼 표시 여부 (자동 계산)
    shouldShowStatusButton() {
      return (
        this.showStatusButton &&
        this.isItemOwner &&
        this.currentItemStatus &&
        this.isLoggedIn
      );
    },
  },
  mounted() {
    this.setupHeaderObserver();
    this.$nextTick(() => {
      this.updateHeaderHeight();
    });
  },
  beforeDestroy() {
    if (this.headerObserver) {
      this.headerObserver.disconnect();
    }
  },
  watch: {
    showSearchBar() {
      this.$nextTick(() => {
        this.updateHeaderHeight();
      });
    },
    currentSearchQuery() {
      this.$nextTick(() => {
        this.updateHeaderHeight();
      });
    },
  },
  methods: {
    ...mapActions("item", ["changeItemStatus"]),

    // 🔧 상태 변경 관련 메서드들
    async handleStatusToggle() {
      if (!this.currentItemId || !this.currentUser?.userId) {
        alert("상태를 변경할 수 없습니다.");
        return;
      }

      const newStatus =
        this.currentItemStatus === "SELLING" ? "SOLD" : "SELLING";
      this.statusChanging = true;

      try {
        await this.changeItemStatus({
          itemId: this.currentItemId,
          status: newStatus,
          userId: this.currentUser.userId,
        });

        // 부모 컴포넌트에 상태 변경 알림
        this.$emit("status-changed", {
          itemId: this.currentItemId,
          newStatus,
        });
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경에 실패했습니다. 다시 시도해주세요.");
      } finally {
        this.statusChanging = false;
      }
    },

    getStatusButtonClass(status) {
      const classes = {
        SELLING: "bg-green-100 text-green-800 hover:bg-green-200",
        SOLD: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      };
      return (
        classes[status] || "bg-green-100 text-green-800 hover:bg-green-200"
      );
    },

    getStatusText(status) {
      const texts = {
        SELLING: "판매중",
        SOLD: "판매완료",
      };
      return texts[status] || "판매중";
    },

    // 기존 메서드들...
    setupHeaderObserver() {
      // 헤더 높이 관찰 (데스크톱용)
      if (typeof ResizeObserver !== "undefined") {
        this.headerObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.target === this.$el.querySelector("header")) {
              this.updateHeaderHeight();
            }
          }
        });

        const headerEl = this.$el.querySelector("header");
        if (headerEl) {
          this.headerObserver.observe(headerEl);
        }
      }
    },

    shareContent() {
      const url = window.location.href;
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
        this.hideSearchBar();
      }
    },

    hideSearchBar() {
      if (this.showSearchBar) {
        this.showSearchBar = false;
      }
      this.currentSearchQuery = "";
      this.$emit("search-clear-no-route");
    },

    onSearch(query) {
      this.currentSearchQuery = query;
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
      this.$emit("search-clear-no-route");
    },

    // 메뉴 메서드들
    toggleGuestMenu() {
      this.showGuestMenu = !this.showGuestMenu;
      this.showUserMenu = false;
    },

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
      this.showGuestMenu = false;
    },

    closeAllMenus() {
      this.showGuestMenu = false;
      this.showUserMenu = false;
    },

    handleLogout() {
      this.closeAllMenus();
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
      alert("로그아웃되었습니다.");
    },
  },
};
</script>
