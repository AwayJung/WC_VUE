<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-xl p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
    >
      <h3 class="text-xl font-semibold mb-6">프로필 수정</h3>

      <div class="space-y-6">
        <!-- 프로필 이미지 -->
        <div class="text-center">
          <img
            :src="currentProfileImage"
            alt="프로필"
            class="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-orange-100"
            @error="handleImageError"
          />
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden"
            ref="imageInput"
          />
          <div class="flex justify-center space-x-2">
            <button
              @click="$refs.imageInput.click()"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              사진 변경
            </button>
            <button
              v-if="userProfile?.profileImage"
              @click="handleDeleteImage"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              사진 삭제
            </button>
          </div>
        </div>

        <!-- 닉네임 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            닉네임
          </label>
          <input
            v-model="editForm.nickname"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="닉네임을 입력하세요"
          />
          <p class="text-xs text-gray-500 mt-1">
            빈칸으로 두면 기존 닉네임이 유지됩니다
          </p>
        </div>

        <!-- 자기소개 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            자기소개
          </label>
          <textarea
            v-model="editForm.introduction"
            rows="4"
            maxlength="300"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            placeholder="자신을 소개해주세요 (최대 300자)"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">
              {{ editForm.introduction.length }}/300
            </span>
            <button
              v-if="editForm.introduction"
              @click="editForm.introduction = ''"
              class="text-xs text-gray-400 hover:text-gray-600"
            >
              지우기
            </button>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="flex space-x-3 mt-8">
        <button
          @click="handleClose"
          class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
          :disabled="isSaving"
        >
          취소
        </button>
        <button
          @click="handleSave"
          class="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
          :disabled="isSaving"
          :class="{ 'opacity-50 cursor-not-allowed': isSaving }"
        >
          {{ isSaving ? "저장 중..." : "저장" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  getImageUrl,
  getPlaceholderImage,
  handleImageError,
} from "@/utils/imageUtils";

export default {
  name: "ProfileEditModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "save"],

  data() {
    return {
      editForm: {
        nickname: "",
        introduction: "",
        profileImage: null, // 새로 업로드할 이미지 파일
      },
      isSaving: false,
      previewImage: null, // 미리보기용 이미지 URL
    };
  },

  computed: {
    ...mapGetters("auth", ["userProfile", "profileLoading"]),

    // 현재 표시할 프로필 이미지
    currentProfileImage() {
      // 새로 선택한 이미지가 있으면 미리보기 표시
      if (this.previewImage) {
        return this.previewImage;
      }

      // 기존 프로필 이미지가 있으면 유틸리티 함수 사용
      if (this.userProfile?.profileImage) {
        return getImageUrl(this.userProfile.profileImage);
      }

      // 기본 이미지 (프로필 전용)
      try {
        return require("@/assets/images/carrot_profile_default.jpg");
      } catch (error) {
        return getPlaceholderImage();
      }
    },

    // 🔧 유효성 검사 로직 제거 (항상 저장 가능)
    isFormValid() {
      return true; // 항상 저장 가능하도록 변경
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.initForm();
      } else {
        this.resetForm();
      }
    },
  },

  methods: {
    ...mapActions("auth", [
      "fetchUserProfile",
      "updateUserProfile",
      "updateUserIntroduction",
      "updateUserProfileImage",
      "deleteUserProfileImage",
    ]),

    async initForm() {
      // 프로필 정보가 없으면 먼저 로드
      if (!this.userProfile) {
        try {
          await this.fetchUserProfile();
        } catch (error) {
          console.error("프로필 로드 실패:", error);
        }
      }

      // 폼 초기화 - 기존 값으로 미리 채우기
      this.editForm = {
        nickname: this.userProfile?.nickname || "", // 기존 닉네임으로 미리 채우기
        introduction: this.userProfile?.introduction || "", // 기존 자기소개로 미리 채우기
        profileImage: null,
      };
      this.previewImage = null;
    },

    resetForm() {
      this.editForm = {
        nickname: "",
        introduction: "",
        profileImage: null,
      };
      this.previewImage = null;
      this.isSaving = false;

      // 파일 input 초기화
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = "";
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하로 선택해주세요.");
        event.target.value = "";
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        event.target.value = "";
        return;
      }

      this.editForm.profileImage = file;

      // 미리보기 이미지 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log("이미지 선택:", file.name);
    },

    async handleDeleteImage() {
      if (!confirm("프로필 이미지를 삭제하시겠습니까?")) {
        return;
      }

      try {
        this.isSaving = true;
        await this.deleteUserProfileImage();

        // 폼과 미리보기 초기화
        this.editForm.profileImage = null;
        this.previewImage = null;
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = "";
        }

        this.$toast?.success?.("프로필 이미지가 삭제되었습니다.");
      } catch (error) {
        console.error("프로필 이미지 삭제 실패:", error);
        this.$toast?.error?.("프로필 이미지 삭제에 실패했습니다.");
      } finally {
        this.isSaving = false;
      }
    },

    async handleSave() {
      try {
        this.isSaving = true;

        // 🔧 변경된 저장 로직
        const currentNickname = this.userProfile?.nickname || "";
        const currentIntroduction = this.userProfile?.introduction || "";

        // 닉네임 처리: 빈칸이면 기존 값 유지, 아니면 새 값 사용
        const finalNickname = this.editForm.nickname.trim() || currentNickname;

        // 자기소개 처리: 입력된 값 그대로 사용 (빈칸 허용)
        const finalIntroduction = this.editForm.introduction.trim();

        const hasNicknameChanged = finalNickname !== currentNickname;
        const hasIntroductionChanged =
          finalIntroduction !== currentIntroduction;
        const hasImageChanged = this.editForm.profileImage !== null;

        // 변경사항이 있을 때만 업데이트
        if (hasNicknameChanged || hasIntroductionChanged || hasImageChanged) {
          const profileData = {
            name: this.userProfile?.name || "", // 이름은 기존 값 유지
            nickname: finalNickname, // 🔧 최종 결정된 닉네임 사용
            introduction: finalIntroduction, // 🔧 입력된 자기소개 사용
          };

          await this.updateUserProfile({
            userProfile: profileData,
            profileImage: this.editForm.profileImage,
          });

          this.$toast?.success?.("프로필이 성공적으로 수정되었습니다.");
        } else {
          this.$toast?.info?.("변경된 내용이 없습니다.");
        }

        this.$emit("save");
        this.handleClose();
      } catch (error) {
        console.error("프로필 수정 실패:", error);
        this.$toast?.error?.("프로필 수정에 실패했습니다. 다시 시도해주세요.");
      } finally {
        this.isSaving = false;
      }
    },

    handleClose() {
      if (this.isSaving) return;
      this.$emit("close");
    },

    handleImageError(event) {
      handleImageError(event);
    },
  },

  async mounted() {
    if (this.visible) {
      await this.initForm();
    }
  },
};
</script>
