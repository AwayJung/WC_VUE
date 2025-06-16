<template>
  <div
    class="p-6 bg-white border-b cursor-pointer relative"
    :class="{ 'opacity-75': getItemStatus() === 'SOLD' }"
    @click="$emit('click', getItemId())"
  >
    <div class="flex space-x-6">
      <div
        class="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative"
      >
        <img
          :src="getImageUrl(item)"
          :alt="getItemDescription()"
          class="w-full h-full object-cover"
          :class="{ grayscale: getItemStatus() === 'SOLD' }"
          @error="handleImageError"
        />

        <!-- 판매완료 오버레이 -->
        <div
          v-if="getItemStatus() === 'SOLD'"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span
            class="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold"
          >
            판매완료
          </span>
        </div>
      </div>

      <!-- 상품 정보 -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center space-x-2">
            <h3
              class="text-xl font-medium truncate"
              :class="
                getItemStatus() === 'SOLD' ? 'text-gray-500' : 'text-gray-900'
              "
            >
              {{ getItemTitle() }}
            </h3>

            <!-- 상태 배지 -->
            <span
              v-if="getItemStatus()"
              :class="getStatusBadgeClass(getItemStatus())"
              class="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
            >
              {{ getStatusText(getItemStatus()) }}
            </span>
          </div>

          <ItemLikeCount v-if="getLikeCount() > 0" :count="getLikeCount()" />
        </div>

        <div
          class="text-xl font-bold mb-2"
          :class="
            getItemStatus() === 'SOLD' ? 'text-gray-400' : 'text-gray-900'
          "
        >
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

    // 🔧 안전하게 status 가져오기 (새로 추가)
    getItemStatus() {
      return (
        this.item.status ||
        (this.item.data && this.item.data.status) ||
        "SELLING"
      );
    },

    // 🔧 상태 배지 스타일 (새로 추가)
    getStatusBadgeClass(status) {
      const classes = {
        SELLING: "bg-green-100 text-green-800",
        SOLD: "bg-red-100 text-red-800",
      };
      return classes[status] || "bg-green-100 text-green-800";
    },

    // 🔧 상태 텍스트 (새로 추가)
    getStatusText(status) {
      const texts = {
        SELLING: "판매중",
        SOLD: "판매완료",
      };
      return texts[status] || "판매중";
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
