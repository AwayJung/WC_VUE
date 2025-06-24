<template>
  <div class="space-y-6">
    <h3 class="text-xl font-semibold text-gray-900">관심목록</h3>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"
      ></div>
      <p class="text-gray-500">관심목록을 불러오는 중...</p>
    </div>

    <!-- 빈 상태 -->
    <div
      v-else-if="!likesData || likesData.length === 0"
      class="text-center py-16"
    >
      <svg
        class="w-24 h-24 text-gray-300 mx-auto mb-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 mb-2">
        관심 상품이 없습니다
      </h4>
      <p class="text-gray-500 mb-6">마음에 드는 상품에 하트를 눌러보세요!</p>
      <button
        @click="handleNavigateItems"
        class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
      >
        상품 둘러보기
      </button>
    </div>

    <!-- 관심 상품 그리드 -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in displayedLikes"
          :key="item.itemId"
          :class="[
            'bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group sold-item-transition',
            getSoldCardClass(item),
          ]"
          @click="handleItemClick(item)"
        >
          <!-- 이미지 영역 -->
          <div class="relative">
            <img
              :src="getItemImage(item)"
              :alt="item.name"
              :class="[
                'w-full h-48 object-cover sold-item-transition',
                getSoldImageClass(item),
              ]"
              @error="handleImageError"
            />

            <!-- 찜 버튼 -->
            <button
              @click.stop="handleToggleLike(item)"
              :disabled="isTogglingItem(item.itemId)"
              :class="[
                'absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors',
                isTogglingItem(item.itemId)
                  ? 'opacity-50 cursor-not-allowed'
                  : '',
              ]"
            >
              <svg
                class="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>

          <!-- 상품 정보 -->
          <div class="p-4">
            <!-- 상태 배지 -->
            <div class="flex items-center justify-between mb-2">
              <span
                :class="[
                  'inline-block px-2 py-1 text-xs font-medium rounded-full',
                  getSoldBadgeClass(item),
                ]"
              >
                {{ getStatusText(item) }}
              </span>
            </div>

            <!-- 제목 -->
            <h4
              :class="[
                'font-semibold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2',
                getSoldTitleClass(item),
              ]"
            >
              {{ item.name }}
            </h4>

            <div class="flex items-center justify-between">
              <!-- 가격 -->
              <p :class="['text-lg font-bold', getSoldPriceClass(item)]">
                {{ formatPrice(item.price) }}원
              </p>

              <!-- 통계 -->
              <div class="flex items-center text-sm text-gray-400 space-x-2">
                <!-- 관심 수 -->
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  {{ item.likeCount || 0 }}
                </div>
                <!-- 채팅 수 -->
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {{ item.chatCount || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 더보기 버튼 -->
      <div v-if="showMoreButton" class="text-center pt-4">
        <button
          @click="handleViewAllFavorites"
          class="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
        >
          더보기 ({{ likesData.length - 6 }}개 상품)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getItemImageUrl, handleImageError } from "@/utils/imageUtils";
import { soldItemMixin } from "@/utils/soldItemUtils";

export default {
  name: "LikesTab",
  mixins: [soldItemMixin], // 판매완료 관련 유틸리티 믹스인

  data() {
    return {
      loading: false,
      togglingItems: new Set(), // 현재 토글 중인 아이템들 추적
    };
  },

  computed: {
    ...mapState("itemLike", ["likedItems"]),

    // Vuex에서 가져온 실제 찜 목록 데이터 사용
    likesData() {
      return this.likedItems || [];
    },

    // 화면에 표시할 상품들 (최대 6개)
    displayedLikes() {
      return this.likesData.slice(0, 6);
    },

    // 더보기 버튼 표시 여부
    showMoreButton() {
      return this.likesData.length > 6;
    },
  },

  emits: ["navigate-items", "update-stats"],

  methods: {
    ...mapActions("itemLike", ["fetchMyLikes", "toggleItemLike"]),

    async loadLikesData() {
      console.log("=== LikesTab 데이터 로드 시작 ===");

      this.loading = true;
      try {
        await this.fetchMyLikes();
        console.log("찜 목록 로드 완료:", this.likesData?.length || 0, "개");

        // 부모 컴포넌트에 통계 업데이트 알림
        this.$emit("update-stats", { likes: this.likesData.length });
      } catch (error) {
        console.error("찜 목록 로드 실패:", error);
      } finally {
        this.loading = false;
      }
    },

    handleNavigateItems() {
      this.$emit("navigate-items");
    },

    // 관심목록 전체보기 페이지로 이동
    handleViewAllFavorites() {
      this.$router.push("/favorites");
    },

    handleItemClick(item) {
      console.log("상품 상세페이지로 이동:", item.itemId);
      this.$router.push(`/items/${item.itemId}`);
    },

    async handleToggleLike(item) {
      // 이미 해당 아이템이 처리 중이면 무시
      if (this.togglingItems.has(item.itemId)) {
        console.log("이미 해당 아이템 토글 처리 중:", item.itemId);
        return;
      }

      // 찜 해제 확인
      if (!confirm("관심목록에서 제거하시겠습니까?")) {
        return;
      }

      console.log("=== 찜 해제 시작 ===");
      console.log("아이템 ID:", item.itemId);
      console.log("아이템 이름:", item.name);

      // 토글 중인 아이템 목록에 추가
      this.togglingItems.add(item.itemId);

      try {
        const result = await this.toggleItemLike(item.itemId);
        console.log("찜 해제 성공:", result);

        // 부모 컴포넌트에 통계 업데이트 알림
        this.$emit("update-stats", { likes: this.likesData.length });
      } catch (error) {
        console.error("찜 해제 실패:", error);
        alert("관심목록 제거에 실패했습니다. 다시 시도해주세요.");
      } finally {
        // 500ms 후 토글 중인 목록에서 제거
        setTimeout(() => {
          this.togglingItems.delete(item.itemId);
        }, 500);

        console.log("=== 찜 해제 종료 ===");
      }
    },

    // 특정 아이템이 토글 중인지 확인
    isTogglingItem(itemId) {
      return this.togglingItems.has(itemId);
    },

    getItemImage(item) {
      return getItemImageUrl(item);
    },

    handleImageError(event) {
      handleImageError(event);
    },

    formatPrice(price) {
      return price ? price.toLocaleString() : "0";
    },
  },

  async created() {
    // 컴포넌트 생성 시 찜 목록 로드
    await this.loadLikesData();
  },

  // 탭이 활성화될 때마다 데이터 새로고침
  async activated() {
    await this.loadLikesData();
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
