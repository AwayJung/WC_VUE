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
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <h1 class="text-lg font-semibold text-gray-900">비밀번호 찾기</h1>
              <div class="w-10"></div>
            </div>
          </div>
        </div>

        <!-- 스크롤 가능한 컨텐츠 -->
        <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div class="px-4 py-6">
            <!-- 안내 메시지 -->
            <div class="text-center mb-8">
              <div
                class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                비밀번호를 잊으셨나요?
              </h2>
              <p class="text-gray-600 text-sm">
                가입하신 이메일 주소를 입력하시면<br />
                임시 비밀번호를 발송해 드립니다.
              </p>
            </div>

            <!-- 이메일 입력 폼 -->
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">
                  이메일 주소
                </label>
                <input
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                  placeholder="가입하신 이메일을 입력해주세요"
                />
              </div>
            </form>
          </div>
        </div>

        <!-- 하단 고정 버튼 영역 -->
        <div class="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <button
            @click="handleSubmit"
            :disabled="isLoading || !email"
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
              전송 중...
            </span>
            <span v-else>임시 비밀번호 발송</span>
          </button>

          <!-- 로그인 페이지로 돌아가기 -->
          <div class="text-center pt-3">
            <router-link
              to="/login"
              class="text-gray-500 hover:text-orange-500 text-sm"
            >
              로그인 페이지로 돌아가기
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { forgotPassword } from "@/api/login";

export default {
  name: "ForgotPassword",

  data() {
    return {
      email: "",
      isLoading: false,
    };
  },

  methods: {
    async handleSubmit() {
      if (!this.email) return;

      this.isLoading = true;

      try {
        await forgotPassword(this.email);

        alert("임시 비밀번호가 이메일로 발송되었습니다.");
        this.$router.push("/login");
      } catch (error) {
        console.error("비밀번호 찾기 실패:", error);

        let errorMessage = "이메일 발송에 실패했습니다.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        alert(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
