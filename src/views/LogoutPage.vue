<template>
  <!-- 로딩 인디케이터나 메시지를 추가해도 좋습니다 -->
  <div class="flex items-center justify-center h-screen">
    <p>로그아웃 중...</p>
  </div>
</template>

<script>
import { logout } from "@/login.js";

export default {
  name: "LogoutPage",
  async created() {
    try {
      await logout();               // login.js의 logout 함수 호출
    } catch (e) {
      console.error("Logout error:", e);
    }
    this.$router.replace("/home"); // 로그인 페이지로 이동 (히스토리 덮어쓰기)
  }
};
</script>

<style scoped>

</style>