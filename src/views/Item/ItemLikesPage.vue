<template>
  <div>
    <MarketHeader :isLoggedIn="isAuthenticated" />

    <div class="container mx-auto px-4 py-6 max-w-5xl">
      <div class="mb-6">
        <div class="inline-flex rounded-md shadow-sm">
          <button
            class="px-5 py-2 text-sm font-medium bg-orange-500 text-white rounded-l-lg hover:bg-orange-600 focus:outline-none"
          >
            관심목록
          </button>
          <button
            @click="$router.push('/items')"
            class="px-5 py-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            물품 목록
          </button>
          <button
            @click="$router.push('/mypage')"
            class="px-5 py-2 text-sm font-medium bg-white text-gray-600 rounded-r-lg hover:bg-gray-100 focus:outline-none"
          >
            마이 페이지
          </button>
        </div>
      </div>

      <div v-if="isAuthenticated">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <p class="text-gray-500">불러오는 중...</p>
        </div>

        <div
          v-else-if="likedItems.length === 0"
          class="flex justify-center items-center py-12"
        >
          <div class="text-center">
            <p class="text-gray-500 mb-4">찜한 상품이 없습니다.</p>
            <button
              @click="$router.push('/items')"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              상품 둘러보기
            </button>
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="item in likedItems"
            :key="item.itemId"
            :class="[
              'border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200',
              getSoldCardClass(item),
            ]"
          >
            <div class="relative w-full h-48">
              <div
                class="w-full h-full cursor-pointer overflow-hidden"
                @click="goToItemDetail(item.itemId)"
              >
                <img
                  :src="getItemImageUrl(item)"
                  :alt="item.name || '상품이미지'"
                  :class="[
                    'h-full w-full object-cover transition-all',
                    getSoldImageClass(item),
                  ]"
                  @error="handleImageError"
                />
              </div>

              <button
                @click="toggleLike(item.itemId)"
                :disabled="isTogglingItem(item.itemId)"
                :class="[
                  'absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white bg-opacity-80 rounded-full shadow-sm text-orange-500 hover:text-orange-600 z-10 transition-colors',
                  isTogglingItem(item.itemId)
                    ? 'opacity-50 cursor-not-allowed'
                    : '',
                ]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                  />
                </svg>
              </button>
            </div>

            <div
              class="p-4 cursor-pointer bg-white"
              @click="goToItemDetail(item.itemId)"
            >
              <div class="flex justify-between items-start">
                <h2
                  :class="[
                    'text-lg font-semibold mb-2 truncate',
                    getSoldTitleClass(item),
                  ]"
                >
                  {{ item.name || "상품명" }}
                </h2>
                <ItemLikeCount :count="item.likeCount" />
              </div>

              <p :class="['font-bold mb-2', getSoldPriceClass(item)]">
                {{ formatPrice(item.price) }}원
              </p>

              <!-- 상태 배지 -->
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'inline-block px-2 py-1 text-xs font-medium rounded-full',
                    getSoldBadgeClass(item),
                  ]"
                >
                  {{ getStatusText(item) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNavigation :userId="currentUserId" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import MarketHeader from "@/components/layout/MarketHeader.vue";
import BottomNavigation from "@/components/layout/BottomNavigation.vue";
import ItemLikeCount from "@/components/Item/ItemLikeCount.vue";
import { soldItemMixin } from "@/utils/soldItemUtils";
import { getItemImageUrl, handleImageError } from "@/utils/imageUtils";

export default {
  name: "ItemLikesPage",
  components: {
    MarketHeader,
    BottomNavigation,
    ItemLikeCount,
  },
  mixins: [soldItemMixin], // 추가

  data() {
    return {
      loading: false,
      togglingItems: new Set(), // 현재 토글 중인 아이템들을 추적
    };
  },

  computed: {
    ...mapState("itemLike", ["likedItems"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    // 현재 사용자 ID - Vuex에서 가져오기
    currentUserId() {
      return this.currentUser?.userId || null;
    },
  },

  created() {
    console.log("=== ItemLikesPage 컴포넌트 생성 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);
    console.log("사용자 ID:", this.currentUserId);
    console.log("찜한 상품 목록:", this.likedItems);
    console.log("======================================");

    //  로그인 상태 체크 후 처리
    this.checkAuthAndLoad();
  },

  mounted() {
    // 마운트 후 데이터 확인
    console.log("=== ItemLikesPage 마운트 완료 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("사용자 ID:", this.currentUserId);
    console.log("찜한 상품 수:", this.likedItems?.length || 0);
    console.log("==================================");
  },

  watch: {
    // 로그인 상태 변경 감지
    isAuthenticated(newVal, oldVal) {
      console.log("[Auth 상태 변경]", { from: oldVal, to: newVal });

      if (newVal && !oldVal) {
        // 로그인됨 - 찜 목록 로드
        console.log("로그인됨 - 찜 목록 로드");
        this.loadLikedItems();
      } else if (!newVal && oldVal) {
        // 로그아웃됨 - 상태 확인
        console.log("로그아웃됨 - 찜 목록 상태 확인");
      }
    },

    // 사용자 ID 변경 감지
    currentUserId(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("[사용자 변경]", { from: oldVal, to: newVal });
        if (this.isAuthenticated) {
          this.loadLikedItems();
        }
      }
    },

    // 찜 목록 변경 감지
    likedItems(newVal) {
      console.log("[찜 목록 변경] 새로운 목록:", newVal?.length || 0, "개");
    },
  },

  methods: {
    ...mapActions("itemLike", ["fetchMyLikes", "toggleItemLike"]),

    checkAuthAndLoad() {
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");

        this.$router.push("/login");
        return;
      }

      this.loadLikedItems();
    },

    async loadLikedItems() {
      console.log("=== 찜 목록 로드 시작 ===");
      console.log("사용자 ID:", this.currentUserId);
      console.log("인증 상태:", this.isAuthenticated);

      this.loading = true;
      try {
        // fetchMyLikes는 파라미터 없이 호출 (Vuex action에서 현재 사용자 정보 사용)
        await this.fetchMyLikes();
        console.log("찜 목록 로드 완료:", this.likedItems?.length || 0, "개");
        console.log("로드된 찜 목록:", this.likedItems);
      } catch (error) {
        console.error("찜 목록을 불러오는 데 실패했습니다:", error);
        console.error("에러 상세:", error.response?.data || error.message);
      } finally {
        this.loading = false;
        console.log("=== 찜 목록 로드 종료 ===");
      }
    },

    async toggleLike(itemId) {
      // 이미 해당 아이템이 처리 중이면 무시
      if (this.togglingItems.has(itemId)) {
        console.log("이미 해당 아이템 토글 처리 중:", itemId);
        return;
      }

      console.log("=== 찜 토글 시작 ===");
      console.log("아이템 ID:", itemId);
      console.log("사용자 ID:", this.currentUserId);

      // 토글 중인 아이템 목록에 추가
      this.togglingItems.add(itemId);

      try {
        const result = await this.toggleItemLike(itemId);
        console.log("찜 토글 성공:", result);
      } catch (error) {
        console.error("찜 토글에 실패했습니다:", error);
        console.error("에러 상세:", error.response?.data || error.message);

        // 에러 발생 시에만 목록 다시 로드
        this.loadLikedItems();
      } finally {
        // 500ms 후 토글 중인 목록에서 제거
        setTimeout(() => {
          this.togglingItems.delete(itemId);
        }, 500);

        console.log("=== 찜 토글 종료 ===");
      }
    },

    // 특정 아이템이 토글 중인지 확인하는 헬퍼 메서드
    isTogglingItem(itemId) {
      return this.togglingItems.has(itemId);
    },

    goToItemDetail(itemId) {
      console.log("상세페이지로 이동, 아이템ID:", itemId, typeof itemId);

      // 아이디가 유효한지 확인
      if (!itemId || itemId === "undefined" || itemId === "null") {
        console.error("유효하지 않은 아이템 ID:", itemId);
        return;
      }

      this.$router.push(`/items/${itemId}`);
    },

    formatPrice(price) {
      return price
        ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "0";
    },

    // imageUtils에서 가져온 함수들
    getItemImageUrl(item) {
      return getItemImageUrl(item);
    },

    handleImageError(event) {
      handleImageError(event);
    },
  },
};
</script>

<style scoped>
.h-48 {
  height: 12rem;
  overflow: hidden;
  position: relative;
}
</style>
