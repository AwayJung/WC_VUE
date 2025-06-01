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
          <div
            class="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"
          ></div>
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
export default {
  name: "ProfileCard",
  props: {
    currentUser: {
      type: Object,
      default: null,
    },
  },
  emits: ["edit-profile"],

  computed: {
    displayName() {
      return this.currentUser?.nickname || this.currentUser?.name || "사용자";
    },

    profileImage() {
      return (
        this.currentUser?.profileImage ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
      );
    },
  },

  methods: {
    formatJoinDate() {
      if (this.currentUser?.createdAt) {
        const date = new Date(this.currentUser.createdAt);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      }
      return "2023년 3월"; // 기본값
    },

    handleEditProfile() {
      this.$emit("edit-profile");
    },
  },
};
</script>
