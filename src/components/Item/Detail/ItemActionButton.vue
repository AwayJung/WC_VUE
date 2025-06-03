<template>
  <div class="px-4 py-3 flex items-center gap-4 border-t bg-white">
    <button
      class="p-2"
      @click="handleLikeClick"
      :disabled="isToggling"
      :class="{ 'opacity-50 cursor-not-allowed': isToggling }"
    >
      <Heart
        :class="{
          'text-red-500': isLiked,
          'text-gray-400': !isLiked,
        }"
        :fill="isLiked ? 'currentColor' : 'none'"
      />
    </button>

    <!-- 가격 정보 -->
    <div class="flex-1">
      <p class="text-xl font-bold">{{ formatPrice(itemPrice) }}원</p>
      <p class="text-sm text-gray-500">가격 제안 불가</p>
    </div>

    <!-- 채팅하기 버튼 -->
    <button
      class="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
      @click="handleChatAction"
    >
      {{ isOwner ? "대화중인 채팅방" : "채팅하기" }}
    </button>
  </div>
</template>

<script>
import { Heart } from "lucide-vue";
import { mapGetters } from "vuex";

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
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      isToggling: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    // Vuex에서 현재 아이템의 찜 상태 가져오기
    isLiked() {
      return this.$store.state.itemLike.currentItemLiked;
    },

    // 현재 사용자 ID 계산
    currentUserIdComputed() {
      return this.currentUser?.userId || this.currentUserId || null;
    },

    itemPrice() {
      return this.item?.data?.price || 0;
    },

    isOwner() {
      const result = this.item.data.sellerId === this.currentUserIdComputed;
      return result;
    },
  },
  methods: {
    handleLikeClick() {
      if (this.isToggling) return;

      this.isToggling = true;

      // 부모 컴포넌트에 이벤트 발생
      this.$emit("click-like");

      // 500ms 후 다시 클릭 가능
      setTimeout(() => {
        this.isToggling = false;
      }, 500);
    },

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

<style scoped></style>
