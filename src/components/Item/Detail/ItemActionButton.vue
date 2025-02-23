<template>
  <div class="px-4 py-3 flex items-center gap-4 border-t bg-white">
    <button class="p-2" @click="$emit('click-like')">
      <Heart :fill="item.is_liked ? 'currentColor' : 'none'" />
    </button>
    <div class="flex-1">
      <p class="text-xl font-bold">{{ formatPrice(itemPrice) }}원</p>
      <p class="text-sm text-gray-500">가격 제안 불가</p>
    </div>
    <button
      class="px-6 py-3 bg-orange-500 text-white rounded-md"
      @click="$emit('click-chat')"
    >
      채팅하기
    </button>
  </div>
</template>

<script>
import { Heart } from "lucide-vue";

export default {
  name: "ItemActionButton",
  components: {
    Heart,
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({
        data: { price: 0 },
        is_liked: false,
      }),
    },
  },
  computed: {
    itemPrice() {
      return this.item?.data?.price || 0;
    },
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString();
    },
  },
};
</script>
