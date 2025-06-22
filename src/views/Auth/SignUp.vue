<template>
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
            <h1 class="text-lg font-semibold text-gray-900">회원가입</h1>
            <div class="w-10"></div>
          </div>
        </div>
      </div>

      <!-- 스크롤 가능한 컨텐츠 -->
      <div class="overflow-y-auto max-h-[calc(90vh-80px)]">
        <div class="px-4 py-6">
          <!-- 프로필 이미지 섹션 -->
          <div class="text-center mb-8">
            <div class="relative inline-block">
              <!-- 프로필 이미지 또는 기본 아이콘 -->
              <div
                class="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="프로필 미리보기"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <svg
                  v-else
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>

              <!-- 카메라 버튼 -->
              <button
                type="button"
                @click="$refs.profileImageInput.click()"
                class="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>

              <!-- 숨겨진 파일 입력 -->
              <input
                ref="profileImageInput"
                type="file"
                accept="image/*"
                @change="handleProfileImageUpload"
                class="hidden"
              />
            </div>

            <p class="text-sm text-gray-500 mt-3">프로필 사진을 설정해보세요</p>
            <p class="text-xs text-gray-400">(선택사항)</p>

            <!-- 사진 삭제 버튼 -->
            <button
              v-if="profileImage"
              type="button"
              @click="removeProfileImage"
              class="mt-2 text-sm text-red-500 hover:text-red-600"
            >
              사진 삭제
            </button>
          </div>

          <!-- 회원가입 폼 -->
          <form @submit.prevent="handleSignup" class="space-y-5">
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
                placeholder="10자 이상 입력해주세요"
              />
              <p class="text-xs text-gray-500 mt-1">
                영문, 숫자 포함 10자 이상
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                비밀번호 확인
              </label>
              <input
                v-model="passwordConfirm"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                이름
              </label>
              <input
                v-model="name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                placeholder="실명을 입력해주세요"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                닉네임
              </label>
              <input
                v-model="nickname"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                placeholder="다른 사용자에게 보여질 이름"
              />
              <p class="text-xs text-gray-500 mt-1">2자 이상 입력해주세요</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                자기소개
                <span class="text-gray-500 font-normal">(선택사항)</span>
              </label>
              <div class="relative">
                <textarea
                  v-model="introduction"
                  rows="3"
                  maxlength="300"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base resize-none"
                  placeholder="나를 소개하는 한 마디를 적어보세요!"
                ></textarea>
                <!-- 글자수 카운터 -->
                <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                  {{ introduction.length }}/300
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 하단 고정 버튼 영역 -->
      <div class="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <button
          @click="handleSignup"
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
            가입 중...
          </span>
          <span v-else>당근마켓 시작하기</span>
        </button>

        <!-- 로그인 링크 -->
        <div class="text-center pt-3">
          <p class="text-gray-600 text-sm">
            이미 계정이 있나요?
            <router-link
              to="/login"
              class="text-orange-500 hover:text-orange-600 font-medium ml-1"
            >
              로그인하기
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleImageError } from "@/utils/imageUtils";

export default {
  name: "SignupPage",
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      nickname: "",
      introduction: "",
      profileImage: null, // 업로드할 이미지 파일
      previewImage: null, // 미리보기용 이미지 URL
      isLoading: false,
    };
  },
  methods: {
    // 이미지 로드 에러 시 기본 이미지로 대체
    handleImageError(event) {
      handleImageError(event);
    },

    // 프로필 이미지 업로드 처리
    handleProfileImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 파일 유효성 검사
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하로 선택해주세요.");
        event.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        event.target.value = "";
        return;
      }

      this.profileImage = file;

      // 미리보기 이미지 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    // 선택된 프로필 이미지 제거
    removeProfileImage() {
      this.profileImage = null;
      this.previewImage = null;
      if (this.$refs.profileImageInput) {
        this.$refs.profileImageInput.value = "";
      }
    },

    // 회원가입 처리
    async handleSignup() {
      // 입력값 유효성 검사
      if (this.password.length < 10) {
        alert("비밀번호를 10자리 이상 작성하세요.");
        return;
      }
      if (this.name.length < 2) {
        alert("이름을 2자 이상 작성하세요.");
        return;
      }
      if (this.nickname.length < 2) {
        alert("닉네임을 2자 이상 작성하세요.");
        return;
      }
      if (this.password !== this.passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      this.isLoading = true;

      try {
        const signupData = {
          loginEmail: this.email,
          password: this.password,
          name: this.name,
          nickname: this.nickname,
          introduction: this.introduction,
        };

        // 프로필 이미지 유무에 따른 분기 처리
        if (this.profileImage) {
          await this.$store.dispatch("auth/signupWithImage", {
            signupData,
            profileImage: this.profileImage,
          });
        } else {
          await this.$store.dispatch("auth/signup", signupData);
        }

        alert("회원가입이 완료되었습니다! 당근마켓에 오신 것을 환영합니다.");
        this.$router.push("/");
      } catch (err) {
        console.error(err);
        alert("회원가입 실패: " + (err.message || "서버 오류가 발생했습니다."));
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
