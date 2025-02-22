<template>
  <div class="w-full">
    <div class="relative w-full h-96">
      <img :src="displayImage" class="w-full h-full object-cover" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({
        data: {},
      }),
    },
  },
  computed: {
    displayImage() {
      return (
        this.item?.data?.imageUrl ||
        require("@/assets/images/default-placeholder.png")
      );
    },
  },
};
</script>
