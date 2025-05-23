<template>
  <div
    class="p-6 bg-white border-b cursor-pointer"
    @click="$emit('click', getItemId())"
  >
    <div class="flex space-x-6">
      <div
        class="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden"
      >
        <img
          :src="getImageUrl(item)"
          :alt="getItemDescription()"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>

      <!-- 상품 정보 -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-medium text-gray-900 truncate">
            {{ getItemTitle() }}
          </h3>
          <ItemLikeCount v-if="getLikeCount() > 0" :count="getLikeCount()" />
        </div>

        <div class="text-xl font-bold text-gray-900 mb-2">
          {{ formatPrice(getItemPrice()) }}
        </div>

        <div class="flex text-base text-gray-500">
          <span class="mx-1">·</span>
          <span>{{ formatTimeAgo(getItemCreatedAt()) }}</span>
        </div>

        <div v-if="getItemComments()" class="flex text-base text-gray-500 mt-2">
          <span class="flex items-center">
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
            {{ getItemComments() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from "@/assets/images/default-placeholder.png";
import ItemLikeCount from "@/components/Item/ItemLikeCount.vue";
import { timeUtilsMixin } from "@/utils/timeUtils";

export default {
  name: "ItemCard",
  components: {
    ItemLikeCount,
  },
  mixins: [timeUtilsMixin],
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
    // 안전하게 itemId 가져오기
    getItemId() {
      return (
        this.item.itemId || (this.item.data && this.item.data.itemId) || null
      );
    },

    // 안전하게 likeCount 가져오기
    getLikeCount() {
      const directLikeCount = this.item.likeCount;
      const nestedLikeCount = this.item.data && this.item.data.likeCount;

      // undefined, null 체크를 포함
      if (directLikeCount !== undefined && directLikeCount !== null) {
        return directLikeCount;
      } else if (nestedLikeCount !== undefined && nestedLikeCount !== null) {
        return nestedLikeCount;
      }

      return 0; // 기본값
    },

    // 안전하게 title 가져오기
    getItemTitle() {
      return (
        this.item.title ||
        (this.item.data && this.item.data.title) ||
        "제목 없음"
      );
    },

    // 안전하게 description 가져오기
    getItemDescription() {
      return (
        this.item.description ||
        (this.item.data && this.item.data.description) ||
        ""
      );
    },

    // 안전하게 price 가져오기
    getItemPrice() {
      return this.item.price || (this.item.data && this.item.data.price) || 0;
    },

    // 안전하게 createdAt 가져오기
    getItemCreatedAt() {
      return (
        this.item.createdAt ||
        (this.item.data && this.item.data.createdAt) ||
        null
      );
    },

    // 안전하게 comments 가져오기
    getItemComments() {
      return (
        this.item.comments || (this.item.data && this.item.data.comments) || 0
      );
    },

    formatPrice(price) {
      if (!price) return "나눔💛";
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(price);
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
