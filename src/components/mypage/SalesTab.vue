<template>
  <div class="space-y-6">
    <!-- 헤더 -->
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-900">판매내역</h3>
      <div class="flex items-center space-x-3">
        <select
          :value="filter"
          @change="handleFilterChange"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="all">전체 보기</option>
          <option value="selling">판매중</option>
          <option value="reserved">예약중</option>
          <option value="sold">판매완료</option>
        </select>
        <button
          @click="handleCreateItem"
          class="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
        >
          상품 등록
        </button>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div class="text-center py-16">
      <svg
        class="w-24 h-24 text-gray-300 mx-auto mb-6"
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
      <h4 class="text-lg font-medium text-gray-900 mb-2">
        판매한 상품이 없습니다
      </h4>
      <p class="text-gray-500 mb-6">
        첫 상품을 등록하고 당근마켓을 시작해보세요!
      </p>
      <button
        @click="handleCreateItem"
        class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
      >
        상품 등록하기
      </button>
    </div>

    <!-- 판매 상품 리스트 (실제 데이터가 있을 때 사용) -->
    <!-- 
      <div v-if="salesData && salesData.length > 0" class="space-y-4">
        <div
          v-for="item in salesData"
          :key="item.id"
          class="flex items-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer group"
          @click="handleItemClick(item)"
        >
          <img
            :src="item.image || 'https://via.placeholder.com/120x120?text=상품이미지'"
            :alt="item.name"
            class="w-24 h-24 object-cover rounded-lg mr-6"
          />
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {{ item.name }}
            </h4>
            <p class="text-gray-500 mb-2">{{ item.location }} • {{ formatDate(item.createdAt) }}</p>
            <p class="text-xl font-bold text-orange-500">{{ formatPrice(item.price) }}원</p>
          </div>
          <div class="text-right">
            <span 
              class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 bg-green-100 text-green-800"
            >
              판매중
            </span>
            <div class="text-sm text-gray-500 space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {{ item.likeCount || 0 }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ item.viewCount || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
      -->
  </div>
</template>

<script>
export default {
  name: "SalesTab",
  props: {
    salesData: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: "all",
    },
  },
  emits: ["filter-change", "create-item"],

  methods: {
    handleFilterChange(event) {
      this.$emit("filter-change", event.target.value);
    },

    handleCreateItem() {
      this.$emit("create-item");
    },

    handleItemClick(item) {
      this.$router.push(`/items/${item.id}`);
    },

    formatPrice(price) {
      return price ? price.toLocaleString() : "0";
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "오늘";
      if (diffDays === 2) return "어제";
      if (diffDays <= 7) return `${diffDays - 1}일 전`;

      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    },
  },
};
</script>
