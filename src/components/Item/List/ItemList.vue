<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="text-gray-500">로딩 중...</div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex justify-center items-center py-8">
      <div class="text-red-500">{{ error }}</div>
    </div>

    <!-- 데이터 없음 -->
    <div
      v-else-if="!items.length"
      class="flex flex-col justify-center items-center py-12 bg-white"
    >
      <svg
        class="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <div class="text-lg font-medium text-gray-500">
        등록된 상품이 없습니다
      </div>
      <p class="text-gray-400 mt-2">첫 상품을 등록해보세요!</p>
    </div>

    <!-- 상품 목록 -->
    <div v-else>
      <item-card
        v-for="item in items"
        :key="item.itemId"
        :item="item"
        @click="navigateToDetail"
      />
    </div>
  </div>
</template>

<script>
import ItemCard from "./ItemCard.vue";

export default {
  name: "ItemList",
  components: {
    ItemCard,
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  methods: {
    navigateToDetail(itemId) {
      this.$router.push(`/items/${itemId}`);
    },
  },
};
</script>
