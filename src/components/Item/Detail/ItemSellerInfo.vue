<template>
  <div class="p-4 border-b">
    <div class="flex items-center">
      <div class="w-12 h-12 rounded-full bg-gray-200">
        <img
          v-if="sellerInfo?.profile_image"
          :src="sellerInfo.profile_image"
          class="w-full h-full rounded-full object-cover"
          alt="프로필"
        />
      </div>
      <div class="ml-3 flex-1">
        <h3 class="font-bold text-base">
          {{ item.data.sellerName || "판매자" }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemSellerInfo",
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    sellerInfo() {
      return this.item.seller || {};
    },
    profileImage() {
      return (
        this.sellerInfo?.profile_image ||
        require("@/assets/images/default-placeholder.png")
      );
    },
  },
};
</script>
