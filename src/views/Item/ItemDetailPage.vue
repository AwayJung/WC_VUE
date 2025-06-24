<template>
  <div class="min-h-screen">
    <MarketHeader
      :is-logged-in="isAuthenticated"
      :show-status-button="isMyItem"
      :current-item-id="currentItem?.data?.itemId || $route.params.id"
      :current-item-status="currentItem?.data?.status"
      :current-item-seller-id="currentItem?.data?.sellerId"
      menu-mode="item-detail"
      @status-changed="handleItemStatusChanged"
    />

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
    <div
      v-else-if="currentItem"
      :class="['pt-16 pb-32 transition-all', getSoldCardClass(currentItem)]"
    >
      <!-- 이미지 슬라이드 (판매완료시 흑백 + 오버레이) -->
      <div class="relative">
        <ItemImageSlide
          :item="currentItem || {}"
          :class="['transition-all', getSoldImageClass(currentItem)]"
        />

        <!-- 판매완료 오버레이 -->
        <div
          v-if="shouldShowSoldOverlay(currentItem)"
          :class="getSoldOverlayClass(currentItem)"
        >
          <div
            class="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold text-xl"
          >
            판매완료
          </div>
        </div>
      </div>

      <ItemSellerInfo
        :item="currentItem"
        @click-chat="handleChatWithSeller"
        @click-profile="handleViewSellerProfile"
      />
      <ItemDetailInfo :item="currentItem" />
    </div>

    <!-- 데이터 없음 -->
    <div v-else class="flex justify-center items-center h-screen">
      <div class="text-gray-500">상품 정보를 찾을 수 없습니다.</div>
    </div>

    <!-- 하단 고정 영역 -->
    <div
      v-if="currentItem"
      class="fixed bottom-0 left-0 right-0 bg-white border-t z-10"
    >
      <ItemActionButton
        :item="currentItem"
        :current-user-id="currentUserId"
        @click-purchase="handlePurchase"
        @click-like="handleLike"
        @click-chat="handleChat"
        @view-chat-history="handleViewChatHistory"
      />
    </div>

    <!-- 메뉴 모달 -->
    <div v-if="showMenu" class="fixed inset-0 bg-black bg-opacity-50 z-[200]">
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4">
        <div class="flex flex-col">
          <button class="py-3 text-left" @click="handleReport">신고하기</button>
          <button v-if="isMyItem" class="py-3 text-left" @click="handleEdit">
            수정하기
          </button>
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
import { mapState, mapGetters, mapActions } from "vuex";
import ItemActionButton from "@/components/Item/Detail/ItemActionButton.vue";
import ItemDetailInfo from "@/components/Item/Detail/ItemDetailInfo.vue";
import ItemImageSlide from "@/components/Item/Detail/ItemImageSlide.vue";
import ItemSellerInfo from "@/components/Item/Detail/ItemSellerInfo.vue";
import MarketHeader from "@/components/layout/MarketHeader.vue";
import { soldItemMixin } from "@/utils/soldItemUtils";

