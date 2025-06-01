<template>
  <div class="space-y-6">
    <h3 class="text-xl font-semibold text-gray-900">관심목록</h3>

    <!-- 빈 상태 -->
    <div v-if="!likesData || likesData.length === 0" class="text-center py-16">
      <svg
        class="w-24 h-24 text-gray-300 mx-auto mb-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 mb-2">
        관심 상품이 없습니다
      </h4>
      <p class="text-gray-500 mb-6">마음에 드는 상품에 하트를 눌러보세요!</p>
      <button
        @click="handleNavigateItems"
        class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
      >
        상품 둘러보기
      </button>
    </div>

    <!-- 관심 상품 그리드 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in likesData"
        :key="item.id"
        class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        @click="handleItemClick(item)"
      >
        <!-- 이미지 영역 -->
        <div class="relative">
          <img
            :src="
              item.image ||
              'https://via.placeholder.com/300x200?text=상품이미지'
            "
            :alt="item.name"
            class="w-full h-48 object-cover"
          />
          <!-- 찜 버튼 -->
          <button
            @click.stop="handleToggleLike(item)"
            class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg
              class="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>

          <!-- 상태 배지 (판매완료 등) -->
          <div
            v-if="item.status && item.status !== 'selling'"
            class="absolute top-3 left-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded"
          >
            {{ getStatusText(item.status) }}
          </div>
        </div>

        <!-- 상품 정보 -->
        <div class="p-4">
          <h4
            class="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2"
          >
            {{ item.name }}
          </h4>
          <p class="text-sm text-gray-500 mb-2">
            {{ item.location }}
          </p>
          <div class="flex items-center justify-between">
            <p class="text-lg font-bold text-orange-500">
              {{ formatPrice(item.price) }}원
            </p>
            <div class="flex items-center text-sm text-gray-400 space-x-2">
              <!-- 관심 수 -->
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
                {{ item.likeCount || 0 }}
              </div>
              <!-- 채팅 수 -->
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
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
                {{ item.chatCount || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LikesTab",
  props: {
    likesData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["navigate-items", "toggle-like"],

  methods: {
    handleNavigateItems() {
      this.$emit("navigate-items");
    },

    handleItemClick(item) {
      this.$router.push(`/items/${item.id}`);
    },

    handleToggleLike(item) {
      // 찜 해제 확인
      if (confirm("관심목록에서 제거하시겠습니까?")) {
        this.$emit("toggle-like", item.id);
      }
    },

    getStatusText(status) {
      const texts = {
        selling: "판매중",
        reserved: "예약중",
        sold: "판매완료",
      };
      return texts[status] || "판매중";
    },

    formatPrice(price) {
      return price ? price.toLocaleString() : "0";
    },
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
