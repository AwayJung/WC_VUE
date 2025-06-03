<template>
  <div class="min-h-screen">
    <MarketHeader
      :is-logged-in="isAuthenticated"
      class="z-50"
      @toggle-menu="toggleMenu"
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
    <div v-else-if="currentItem" class="pt-16 pb-32">
      <ItemImageSlide :item="currentItem || {}" />
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

export default {
  name: "ItemDetailPage",

  components: {
    ItemImageSlide,
    ItemDetailInfo,
    ItemSellerInfo,
    ItemActionButton,
    MarketHeader,
  },

  data() {
    return {
      showMenu: false,
      isMyItem: false,
      isToggling: false, // 중복 클릭 방지용 플래그
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

    // 현재 사용자 ID
    currentUserId() {
      return this.currentUser?.userId || null;
    },

    // 현재 아이템의 찜 상태
    isCurrentItemLiked() {
      return this.currentItemLiked;
    },
  },

  methods: {
    ...mapActions("item", ["fetchItem", "deleteItem", "updateItem"]),
    ...mapActions("itemLike", ["toggleItemLike", "checkItemLikeStatus"]),

    async loadItemData() {
      const itemId = this.$route.params.id;
      try {
        console.log("Loading item data for ID:", itemId);
        await this.fetchItem(itemId);
        console.log("Loaded item data:", this.currentItem);

        if (this.currentItem) {
          console.log(this.currentItem);
          this.checkIfMyItem();

          // 로그인된 사용자만 찜 상태 확인 (토글 아님!)
          if (this.isAuthenticated) {
            await this.loadItemLikeStatus(itemId);
          }
        }
      } catch (error) {
        console.error("Failed to load item:", error);
      }
    },

    // 찜 상태 확인만 하는 함수 (토글 X)
    async loadItemLikeStatus(itemId) {
      try {
        console.log("찜 상태 확인 시작:", itemId);
        // checkItemLikeStatus는 상태만 확인하고 변경하지 않음
        const isLiked = await this.checkItemLikeStatus(itemId);
        console.log("찜 상태 확인 결과:", isLiked);
      } catch (error) {
        console.error("찜 상태 확인 실패:", error);
      }
    },

    handleViewChatHistory(itemId) {
      console.log("handleViewChatHistory 호출됨, itemId:", itemId);

      // 로그인 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      // URL 문자열을 직접 구성하여 이동
      const targetUrl = `/chat/${this.currentUserId}?itemId=${itemId}`;
      console.log("이동할 URL:", targetUrl);

      // 직접 URL 문자열을 사용해 라우팅
      this.$router.push(targetUrl);
    },

    checkIfMyItem() {
      // 로그인되어 있고 현재 사용자 ID와 판매자 ID가 같은지 확인
      this.isMyItem =
        this.isAuthenticated &&
        this.currentUserId === this.currentItem.data.sellerId;
    },

    toggleMenu() {
      console.log("메뉴 토글:", !this.showMenu);
      this.showMenu = !this.showMenu;
    },

    handleEdit() {
      // 로그인 및 권한 체크
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
      try {
        // 로그인 및 권한 체크
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
      // 로그인 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.toggleMenu();
      this.$router.push(`/report/item/${this.currentItem.id}`);
    },

    handlePurchase() {
      // 로그인 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.$router.push(`/purchase/${this.currentItem.id}`);
    },

    // 찜하기 토글 함수 - 중복 호출 방지 로직 추가
    async handleLike() {
      // 이미 처리 중이면 무시
      if (this.isToggling) {
        console.log("이미 찜하기 처리 중입니다.");
        return;
      }

      // 로그인 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.isToggling = true;

      try {
        console.log("===== itemDetailPage/handleLike 시작 =====");
        console.log("현재 사용자 ID:", this.currentUserId);
        console.log("현재 찜 상태:", this.isCurrentItemLiked);

        const itemId = this.$route.params.id;
        const result = await this.toggleItemLike(itemId);

        console.log("찜하기 결과:", result);
        console.log("===== itemDetailPage/handleLike 완료 =====");
      } catch (error) {
        console.error("찜하기 처리 실패:", error);
        this.$toast?.error?.("찜하기 처리에 실패했습니다.") ||
          alert("찜하기 처리에 실패했습니다.");
      } finally {
        // 500ms 후 다시 클릭 가능하도록 설정
        setTimeout(() => {
          this.isToggling = false;
        }, 500);
      }
    },

    // 불필요한 함수 제거됨
    // handleUpdateLike() 함수 삭제

    async handleChat() {
      console.log("handleChat 호출됨");
      console.log("currentItem:", this.currentItem);

      // 로그인 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      try {
        // 채팅방 생성 API 호출
        const response = await this.$store.dispatch("chat/createChatRoom", {
          itemId: parseInt(this.$route.params.id),
          userId: this.currentUserId,
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

  mounted() {
    // 페이지 로드시 현재 로그인 정보 확인
    console.log("=== ItemDetailPage 로그인 정보 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);
    console.log("사용자 ID:", this.currentUserId);
    console.log("내 상품 여부:", this.isMyItem);
    console.log("현재 찜 상태:", this.isCurrentItemLiked);
    console.log("================================");
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
