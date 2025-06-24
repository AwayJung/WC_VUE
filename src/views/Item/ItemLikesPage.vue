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
  mixins: [soldItemMixin],

  data() {
    return {
      loading: false,
      togglingItems: new Set(),
    };
  },

  computed: {
    ...mapState("itemLike", ["likedItems"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    currentUserId() {
      return this.currentUser?.userId || null;
    },
  },

  created() {
    this.checkAuthAndLoad();
  },

  watch: {
    isAuthenticated(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.loadLikedItems();
      }
    },

    currentUserId(newVal, oldVal) {
      if (newVal !== oldVal && this.isAuthenticated) {
        this.loadLikedItems();
      }
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
      this.loading = true;
      try {
        await this.fetchMyLikes();
      } catch (error) {
        console.error("찜 목록을 불러오는 데 실패했습니다:", error);
      } finally {
        this.loading = false;
      }
    },

    async toggleLike(itemId) {
      if (this.togglingItems.has(itemId)) {
        return;
      }

      this.togglingItems.add(itemId);

      try {
        await this.toggleItemLike(itemId);
      } catch (error) {
        console.error("찜 토글에 실패했습니다:", error);
        this.loadLikedItems();
      } finally {
        setTimeout(() => {
          this.togglingItems.delete(itemId);
        }, 500);
      }
    },

    isTogglingItem(itemId) {
      return this.togglingItems.has(itemId);
    },

    goToItemDetail(itemId) {
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
