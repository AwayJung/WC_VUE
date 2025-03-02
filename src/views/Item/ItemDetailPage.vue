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
        :current-user-id="userId"
        @click-purchase="handlePurchase"
        @click-like="handleLike"
        @click-chat="handleChat"
        @view-chat-history="handleViewChatHistory"
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
import ItemActionButton from "@/components/Item/Detail/ItemActionButton.vue";
import ItemDetailInfo from "@/components/Item/Detail/ItemDetailInfo.vue";
import ItemImageSlide from "@/components/Item/Detail/ItemImageSlide.vue";
import ItemSellerInfo from "@/components/Item/Detail/ItemSellerInfo.vue";
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
      userId: 3, // 고정된 userId 값
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
          console.log(this.currentItem);
          this.checkIfMyItem();
        }
      } catch (error) {
        console.error("Failed to load item:", error);
      }
    },
    handleViewChatHistory(itemId) {
      console.log("handleViewChatHistory 호출됨, itemId:", itemId);

      // URL 문자열을 직접 구성하여 이동
      const targetUrl = `/chat/${this.userId}?itemId=${itemId}`;
      console.log("이동할 URL:", targetUrl);

      // 직접 URL 문자열을 사용해 라우팅
      this.$router.push(targetUrl);
    },

    checkIfMyItem() {
      this.isMyItem = this.userId === this.currentItem.data.sellerId;
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    async handleDelete() {
      try {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        const itemId = this.$route.params.id;
        if (!itemId) {
          alert("상품 ID를 찾을 수 없습니다.");
          return;
        }

        await this.deleteItem(itemId);
        this.toggleMenu();
        alert("상품이 성공적으로 삭제되었습니다.");
        this.$router.push("/items/");
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    },

    handleShare() {
      if (navigator.share) {
        navigator
          .share({
            title: this.currentItem.title || "",
            text: this.currentItem.description,
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
      this.$router.push(`/purchase/${this.currentItem.id}`);
    },

    async handleLike() {
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

    async handleChat() {
      console.log("handleChat 호출됨");
      console.log("currentItem:", this.currentItem);

      try {
        // 채팅방 생성 API 호출
        const response = await this.$store.dispatch("chat/createChatRoom", {
          itemId: parseInt(this.$route.params.id),
          userId: this.userId,
        });

        console.log("채팅방 생성 응답:", response);

        const roomId = response.data?.roomId;

        if (!roomId) {
          throw new Error("채팅방 ID를 받지 못했습니다");
        }

        // 생성된 roomId로 채팅방 이동
        this.$router.push({
          name: "ChatRoom",
          params: {
            roomId: roomId,
          },
          query: {
            itemId: this.$route.params.id,
            userId: this.userId,
          },
        });
      } catch (error) {
        console.error("채팅방 생성 또는 이동 실패:", error);
        this.$toast?.error?.("채팅 시작에 실패했습니다. 다시 시도해주세요.") ||
          alert("채팅 시작에 실패했습니다. 다시 시도해주세요.");
      }
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
