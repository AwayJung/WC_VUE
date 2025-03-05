<template>
  <div>
    <!-- 마켓 헤더 컴포넌트 적용 -->
    <MarketHeader />

    <div class="container mx-auto px-4 py-6 max-w-5xl">
      <!-- 카테고리 탭 -->
      <div class="mb-6">
        <div class="inline-flex rounded-md shadow-sm">
          <button
            class="px-5 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-l-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            전체
          </button>
          <button
            class="px-5 py-2 text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            물품 목록
          </button>
          <button
            class="px-5 py-2 text-sm font-medium bg-white text-gray-600 rounded-r-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            마이 페이지
          </button>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <p class="text-gray-500">불러오는 중...</p>
      </div>

      <!-- 찜 목록 없음 -->
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

      <!-- 찜 목록 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in likedItems"
          :key="item.itemId"
          class="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <!-- 상품 이미지와 찜 버튼을 포함하는 컨테이너 -->
          <div class="relative w-full h-48">
            <!-- 상품 이미지 - 고정된 높이로 설정 -->
            <div
              class="w-full h-full cursor-pointer overflow-hidden"
              @click="goToItemDetail(item.itemId)"
            >
              <ItemImageSlide
                :item="{ data: item }"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- 찜 버튼 - 이미지 위에 겹치도록 배치 -->
            <button
              @click="toggleLike(item.itemId)"
              class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white bg-opacity-80 rounded-full shadow-sm text-orange-500 hover:text-orange-600 z-10"
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

          <!-- 상품 정보 - 이미지와 완전히 분리된 영역 -->
          <div
            class="p-4 cursor-pointer bg-white"
            @click="goToItemDetail(item.itemId)"
          >
            <h2 class="text-lg font-semibold mb-2 truncate">
              {{ item.name || "상품명" }}
            </h2>
            <p class="text-gray-900 font-bold mb-2">
              {{ formatPrice(item.price) }}원
            </p>

            <div class="flex items-center text-sm text-gray-500 mt-3">
              <span class="flex items-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {{ item.likeCount || 1 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BottomNavigation />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MarketHeader from "@/components/layout/MarketHeader.vue";
import BottomNavigation from "@/components/layout/BottomNavigation.vue";
import ItemImageSlide from "@/components/Item/Detail/ItemImageSlide.vue";

export default {
  name: "ItemLikesPage",
  components: {
    MarketHeader,
    BottomNavigation,
    ItemImageSlide,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState("itemLike", ["likedItems"]),
  },
  created() {
    this.loadLikedItems();
    console.log("likedItems:", this.likedItems);
  },
  methods: {
    ...mapActions("itemLike", ["fetchMyLikes", "toggleItemLike"]),

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
      try {
        await this.toggleItemLike(itemId);
        // 찜 취소 후 목록 다시 불러오기
        this.loadLikedItems();
      } catch (error) {
        console.error("찜 취소에 실패했습니다:", error);
      }
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
  },
};
</script>

<style scoped>
/* ItemImageSlide 컴포넌트가 부모 컨테이너의 크기를 준수하도록 스타일 추가 */
.h-48 {
  height: 12rem; /* Tailwind의 h-48에 해당하는 값 */
  overflow: hidden;
  position: relative;
}
</style>
