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

      <!-- 동네생활 버튼 -->
      <router-link
        to="/local"
        class="flex flex-col items-center"
        :class="activePage === 'local' ? 'text-orange-500' : 'text-gray-500'"
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M19 20h-1"
          />
        </svg>
        <span class="text-xs mt-1">동네생활</span>
      </router-link>

      <!-- 내 근처 버튼 -->
      <router-link
        to="/nearby"
        class="flex flex-col items-center"
        :class="activePage === 'nearby' ? 'text-orange-500' : 'text-gray-500'"
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="text-xs mt-1">내 근처</span>
      </router-link>

      <!-- 채팅 버튼 -->
      <router-link
        :to="{ name: 'ChatRoomList', params: { userId: userId || '3' } }"
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
      </router-link>

      <!-- 나의 당근 버튼 -->
      <router-link
        to="/my"
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
export default {
  name: "BottomNavigation",
  props: {
    activePage: {
      type: String,
      default: "home",
      validator: (value) =>
        ["home", "local", "nearby", "chat", "my"].includes(value),
    },
    userId: {
      type: [String, Number],
      default: "3",
    },
  },
};
</script>
