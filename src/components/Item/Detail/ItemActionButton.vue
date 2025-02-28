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
      @click="handleChatAction"
    >
      {{ isOwner ? "대화중인 채팅방" : "채팅하기" }}
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
    currentUserId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    itemPrice() {
      return this.item?.data?.price || 0;
    },

    isOwner() {
      const result = this.item.data.sellerId === this.currentUserId;
      return result;
    },
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString();
    },

    handleChatAction() {
      console.log("handleChatAction 호출됨, isOwner:", this.isOwner);
      console.log("item 객체:", this.item);

      if (this.isOwner) {
        const itemId = this.item.data.itemId;
        this.$emit("view-chat-history", itemId);
      } else {
        this.$emit("click-chat");
      }
    },
  },
};
</script>
