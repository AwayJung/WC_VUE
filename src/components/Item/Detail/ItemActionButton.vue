<template>
  <div class="px-4 py-3 flex items-center gap-4 border-t bg-white">
    <button class="p-2" @click="handleLikeToggle">
      <Heart
        :class="{
          'text-red-500': isLiked,
          'text-gray-400': !isLiked,
        }"
        :fill="isLiked ? 'currentColor' : 'none'"
      />
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
import { mapActions } from "vuex";

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
        isLiked: false,
      }),
    },
    currentUserId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLiked: false,
    };
  },
  created() {
    this.updateLikedStatus();
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
    ...mapActions({
      toggleItemLike: "itemLike/toggleItemLike",
    }),

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

    updateLikedStatus() {
      this.isLiked = this.item?.data?.isLiked ?? false;
    },

    // 찜하기 토글 기능
    async handleLikeToggle() {
      try {
        console.log("handleLikeToggle 호출됨");
        const itemId = this.item.data.itemId;

        // 로컬 상태를 즉시 토글 (UI 응답성 향상)
        this.isLiked = !this.isLiked;

        // API 호출을 통한 서버 상태 업데이트
        const serverIsLiked = await this.toggleItemLike(itemId);
        console.log("서버 응답 liked 상태:", serverIsLiked);

        // 서버 응답과 로컬 상태가 다르면 서버 상태로 조정
        if (serverIsLiked !== undefined && this.isLiked !== serverIsLiked) {
          console.log("서버 상태와 다르므로 조정:", serverIsLiked);
          this.isLiked = serverIsLiked;
        }

        // 부모 컴포넌트에 현재 상태 알림
        this.$emit("click-like", { itemId, isLiked: this.isLiked });
      } catch (error) {
        // 에러 발생 시 상태 원복
        console.error("찜하기 오류:", error);
        this.isLiked = !this.isLiked;
        // 에러 알림
        this.$toast?.error?.("찜하기 처리에 실패했습니다.") ||
          alert("찜하기 처리에 실패했습니다.");
      }
    },
  },
  // props 변경 시 로컬 상태 업데이트
  watch: {
    item: {
      handler() {
        this.updateLikedStatus();
      },
      deep: true,
    },
  },
};
</script>
