<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t">
    <div class="flex justify-around py-3">
      <!-- 홈 버튼 -->
      <router-link
        to="/"
        class="flex flex-col items-center"
        :class="activePage === 'home' ? 'text-orange-500' : 'text-gray-500'"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
          />
        </svg>
        <span class="text-xs mt-1">홈</span>
      </router-link>

      <!-- 찜 목록 버튼 -->
      <router-link
        to="/favorites"
        class="flex flex-col items-center"
        :class="
          activePage === 'favorites' ? 'text-orange-500' : 'text-gray-500'
        "
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span class="text-xs mt-1">찜 목록</span>
      </router-link>

      <!-- 물품 목록 링크 -->
      <router-link
        :to="{ name: 'ItemListPage' }"
        class="flex flex-col items-center"
        :class="activePage === 'items' ? 'text-orange-500' : 'text-gray-500'"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span class="text-xs mt-1">물품 목록</span>
      </router-link>

      <!-- 채팅 버튼 -->
      <button
        @click="handleChatClick"
        class="flex flex-col items-center"
        :class="activePage === 'chat' ? 'text-orange-500' : 'text-gray-500'"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span class="text-xs mt-1">채팅</span>
      </button>

      <!-- 나의 당근 버튼 -->
      <router-link
        to="/mypage"
        class="flex flex-col items-center"
        :class="activePage === 'my' ? 'text-orange-500' : 'text-gray-500'"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span class="text-xs mt-1">나의 당근</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BottomNavigation",

  props: {
    activePage: {
      type: String,
      default: "home",
      validator: (value) =>
        ["home", "favorites", "nearby", "items", "chat", "my"].includes(value),
    },
  },

  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    currentUserId() {
      return this.currentUser?.userId;
    },
  },

  methods: {
    handleChatClick() {
      if (this.isAuthenticated && this.currentUserId) {
        this.$router.push({
          name: "ChatRoomList",
          params: { userId: this.currentUserId },
        });
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>
