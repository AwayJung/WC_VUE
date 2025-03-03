<template>
  <div
    class="p-6 bg-white border-b cursor-pointer"
    @click="$emit('click', item.itemId)"
  >
    <div class="flex space-x-6">
      <div
        class="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden"
      >
        <img
          :src="getImageUrl(item)"
          :alt="item.description"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>

      <!-- 상품 정보 -->
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-medium text-gray-900 truncate mb-2">
          {{ item.title || "제목 없음" }}
        </h3>

        <div class="text-xl font-bold text-gray-900 mb-2">
          {{ formatPrice(item.price) }}
        </div>

        <div class="flex text-base text-gray-500">
          <span class="mx-1">·</span>
          <span>{{ formatRelativeTime(item.createdAt) }}</span>
        </div>

        <div
          v-if="item.likes || item.comments"
          class="flex text-base text-gray-500 mt-2"
        >
          <span v-if="item.likes" class="flex items-center mr-3">
            <svg
              class="w-5 h-5 mr-1"
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
            {{ item.likes }}
          </span>
          <span v-if="item.comments" class="flex items-center">
            <svg
              class="w-5 h-5 mr-1"
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
            {{ item.comments }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from "@/assets/images/default-placeholder.png";

export default {
  name: "ItemCard",
  data() {
    return {
      placeholderImage: defaultImage,
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatPrice(price) {
      if (!price) return "나눔💛";
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(price);
    },

    formatRelativeTime(dateString) {
      if (!dateString) return "";

      const now = new Date();
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "";

      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return "방금 전";
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}분 전`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}시간 전`;
      } else if (diffInSeconds < 604800) {
        return `${Math.floor(diffInSeconds / 86400)}일 전`;
      } else {
        return new Date(dateString).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    },

    handleImageError(e) {
      e.target.src = this.placeholderImage;
    },

    getImageUrl(item) {
      const imageUrl = item?.data?.imageUrl || item?.imageUrl;
      if (!imageUrl) {
        return this.placeholderImage;
      }

      return imageUrl.startsWith("http")
        ? imageUrl
        : `http://localhost:8080${imageUrl}`;
    },
  },
};
</script>
