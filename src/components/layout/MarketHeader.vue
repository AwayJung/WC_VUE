<template>
  <header class="fixed top-0 left-0 right-0 bg-white z-50 border-b">
    <div class="flex items-center justify-between px-4 h-14">
      <div class="flex items-center space-x-2">
        <!-- 로고 -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo/logo.svg" alt="당근마켓 로고" class="h-11" />
        </router-link>
      </div>

      <div class="flex items-center space-x-3">
        <!-- 검색 버튼 -->
        <button class="p-2">
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
  </header>
</template>

<script>
export default {
  name: "MarketHeader",
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
