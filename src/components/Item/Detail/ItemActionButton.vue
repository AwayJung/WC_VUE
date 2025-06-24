<template>
  <div class="px-4 py-3 flex items-center gap-4 border-t bg-white">
    <button
      class="p-2"
      @click="handleLikeClick"
      :disabled="isToggling || isSoldItem(item)"
      :class="{
        'opacity-50 cursor-not-allowed': isToggling || isSoldItem(item),
      }"
    >
      <Heart
        :class="{
          'text-red-500': isLiked && !isSoldItem(item),
          'text-gray-400': !isLiked || isSoldItem(item),
        }"
        :fill="isLiked && !isSoldItem(item) ? 'currentColor' : 'none'"
      />
    </button>

    <!-- 가격 정보 -->
    <div class="flex-1">
      <p class="text-xl font-bold">{{ formatPrice(itemPrice) }}원</p>
      <p class="text-sm text-gray-500">
        {{ isSoldItem(item) ? "판매완료된 상품입니다" : "가격 제안 불가" }}
      </p>
    </div>

    <!-- 채팅하기 버튼 -->
    <button
      :class="[
        'px-6 py-3 rounded-md transition-colors font-medium',
        isSoldItem(item)
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isOwner
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-orange-500 text-white hover:bg-orange-600',
      ]"
      @click="handleChatAction"
      :disabled="isSoldItem(item)"
    >
      {{ getChatButtonText() }}
    </button>
  </div>
</template>

<script>
import { Heart } from "lucide-vue";
import { mapGetters } from "vuex";
import { soldItemMixin } from "@/utils/soldItemUtils";

export default {
  name: "ItemActionButton",

  components: {
    Heart,
  },

  mixins: [soldItemMixin],

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

    isLiked() {
      return this.$store.state.itemLike.currentItemLiked;
    },

    currentUserIdComputed() {
      return this.currentUser?.userId || this.currentUserId || null;
    },

    itemPrice() {
      return this.item?.data?.price || 0;
    },

    isOwner() {
      return this.item.data.sellerId === this.currentUserIdComputed;
    },
  },

  methods: {
    handleLikeClick() {
      if (this.isSoldItem(this.item)) {
        alert("판매완료된 상품은 찜할 수 없습니다.");
        return;
      }

      if (this.isToggling) return;

      this.isToggling = true;
      this.$emit("click-like");

      setTimeout(() => {
        this.isToggling = false;
      }, 500);
    },

    formatPrice(price) {
      return price.toLocaleString();
    },

    getChatButtonText() {
      if (this.isSoldItem(this.item)) {
        return "판매완료";
      }
      return this.isOwner ? "대화중인 채팅방" : "채팅하기";
    },

    handleChatAction() {
      if (this.isSoldItem(this.item)) {
        alert("판매완료된 상품은 채팅할 수 없습니다.");
        return;
      }

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
