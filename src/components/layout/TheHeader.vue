<template>
  <header class="bg-white border-b">
    <div class="container mx-auto">
      <!-- Top Header -->
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center space-x-8">
          <router-link to="/">
            <img src="@/assets/logo/logo.svg" alt="당근마켓 로고" class="h-9" />
          </router-link>
          <div class="hidden md:flex items-center space-x-6">
            <a href="#" class="text-base font-medium">중고거래</a>
            <a href="#" class="text-base text-gray-400">부동산</a>
            <a href="#" class="text-base text-gray-400">중고차</a>
            <a href="#" class="text-base text-gray-400">알바</a>
            <a href="#" class="text-base text-gray-400">동네업체</a>
            <a href="#" class="text-base text-gray-400">모임</a>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div v-if="!isLoggedIn" class="flex items-center space-x-2">
            <router-link
              to="/login"
              class="px-3 py-2 text-gray-700 hover:text-orange-500"
            >
              로그인
            </router-link>
            <router-link
              to="/signup"
              class="px-3 py-2 text-gray-700 hover:text-orange-500"
            >
              회원가입
            </router-link>
          </div>
          <div v-else class="flex items-center space-x-2">
            <router-link
              :to="`/chat/${userId}`"
              class="px-3 py-2 text-gray-700 hover:text-orange-500"
            >
              채팅
            </router-link>
            <button class="px-3 py-2 text-gray-700 hover:text-orange-500">
              마이페이지
            </button>
            <button
                @click="handleLogout"
                class="px-3 py-2 text-gray-700 hover:text-orange-500"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheHeader",
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: "",
    },
  },
  computed: {
    // auth 네임스페이스의 getters를 로컬 computed 이름으로 매핑
    ...mapGetters('auth', {
      // 로컬에서 사용할 이름 : '스토어에 정의된 getter 이름'
      isLoggedIn: 'isAuthenticated'
    })
  },
  methods: {
    async handleLogout() {
      // 1) Vuex 액션 호출
      await this.$store.dispatch('auth/logout');
      // 페이지 강제 새로고침
      window.location.reload();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1160px;
}
</style>
