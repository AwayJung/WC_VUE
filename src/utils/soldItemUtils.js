// utils/soldItemUtils.js
/**
 * 판매완료 상품 관련 유틸리티 (로직 + 스타일 통합)
 */

/**
 * 상품이 판매완료인지 확인
 */
export const isSoldItem = (item) => {
  const status = item.status || (item.data && item.data.status) || "SELLING";
  return status.toUpperCase() === "SOLD";
};

/**
 * 상품 상태 텍스트 반환
 */
export const getStatusText = (item) => {
  return isSoldItem(item) ? "판매완료" : "판매중";
};

/**
 * 판매완료 상품용 CSS 클래스 반환
 * @param {Object} item - 상품 객체
 * @returns {Object} CSS 클래스 객체
 */
export const getSoldItemClasses = (item) => {
  const sold = isSoldItem(item);

  return {
    // 카드 전체 스타일
    cardClasses: sold ? "opacity-70" : "",

    // 이미지 스타일 (Tailwind의 grayscale 사용)
    imageClasses: sold ? "grayscale" : "",

    // 제목 스타일
    titleClasses: sold ? "text-gray-500 " : "text-gray-900",

    // 가격 스타일
    priceClasses: sold ? "text-gray-400" : "text-orange-500",

    // 상태 배지 스타일
    badgeClasses: sold
      ? "bg-gray-600 text-white"
      : "bg-green-100 text-green-800",

    // 오버레이 스타일
    overlayClasses:
      "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50",
    overlayBadgeClasses:
      "bg-gray-700 text-white px-2 py-1 rounded text-sm font-medium",
  };
};

/**
 * 판매완료 오버레이 표시 여부
 */
export const shouldShowSoldOverlay = (item) => {
  return isSoldItem(item);
};

/**
 * Vue 컴포넌트용 Mixin
 */
export const soldItemMixin = {
  methods: {
    isSoldItem,
    getStatusText,
    getSoldItemClasses,
    shouldShowSoldOverlay,

    // 개별 클래스 헬퍼 메서드들
    getSoldCardClass(item) {
      return this.getSoldItemClasses(item).cardClasses;
    },

    getSoldImageClass(item) {
      return this.getSoldItemClasses(item).imageClasses;
    },

    getSoldTitleClass(item) {
      return this.getSoldItemClasses(item).titleClasses;
    },

    getSoldPriceClass(item) {
      return this.getSoldItemClasses(item).priceClasses;
    },

    getSoldBadgeClass(item) {
      return this.getSoldItemClasses(item).badgeClasses;
    },

    getSoldOverlayClass(item) {
      return this.getSoldItemClasses(item).overlayClasses;
    },

    getSoldOverlayBadgeClass(item) {
      return this.getSoldItemClasses(item).overlayBadgeClasses;
    },
  },
};
