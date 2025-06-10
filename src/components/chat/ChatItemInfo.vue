<template>
  <!-- 상품 정보 영역 -->
  <div
    v-if="itemId && isAuthenticated"
    class="bg-white border-b-2 border-gray-100 px-5 py-5 shadow-sm"
  >
    <!-- 로딩 상태 -->
    <div v-if="itemLoading" class="flex items-center space-x-5">
      <div
        class="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex-shrink-0"
      ></div>
      <div class="flex-1">
        <div
          class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-3"
        ></div>
        <div
          class="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-28"
        ></div>
      </div>
    </div>

    <!-- 상품 정보 표시 -->
    <div v-else-if="itemInfo" class="flex items-center space-x-3">
      <!-- 뒤로가기 버튼 -->
      <button
        @click="goToChatList"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors duration-200 flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <!-- 상품 이미지 (클릭 가능) -->
      <div
        @click="handleItemClick"
        class="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 cursor-pointer hover:shadow-lg hover:scale-105 transform transition-all duration-200 ring-2 ring-transparent hover:ring-orange-200"
      >
        <img
          :src="getItemImageUrl(itemInfo)"
          :alt="getItemTitle(itemInfo)"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>

      <!-- 상품 정보 텍스트 (클릭 가능) -->
      <div @click="handleItemClick" class="flex-1 min-w-0 cursor-pointer group">
        <!-- 상품명 -->
        <h3
          class="text-lg font-bold text-gray-800 truncate mb-2 group-hover:text-orange-600 transition-colors duration-200"
        >
          {{ getItemTitle(itemInfo) }}
        </h3>
        <!-- 가격 -->
        <div class="flex items-center">
          <span class="text-2xl font-black text-orange-500 mr-2">
            {{ formatPrice(getItemPrice(itemInfo)) }}
          </span>
          <div class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div
      v-else-if="itemError"
      class="flex items-center space-x-5 text-gray-500"
    >
      <div
        class="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center flex-shrink-0 border-2 border-red-200"
      >
        <svg
          class="w-10 h-10 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-lg font-medium text-red-600">
          상품 정보를 불러올 수 없습니다
        </p>
        <p class="text-sm text-gray-500 mt-1">잠시 후 다시 시도해주세요</p>
      </div>
    </div>
  </div>
</template>

<script>
// 🆕 이미지 유틸리티 import
import {
  getItemImageUrl as utilsGetItemImageUrl,
  handleImageError as utilsHandleImageError,
  getPlaceholderImage as utilsGetPlaceholderImage,
} from "@/utils/imageUtils.js";

export default {
  name: "ChatItemInfo",

  props: {
    itemId: {
      type: [String, Number],
      required: false,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      itemInfo: null,
      itemLoading: false,
      itemError: false,
    };
  },

  watch: {
    // itemId 변경 시 상품 정보 재로드
    itemId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal && this.isAuthenticated) {
          this.loadItemInfo();
        }
      },
    },

    // 인증 상태 변경 시
    isAuthenticated: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.itemId) {
          this.loadItemInfo();
        } else if (!newVal) {
          this.itemInfo = null;
          this.itemError = false;
        }
      },
    },
  },

  methods: {
    // 상품 정보 로드
    async loadItemInfo() {
      if (!this.itemId || !this.isAuthenticated) {
        this.itemInfo = null;
        this.itemError = false;
        return;
      }

      this.itemLoading = true;
      this.itemError = false;

      try {
        console.log("[상품 정보] 로드 시작:", this.itemId);

        const { getItem } = await import("@/api/item");
        const response = await getItem(this.itemId);

        if (response && response.data) {
          this.itemInfo = response.data.data || response.data;
          console.log("[상품 정보] 로드 완료:", this.itemInfo);

          // 상품 정보 로드 완료 이벤트 발생
          this.emitItemLoaded();
        } else {
          this.itemError = true;
        }
      } catch (error) {
        console.error("[상품 정보] 로딩 실패:", error);
        this.itemInfo = null;
        this.itemError = true;
      } finally {
        this.itemLoading = false;
      }
    },

    // 🆕 상품 정보 로드 완료 이벤트 발생
    emitItemLoaded() {
      if (this.itemInfo) {
        const itemData = {
          title: this.getItemTitle(this.itemInfo),
          price: this.getItemPrice(this.itemInfo),
          image: this.getItemImageUrl(this.itemInfo),
          id: this.itemId,
        };

        console.log("[ChatItemInfo] 상품 정보 emit:", itemData);
        this.$emit("item-loaded", itemData);
      }
    },

    // 채팅 목록으로 이동
    goToChatList() {
      console.log("[ChatItemInfo] 채팅 목록으로 이동");
      this.$emit("go-back");
    },

    // 이미지 URL 생성 (utils 사용)
    getItemImageUrl(item) {
      return utilsGetItemImageUrl(item);
    },

    // 플레이스홀더 이미지 (utils 사용)
    getPlaceholderImage() {
      return utilsGetPlaceholderImage();
    },

    // 상품 제목 추출
    getItemTitle(item) {
      if (!item) return "상품명 없음";
      return item.title || "상품명 없음";
    },

    // 상품 가격 추출
    getItemPrice(item) {
      if (!item) return 0;
      return item.price || 0;
    },

    // 가격 포맷팅
    formatPrice(price) {
      if (!price && price !== 0) return "";
      return price.toLocaleString("ko-KR") + "원";
    },

    handleImageError(event) {
      utilsHandleImageError(event);
    },

    // 상품 클릭 처리
    handleItemClick() {
      if (this.itemId) {
        console.log("[ChatItemInfo] 상품 클릭:", this.itemId);
        this.$emit("item-click", this.itemId);
      }
    },
  },
};
</script>
