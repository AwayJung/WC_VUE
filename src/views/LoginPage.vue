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

      <!-- 에러 모달 -->
      <LoginErrorModal
          :visible="showErrorModal"
          :message="errorMessage"
          @close="showErrorModal = false"
      />

    </div>
  </div>
</template>

<script>
import LoginErrorModal from "@/views/LoginErrorModal.vue";

export default {
  components : { LoginErrorModal },
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      errorMessage: "",
      showErrorModal: false  // ← 모달 표시 여부
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";
      this.showErrorModal = false;

      try {
        // Vuex 액션 디스패치
        await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        });

        // 로그인 성공 처리
        this.$router.push('/');
      } catch (error) {
        console.error('로그인 실패:', error);

        if (error.response) {
          // API에서 오는 에러 메시지 처리
          const { message } = error.response.data;
          this.errorMessage = message || '로그인에 실패했습니다.';
        } else if (error.request) {
          this.errorMessage = '서버 응답이 없습니다. 네트워크 연결을 확인해주세요.';
        } else {
          this.errorMessage = '요청 중 오류가 발생했습니다.';
        }

        // 모달 열기
        this.showErrorModal = true;
      } finally {
        this.isLoading = false;
      }
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    }
  },
    created() {
      // 토큰의 유효성 확인
      if (this.isAuthenticated) {
        // 토큰 유효성 확인 로직 추가
        const token = this.$store.state.auth.accessToken;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            if (Date.now() >= exp) {
              // 토큰이 만료되었으면 스토어의 토큰 삭제
              this.$store.dispatch('auth/logout');
              return; // 로그인 페이지로 계속 진행
            }
          } catch (e) {
            // 오류 발생 시 스토어의 토큰 삭제
            this.$store.dispatch('auth/logout');
            return;
          }
        }
        // 토큰이 유효하면 홈으로 리디렉트
        this.$router.push('/');
      }
    },
};
</script>
