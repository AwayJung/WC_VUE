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
            :src="profileImage"
            alt="프로필"
            class="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-orange-100"
          />
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden"
            ref="imageInput"
          />
          <button
            @click="$refs.imageInput.click()"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            사진 변경
          </button>
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
        </div>

        <!-- 소개 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            소개
          </label>
          <textarea
            v-model="editForm.bio"
            rows="3"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="자신을 소개해주세요"
          ></textarea>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="flex space-x-3 mt-8">
        <button
          @click="handleClose"
          class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
        >
          취소
        </button>
        <button
          @click="handleSave"
          class="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
          :disabled="!isFormValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileEditModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentUser: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "save"],

  data() {
    return {
      editForm: {
        nickname: "",
        bio: "",
        profileImage: null,
      },
    };
  },

  computed: {
    profileImage() {
      return (
        this.currentUser?.profileImage ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
      );
    },

    isFormValid() {
      return this.editForm.nickname.trim().length > 0;
    },
  },

  watch: {
    visible(newVal) {
      if (newVal && this.currentUser) {
        this.initForm();
      }
    },
  },

  methods: {
    initForm() {
      this.editForm = {
        nickname: this.currentUser.nickname || this.currentUser.name || "",
        bio: this.currentUser.bio || "",
        profileImage: null,
      };
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB 이하로 선택해주세요.");
          return;
        }

        // 이미지 파일 타입 체크
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드할 수 있습니다.");
          return;
        }

        this.editForm.profileImage = file;
        console.log("이미지 업로드:", file.name);
      }
    },

    handleClose() {
      this.$emit("close");
    },

    handleSave() {
      if (!this.isFormValid) {
        alert("닉네임을 입력해주세요.");
        return;
      }

      const profileData = {
        nickname: this.editForm.nickname.trim(),
        bio: this.editForm.bio.trim(),
        profileImage: this.editForm.profileImage,
      };

      this.$emit("save", profileData);
    },
  },

  mounted() {
    if (this.visible && this.currentUser) {
      this.initForm();
    }
  },
};
</script>
