<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- 판매 상품 -->
    <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <div
        class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3"
      >
        <svg
          class="w-6 h-6 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
          />
        </svg>
      </div>
      <div class="text-2xl font-bold text-gray-900 mb-1">
        {{ stats.sales }}
      </div>
      <div class="text-sm text-gray-500">판매 상품</div>
    </div>

    <!-- 관심 목록 -->
    <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <div
        class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3"
      >
        <svg
          class="w-6 h-6 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
      <div class="text-2xl font-bold text-gray-900 mb-1">
        {{ stats.likes }}
      </div>
      <div class="text-sm text-gray-500">관심 목록</div>
    </div>

    <!-- 채팅방 -->
    <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <div
        class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
      >
        <svg
          class="w-6 h-6 text-blue-500"
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
      </div>
      <div class="text-2xl font-bold text-gray-900 mb-1">
        {{ stats.chats }}
      </div>
      <div class="text-sm text-gray-500">채팅방</div>
    </div>

    <!-- 거래 완료 -->
    <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
      <div
        class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"
      >
        <svg
          class="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="text-2xl font-bold text-gray-900 mb-1">
        {{ stats.completed }}
      </div>
      <div class="text-sm text-gray-500">거래 완료</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsCards",
  props: {
    stats: {
      type: Object,
      default: () => ({
        sales: 0,
        likes: 0,
        chats: 0,
        completed: 0,
      }),
    },
  },
};
</script>
