<template>
  <div class="p-4 flex space-x-4 cursor-pointer" @click="$emit('click')">
    <!-- 상품 이미지 -->
    <div class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
      <img
        v-if="hasImage"
        :src="item.imageUrls[0]"
        :alt="item.title"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <img
        v-else
        :src="defaultImage"
        :alt="item.title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 상품 정보 -->
    <div class="flex-1 min-w-0">
      <h3 class="text-base font-normal mb-1 truncate">{{ item.title }}</h3>
      <div class="text-gray-500 text-sm mb-1">
        {{ item.location }} · {{ item.createdAt }}
      </div>
      <div class="font-medium text-base">
        {{ formatPrice }}
      </div>

      <!-- 좋아요/채팅 카운트 -->
      <div class="flex items-center space-x-2 mt-2">
        <div
          v-if="item.chatCount"
          class="flex items-center text-gray-500 text-sm"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clip-rule="evenodd"
            />
          </svg>
          {{ item.chatCount }}
        </div>
        <div
          v-if="item.likeCount"
          class="flex items-center text-gray-500 text-sm"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            />
          </svg>
          {{ item.likeCount }}
        </div>
      </div>
    </div>

    <!-- 더보기 메뉴 -->
    <button class="p-1">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import defaultImage from "@/assets/images/default-placeholder.png";

export default {
  name: "ItemCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultImage,
    };
  },
  computed: {
    hasImage() {
      return this.item.imageUrls && this.item.imageUrls.length > 0;
    },
    formatPrice() {
      return this.item.price
        ? `${Number(this.item.price).toLocaleString()}원`
        : "가격 협의";
    },
  },
  methods: {
    handleImageError(e) {
      e.target.src = this.defaultImage;
    },
  },
};
</script>
