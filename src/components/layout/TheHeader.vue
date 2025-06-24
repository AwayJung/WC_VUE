<template>
  <header class="bg-white border-b">
    <div class="container mx-auto">
      <div class="flex items-center justify-between h-14 px-4">
        <div class="flex items-center space-x-8">
          <router-link to="/">
            <img
              src="@/assets/logo/logo.svg"
              alt="당근마켓 로고"
              class="h-10"
            />
          </router-link>
          <div class="hidden md:flex items-center space-x-6">
            <router-link
              :to="{ name: 'ItemListPage' }"
              class="text-base font-medium hover:text-orange-500"
            >
              중고 거래
            </router-link>
            <router-link
              :to="{ name: 'ItemListPage', query: { sort: 'popular' } }"
              class="text-base text-gray-400 font-medium hover:text-orange-500"
            >
              인기 매물
            </router-link>
            <router-link
              :to="{ name: 'ItemCreate' }"
              class="text-base text-gray-400 font-medium hover:text-orange-500"
            >
              물건 판매
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div v-if="!isAuthenticated" class="flex items-center space-x-2">
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
              :to="`/chat/${currentUserId}`"
              class="px-3 py-2 text-gray-700 hover:text-orange-500"
            >
              채팅
            </router-link>
            <router-link
              to="/mypage"
              class="px-3 py-2 text-gray-700 hover:text-orange-500"
            >
              나의 당근
            </router-link>
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

  computed: {
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]),

    currentUserId() {
      return this.currentUser?.userId || null;
    },
  },

  methods: {
    async handleLogout() {
      await this.$store.dispatch("auth/logout");
      alert("로그아웃 되었습니다.");

      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1160px;
}
</style>
