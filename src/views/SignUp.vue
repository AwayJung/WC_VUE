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
        <h2 class="text-2xl font-semibold text-gray-700">회원가입</h2>
      </div>

      <!-- 회원가입 폼 -->
      <form @submit.prevent="handleSignup" class="space-y-4">
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

        <!-- 비밀번호 확인 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            비밀번호 확인
          </label>
          <input
              v-model="passwordConfirm"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <!-- 닉네임 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            닉네임
          </label>
          <input
              v-model="nickname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="닉네임을 입력하세요"
          />
        </div>

        <!-- 회원가입 버튼 -->
        <button
            type="submit"
            class="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md focus:outline-none transition duration-150"
        >
          회원가입
        </button>

        <!-- 추가 링크 -->
        <div class="text-center text-sm mt-4 text-gray-600">
          이미 계정이 있으신가요?
          <router-link
              to="/login"
              class="text-orange-500 hover:text-orange-600 ml-1"
          >
            로그인하기
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupPage",
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    };
  },
  methods: {
    async handleSignup() {
      let errorMessage = "";

      if (this.password.length < 10) {
        errorMessage = "비밀번호를 10자리 이상 작성하세요.";
      }
      else if (this.nickname.length < 2) {
        errorMessage = "닉네임을 2자 이상 작성하세요.";
      }
      else if (this.password !== this.passwordConfirm) {
        errorMessage = "비밀번호가 일치하지 않습니다.";
      }

      if (errorMessage) {
        alert(errorMessage);
        return;
      }

      // 회원가입 처리
      const signupData = {
        loginEmail: this.email,
        password: this.password,
        name: this.nickname,
      };

      try {
        await this.$store.dispatch("auth/signup", signupData);
        alert("회원가입이 완료되었습니다.");
        this.$router.push("/");
      } catch (err) {
        console.error(err);
        alert("회원가입 실패: " + (err.message || "서버 오류"));
      }
    },
  },
};
</script>
