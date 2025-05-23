<!-- SideBar.vue -->
<template>
  <div>
    <!-- 사이드바 오버레이 (배경 어둡게) -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="$emit('close')"
    ></div>

    <!-- 사이드바 메뉴 -->
    <div
      class="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-lg transition-transform duration-300 transform"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- 사이드바 헤더 -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-medium">메뉴</h2>
        <button @click="$emit('close')" class="p-2">
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
              @click="$emit('close')"
            >
              로그인
            </router-link>
            <router-link
              to="/signup"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              회원가입
            </router-link>
          </div>

          <!-- 로그인한 경우 메뉴 -->
          <div v-else class="space-y-4">
            <router-link
              to="/profile"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              내 프로필
            </router-link>
            <router-link
              to="/my-sales"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              판매내역
            </router-link>
            <router-link
              to="/purchases"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              구매내역
            </router-link>
            <router-link
              to="/liked-items"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
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
              to="/notices"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              공지사항
            </router-link>
            <router-link
              to="/faq"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              자주 묻는 질문
            </router-link>
            <router-link
              to="/settings"
              class="block py-2 px-4 rounded hover:bg-gray-100"
              @click="$emit('close')"
            >
              설정
            </router-link>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleLogout() {
      // 로그아웃 처리 로직
      // 예: this.$store.dispatch('auth/logout');

      // 사이드바 닫기
      this.$emit("close");

      // 홈으로 이동
      this.$router.push("/");
    },
  },
};
</script>
