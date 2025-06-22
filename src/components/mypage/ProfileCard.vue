<template>
  <div class="bg-white rounded-xl shadow-sm border p-8 mb-8">
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-6 flex-1">
        <div class="relative">
          <img
            :src="profileImage"
            :alt="displayName"
            class="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
          />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ displayName }}
          </h2>
          <div class="flex items-center space-x-4 mb-4">
            <span class="text-gray-600">가입일 • {{ formatJoinDate() }}</span>
          </div>

          <!-- 자기소개 섹션 (내용이 있을 때만 표시) -->
          <div v-if="userIntroduction" class="max-w-2xl">
            <div
              class="text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4 border"
            >
              {{ userIntroduction }}
            </div>
          </div>
        </div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="flex-shrink-0 flex flex-col space-y-3">
        <!-- 프로필 수정 버튼 -->
        <button
          @click="handleEditProfile"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2"
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span>프로필 수정</span>
        </button>

        <!-- 비밀번호 변경 버튼 -->
        <button
          @click="handleChangePassword"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium flex items-center space-x-2"
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>비밀번호 변경</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProfileCard",
  emits: ["edit-profile", "change-password"],

  data() {
    return {
      // 자기소개 관련 데이터 제거 (모달에서 처리)
    };
  },

  computed: {
    ...mapGetters("auth", [
      "currentUser",
      "isAuthenticated",
      "userProfile",
      "userIntroduction",
    ]),

    displayName() {
      return this.userProfile?.nickname;
    },

    profileImage() {
      const imageFileName =
        this.userProfile?.profileImage || this.currentUser?.profileImage;

      if (imageFileName) {
        // 백엔드에서 제공하는 이미지 URL로 변경 (실제 서버 경로에 맞게 수정)
        return `http://localhost:8080/images/${imageFileName}`;
      }

      return require("@/assets/images/carrot_profile_default.jpg");
    },
  },

  methods: {
    ...mapActions("auth", ["fetchUserProfile"]),

    formatJoinDate() {
      const regDt = this.userProfile?.regDt || this.currentUser?.regDt;
      if (regDt) {
        const date = new Date(regDt);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      }
      return "";
    },

    handleEditProfile() {
      this.$emit("edit-profile");
    },

    handleChangePassword() {
      this.$emit("change-password");
    },
  },

  // 컴포넌트 마운트 시 프로필 정보 로드
  async mounted() {
    try {
      await this.fetchUserProfile();
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
    }
  },
};
</script>
