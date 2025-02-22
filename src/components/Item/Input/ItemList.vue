<template>
  <div class="container mx-auto">
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
      class="flex justify-center items-center py-8"
    >
      <div class="text-gray-500">등록된 상품이 없습니다.</div>
    </div>

    <!-- 상품 목록 -->
    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="item in items"
        :key="item.itemId"
        class="p-4 hover:bg-gray-50 cursor-pointer"
        @click="navigateToDetail(item.itemId)"
      >
        <div class="flex space-x-4">
          <!-- 상품 이미지 -->
          <div class="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0">
            <img
              :src="placeholderImage"
              :alt="item.description"
              class="w-full h-full object-cover rounded-md"
              @error="handleImageError"
            />
          </div>

          <!-- 상품 정보 -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between">
              <h3 class="text-base font-medium text-gray-900 truncate">
                {{ item.title || "제목 없음" }}
              </h3>
              <div class="text-sm text-gray-500">
                {{ formatDate(item.createdAt) }}
              </div>
            </div>

            <div class="mt-2 text-base font-medium text-gray-900">
              {{ formatPrice(item.price) }}
            </div>

            <!-- 판매자 정보 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from "@/assets/images/default-placeholder.png";

export default {
  name: "ItemList",
  data() {
    return {
      placeholderImage: defaultImage,
    };
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
    formatPrice(price) {
      if (!price) return "가격 정보 없음";
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(price);
    },

    formatDate(date) {
      if (!date) return "날짜 정보 없음";
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "날짜 정보 없음";

      return dateObj.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    navigateToDetail(itemId) {
      this.$router.push(`/items/${itemId}`);
    },

    handleImageError(e) {
      e.target.src = this.placeholderImage;
    },
  },
};
</script>