export default {
  name: "ItemDetailPage",

  components: {
    ItemImageSlide,
    ItemDetailInfo,
    ItemSellerInfo,
    ItemActionButton,
    MarketHeader,
  },

  mixins: [soldItemMixin],

  data() {
    return {
      showMenu: false,
      isMyItem: false,
      isToggling: false,
    };
  },

  computed: {
    ...mapState("item", ["loading", "error"]),
    ...mapGetters("item", ["getCurrentItem"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),
    ...mapState("itemLike", ["currentItemLiked"]),

    currentItem() {
      return this.getCurrentItem || null;
    },

    currentUserId() {
      return this.currentUser?.userId || null;
    },

    isCurrentItemLiked() {
      return this.currentItemLiked;
    },
  },

  methods: {
    ...mapActions("item", ["fetchItem", "deleteItem"]),
    ...mapActions("itemLike", ["toggleItemLike", "checkItemLikeStatus"]),

    handleItemStatusChanged({ newStatus }) {
      if (this.currentItem?.data) {
        this.currentItem.data.status = newStatus;
        this.$forceUpdate();
      }
    },

    async loadItemData() {
      const itemId = this.$route.params.id;
      try {
        await this.fetchItem(itemId);

        if (this.currentItem) {
          this.checkIfMyItem();

          if (this.isAuthenticated) {
            await this.checkItemLikeStatus(itemId);
          }
        }
      } catch (error) {
        console.error("Failed to load item:", error);
      }
    },

    handleViewChatHistory(itemId) {
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      const targetUrl = `/chat/${this.currentUserId}?itemId=${itemId}`;
      this.$router.push(targetUrl);
    },

    checkIfMyItem() {
      this.isMyItem =
        this.isAuthenticated &&
        this.currentUserId === this.currentItem.data.sellerId;
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    handleEdit() {
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      if (!this.isMyItem) {
        alert("권한이 없습니다.");
        return;
      }

      const itemId = this.$route.params.id;
      this.toggleMenu();
      this.$router.push(`/items/update/${itemId}`);
    },

    async handleDelete() {
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      if (!this.isMyItem) {
        alert("권한이 없습니다.");
        return;
      }

      if (!confirm("정말 삭제하시겠습니까?")) return;

      const itemId = this.$route.params.id;
      if (!itemId) {
        alert("상품 ID를 찾을 수 없습니다.");
        return;
      }

      try {
        await this.deleteItem(itemId);
        this.toggleMenu();
        alert("상품이 성공적으로 삭제되었습니다.");
        this.$router.push("/items/");
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    },

    async handleReport() {
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.toggleMenu();
      this.$router.push(`/report/item/${this.currentItem.id}`);
    },

    handlePurchase() {
      if (this.isSoldItem(this.currentItem)) {
        alert("판매완료된 상품은 구매할 수 없습니다.");
        return;
      }

      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.$router.push(`/purchase/${this.currentItem.id}`);
    },

    async handleLike() {
      if (this.isToggling) return;

      if (this.isSoldItem(this.currentItem)) {
        alert("판매완료된 상품은 찜할 수 없습니다.");
        return;
      }

      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.isToggling = true;

      try {
        const itemId = this.$route.params.id;
        await this.toggleItemLike(itemId);
      } catch (error) {
        console.error("찜하기 처리 실패:", error);
        this.$toast?.error?.("찜하기 처리에 실패했습니다.") ||
          alert("찜하기 처리에 실패했습니다.");
      } finally {
        setTimeout(() => {
          this.isToggling = false;
        }, 500);
      }
    },

    async handleChat() {
      if (this.isSoldItem(this.currentItem)) {
        alert("판매완료된 상품은 채팅할 수 없습니다.");
        return;
      }

      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await this.$store.dispatch("chat/createChatRoom", {
          itemId: parseInt(this.$route.params.id),
          userId: this.currentUserId,
        });

        const roomId = response.data?.roomId;

        if (!roomId) {
          throw new Error("채팅방 ID를 받지 못했습니다");
        }

        this.$router.push({
          name: "ChatRoom",
          params: {
            roomId: roomId,
          },
          query: {
            itemId: this.$route.params.id,
            userId: this.currentUserId,
          },
        });
      } catch (error) {
        console.error("채팅방 생성 또는 이동 실패:", error);
        this.$toast?.error?.("채팅 시작에 실패했습니다. 다시 시도해주세요.") ||
          alert("채팅 시작에 실패했습니다. 다시 시도해주세요.");
      }
    },

    handleChatWithSeller() {
      if (this.isSoldItem(this.currentItem)) {
        alert("판매완료된 상품은 채팅할 수 없습니다.");
        return;
      }

      this.handleChat();
    },

    handleViewSellerProfile() {
      this.$router.push(`/profile/${this.currentItem.seller.id}`);
    },
  },

  async created() {
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
