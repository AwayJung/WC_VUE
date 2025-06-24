export const isSoldItem = (item) => {
  const status = item.status || (item.data && item.data.status) || "SELLING";
  return status.toUpperCase() === "SOLD";
};

export const getStatusText = (item) => {
  return isSoldItem(item) ? "판매완료" : "판매중";
};

export const getSoldItemClasses = (item) => {
  const sold = isSoldItem(item);

  return {
    cardClasses: sold ? "opacity-70" : "",
    imageClasses: sold ? "grayscale" : "",
    titleClasses: sold ? "text-gray-500 " : "text-gray-900",
    priceClasses: sold ? "text-gray-400" : "text-orange-500",
    badgeClasses: sold
      ? "bg-gray-600 text-white"
      : "bg-green-100 text-green-800",
    overlayClasses:
      "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50",
    overlayBadgeClasses:
      "bg-gray-700 text-white px-2 py-1 rounded text-sm font-medium",
  };
};

export const shouldShowSoldOverlay = (item) => {
  return isSoldItem(item);
};

export const soldItemMixin = {
  methods: {
    isSoldItem,
    getStatusText,
    getSoldItemClasses,
    shouldShowSoldOverlay,

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
