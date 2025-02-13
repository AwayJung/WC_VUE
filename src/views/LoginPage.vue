<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <img
          src="@/assets/logo/logo.svg"
          alt="로고"
          class="h-12 mx-auto mb-2"
        />
        <h2 class="text-2xl font-semibold text-gray-700">로그인</h2>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- 이메일 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <!-- 로그인 버튼 -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md focus:outline-none transition duration-150"
        >
          로그인
        </button>

        <!-- 추가 링크 -->
        <div class="flex justify-between text-sm mt-4 text-gray-600">
          <router-link to="/signup" class="hover:text-orange-500">
            회원가입
          </router-link>
          <router-link to="/forgot-password" class="hover:text-orange-500">
            비밀번호 찾기
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      // 로그인 처리
      this.$emit("login", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>
