<template>
  <div class="bg-white rounded-xl shadow-sm border p-8 mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-6">
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
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">가입일 {{ formatJoinDate() }}</span>
          </div>
        </div>
      </div>

      <!-- 프로필 수정 버튼 -->
      <div class="flex-shrink-0">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ProfileCard",
  emits: ["edit-profile"],

  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    displayName() {
      return this.currentUser?.name;
    },

    profileImage() {
      return (
        this.currentUser?.profileImage ||
        require("@/assets/images/carrot_profile_default.jpg")
      );
    },
  },

  methods: {
    formatJoinDate() {
      // currentUser의 가입일 정보 포맷팅
      if (this.currentUser?.createdAt) {
        const date = new Date(this.currentUser.createdAt);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      }
      return "";
    },

    handleEditProfile() {
      this.$emit("edit-profile");
    },
  },
};
</script>
