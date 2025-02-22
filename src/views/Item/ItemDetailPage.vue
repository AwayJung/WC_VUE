<template>
  <div class="min-h-screen">
    <!-- 헤더 -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-white">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-4">
          <button class="p-2" @click="$router.go(-1)">
            <ArrowLeft :size="24" />
          </button>
          <button class="p-2" @click="$router.push('/')">
            <Home :size="24" />
          </button>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2" @click="handleShare">
            <Share2 :size="24" />
          </button>
          <button class="p-2" @click="toggleMenu">
            <MoreVertical :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
      <span class="ml-2">로딩 중...</span>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="p-4 text-red-500">
      {{ error }}
    </div>

    <!-- 컨텐츠 영역 -->
    <div v-else-if="currentItem" class="pt-16 pb-32">
      <ItemImageSlide :item="currentItem || {}" />
      <ItemSellerInfo
        :item="currentItem"
        @click-chat="handleChatWithSeller"
        @click-profile="handleViewSellerProfile"
      />
      <ItemDetailInfo :item="currentItem" @update-like="handleUpdateLike" />
    </div>

    <!-- 데이터 없음 -->
    <div v-else class="flex justify-center items-center h-screen">
      <div class="text-gray-500">상품 정보를 찾을 수 없습니다.</div>
    </div>

    <!-- 하단 고정 영역 -->
    <div
      v-if="currentItem"
      class="fixed bottom-0 left-0 right-0 bg-white border-t"
    >
      <ItemActionButton
        :item="currentItem"
        @click-purchase="handlePurchase"
        @click-like="handleLike"
        @click-chat="handleChat"
      />
      <TheFooter />
    </div>

    <!-- 메뉴 모달 -->
    <div v-if="showMenu" class="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4">
        <div class="flex flex-col">
          <button class="py-3 text-left" @click="handleReport">신고하기</button>
          <button
            v-if="isMyItem"
            class="py-3 text-left text-red-500"
            @click="handleDelete"
          >
            삭제하기
          </button>
        </div>
        <button class="w-full py-3 mt-2 border-t" @click="toggleMenu">
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowLeft, Home, Share2, MoreVertical } from "lucide-vue";
import { mapState, mapGetters, mapActions } from "vuex";
import ItemActionButton from "@/components/item/Detail/ItemActionButton.vue";
import ItemDetailInfo from "@/components/item/Detail/ItemDetailInfo.vue";
import ItemImageSlide from "@/components/item/Detail/ItemImageSlide.vue";
import ItemSellerInfo from "@/components/item/Detail/ItemSellerInfo.vue";
import TheFooter from "@/components/layout/TheFooter.vue";

export default {
  name: "ItemDetailPage",

  components: {
    ArrowLeft,
    Home,
    Share2,
    MoreVertical,
    ItemImageSlide,
    ItemDetailInfo,
    ItemSellerInfo,
    ItemActionButton,
    TheFooter,
  },

  data() {
    return {
      showMenu: false,
      isMyItem: false,
    };
  },

  computed: {
    ...mapState("item", ["loading", "error"]),
    ...mapGetters("item", ["getCurrentItem"]),
    currentItem() {
      return this.getCurrentItem || null;
    },
  },

  methods: {
    ...mapActions("item", ["fetchItem", "deleteItem", "updateItem"]),

    async loadItemData() {
      const itemId = this.$route.params.id;
      try {
        console.log("Loading item data for ID:", itemId);
        await this.fetchItem(itemId);
        console.log("Loaded item data:", this.currentItem);

        if (this.currentItem) {
          this.checkIfMyItem();
        }
      } catch (error) {
        console.error("Failed to load item:", error);
      }
    },

    checkIfMyItem() {
      const userId = this.$store.state.auth?.userId;
      this.isMyItem = userId === this.currentItem?.seller?.id;
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    async handleDelete() {
      try {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        await this.deleteItem(this.currentItem.id);
        this.$router.push("/");
        this.$toast.success("상품이 삭제되었습니다.");
      } catch (error) {
        console.error("Failed to delete item:", error);
        this.$toast.error("삭제에 실패했습니다.");
      }
    },

    handleShare() {
      if (navigator.share) {
        navigator
          .share({
            title: this.currentItem.title || "",
            text: this.currentItem.description || "",
            url: window.location.href,
          })
          .catch((error) => {
            console.error("공유하기 실패:", error);
          });
      }
    },

    async handleReport() {
      this.toggleMenu();
      this.$router.push(`/report/item/${this.currentItem.id}`);
    },

    handlePurchase() {
      if (!this.$store.state.auth?.isLoggedIn) {
        return this.$router.push("/login");
      }
      this.$router.push(`/purchase/${this.currentItem.id}`);
    },

    async handleLike() {
      if (!this.$store.state.auth?.isLoggedIn) {
        return this.$router.push("/login");
      }

      try {
        await this.updateItem({
          itemId: this.currentItem.id,
          data: { is_liked: !this.currentItem.is_liked },
        });
      } catch (error) {
        console.error("Failed to update like status:", error);
        this.$toast.error("처리에 실패했습니다.");
      }
    },

    async handleUpdateLike() {
      try {
        await this.handleLike();
      } catch (error) {
        console.error("좋아요 업데이트 실패:", error);
        this.$toast.error("좋아요 처리에 실패했습니다.");
      }
    },

    handleChat() {
      if (!this.$store.state.auth?.isLoggedIn) {
        return this.$router.push("/login");
      }
      this.$router.push(`/chat/${this.currentItem.seller.id}`);
    },

    handleChatWithSeller() {
      this.handleChat();
    },

    handleViewSellerProfile() {
      this.$router.push(`/profile/${this.currentItem.seller.id}`);
    },
  },

  async created() {
    console.log("ItemDetailPage created with id:", this.$route.params.id);
    await this.loadItemData();
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== from.params.id) {
      next();
      await this.loadItemData();
    } else {
      next();
    }
  },

  beforeDestroy() {
    this.showMenu = false;
  },
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
