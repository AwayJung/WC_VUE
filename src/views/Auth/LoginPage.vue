<template>
  <div>
    <!-- 모달 오버레이 -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <!-- 모달 컨테이너 -->
      <div
        class="bg-white w-full sm:max-w-md sm:w-full sm:rounded-2xl max-h-[90vh] overflow-hidden"
      >
        <!-- 헤더 -->
        <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div class="px-4 py-4">
            <div class="flex items-center justify-between">
              <button
                @click="$router.go(-1)"
                class="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <h1 class="text-lg font-semibold text-gray-900">로그인</h1>
              <div class="w-10"></div>
            </div>
          </div>
        </div>

        <!-- 스크롤 가능한 컨텐츠 -->
        <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div class="px-4 py-6">
            <!-- 로고 섹션 -->
            <div class="text-center mb-10">
              <img
                src="@/assets/logo/logo.svg"
                alt="당근마켓 로고"
                class="h-20 mx-auto"
              />
            </div>

            <!-- 로그인 폼 -->
            <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  이메일 주소
                </label>
                <input
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  비밀번호
                </label>
                <input
                  v-model="password"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>

              <!-- 옵션 링크 -->
              <div class="flex justify-end">
                <router-link
                  to="/forgot-password"
                  class="text-sm text-gray-500 hover:text-orange-500"
                >
                  비밀번호를 잊으셨나요?
                </router-link>
              </div>
            </form>
          </div>
        </div>

        <!-- 하단 고정 버튼 영역 -->
        <div class="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <button
            @click="handleLogin"
            :disabled="isLoading"
            class="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 text-base"
          >
            <!-- 로딩 상태 표시 -->
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              로그인 중...
            </span>
            <span v-else>로그인</span>
          </button>

          <!-- 회원가입 링크 -->
          <div class="text-center pt-3">
            <p class="text-gray-600 text-sm">
              아직 계정이 없나요?
              <router-link
                to="/signup"
                class="text-orange-500 hover:text-orange-600 font-medium ml-1"
              >
                회원가입하기
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 에러 모달 -->
    <LoginErrorModal
      :visible="showErrorModal"
      :message="errorMessage"
      @close="showErrorModal = false"
    />
  </div>
</template>

<script>
import LoginErrorModal from "@/views/Auth/LoginErrorModal.vue";

export default {
  name: "LoginPage",

  components: {
    LoginErrorModal,
  },

  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      errorMessage: "",
      showErrorModal: false,
    };
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },

  created() {
    if (this.isAuthenticated) {
      const token = this.$store.state.auth.accessToken;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const exp = payload.exp * 1000;
          if (Date.now() >= exp) {
            this.$store.dispatch("auth/logout");
            return;
          }
        } catch (e) {
          this.$store.dispatch("auth/logout");
          return;
        }
      }
      this.$router.push("/");
    }
  },

  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";
      this.showErrorModal = false;

      try {
        await this.$store.dispatch("auth/login", {
          email: this.email,
          password: this.password,
        });

        this.$router.push("/");
      } catch (error) {
        console.error("로그인 실패:", error);

        if (error.response) {
          const { message } = error.response.data;
          this.errorMessage = message || "로그인에 실패했습니다.";
        } else if (error.request) {
          this.errorMessage =
            "서버 응답이 없습니다. 네트워크 연결을 확인해주세요.";
        } else {
          this.errorMessage = "요청 중 오류가 발생했습니다.";
        }

        this.showErrorModal = true;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
