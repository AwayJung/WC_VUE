<template>
  <div class="space-y-6">
    <!-- 헤더 -->
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-900">판매내역</h3>
      <div class="flex items-center space-x-3">
        <button
          @click="handleViewAllSales"
          class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          전체보기
        </button>
        <select
          :value="filter"
          @change="handleFilterChange"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="all">전체 보기</option>
          <option value="selling">판매중</option>
          <option value="sold">판매완료</option>
        </select>
        <button
          @click="handleCreateItem"
          class="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
        >
          상품 등록
        </button>
      </div>
    </div>

    <!-- 판매 상품 리스트 -->
    <div v-if="salesData && salesData.length > 0" class="space-y-4">
      <div
        v-for="item in displayedItems"
        :key="item.id"
        class="flex items-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all group"
      >
        <div class="relative">
          <img
            :src="getItemImage(item)"
            :alt="getItemTitle(item)"
            class="w-24 h-24 object-cover rounded-lg mr-6 cursor-pointer"
            @error="handleImageError"
            @click="handleItemClick(item)"
          />
          <!-- 이미지 로딩 실패시 대체 아이콘 -->
          <div
            v-if="
              !getItemImage(item) || getItemImage(item).includes('placeholder')
            "
            class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg mr-6 cursor-pointer"
            @click="handleItemClick(item)"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="flex-1 cursor-pointer" @click="handleItemClick(item)">
          <h4
            class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors"
          >
            {{ getItemTitle(item) }}
          </h4>

          <p class="text-gray-500 mb-2">
            {{ formatTimeAgo(getItemCreatedAt(item)) }}
          </p>
          <p class="text-xl font-bold text-orange-500">
            {{ formatPrice(getItemPrice(item)) }}원
          </p>
        </div>
        <div class="text-right">
          <!-- 상태 표시 (클릭 가능) -->
          <button
            @click.stop="handleStatusToggle(item)"
            :class="getStatusClass(getItemStatus(item))"
            :disabled="statusChanging === getItemId(item)"
            class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 transition-colors hover:opacity-80 disabled:opacity-50 cursor-pointer"
          >
            <span
              v-if="statusChanging === getItemId(item)"
              class="flex items-center"
            >
              <svg
                class="animate-spin -ml-1 mr-2 h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              변경중...
            </span>
            <span v-else>
              {{ getStatusText(getItemStatus(item)) }}
            </span>
          </button>

          <div class="text-sm text-gray-500 space-y-1">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              {{ getItemLikeCount(item) }}
            </div>
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {{ getItemViewCount(item) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 더보기 버튼 -->
      <div v-if="salesData.length > 4" class="text-center pt-4">
        <button
          @click="handleViewAllSales"
          class="text-orange-500 hover:text-orange-600 font-medium text-sm"
        >
          더보기 ({{ salesData.length - 4 }}개 상품)
        </button>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-16">
      <svg
        class="w-24 h-24 text-gray-300 mx-auto mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
        />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 mb-2">
        판매한 상품이 없습니다
      </h4>
      <p class="text-gray-500 mb-6">
        첫 상품을 등록하고 당근마켓을 시작해보세요!
      </p>
      <button
        @click="handleCreateItem"
        class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
      >
        상품 등록하기
      </button>
    </div>
  </div>
</template>

<script>
import { getItemImageUrl, handleImageError } from "@/utils/imageUtils";
import { timeUtilsMixin } from "@/utils/timeUtils";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SalesTab",
  mixins: [timeUtilsMixin],

  props: {
    salesData: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: "all",
    },
  },

  emits: ["filter-change", "create-item", "view-all-sales", "status-changed"],

  data() {
    return {
      statusChanging: null,
    };
  },

  computed: {
    displayedItems() {
      return this.salesData.slice(0, 4);
    },
    ...mapGetters("auth", ["currentUser"]),
  },

  methods: {
    ...mapActions("item", ["changeItemStatus"]),

    handleFilterChange(event) {
      this.$emit("filter-change", event.target.value);
    },

    handleCreateItem() {
      this.$emit("create-item");
    },

    handleViewAllSales() {
      this.$emit("view-all-sales");
    },

    handleItemClick(item) {
      const itemId = this.getItemId(item);
      this.$router.push(`/items/${itemId}`);
    },

    async handleStatusToggle(item) {
      const currentStatus = this.getItemStatus(item);
      const newStatus = currentStatus === "SELLING" ? "SOLD" : "SELLING";
      const itemId = this.getItemId(item);
      const userId = this.currentUser?.userId;

      if (!userId) {
        alert("로그인이 필요합니다.");
        return;
      }

      this.statusChanging = itemId;

      try {
        await this.changeItemStatus({
          itemId,
          status: newStatus,
          userId,
        });

        // 로컬 salesData 즉시 업데이트
        this.updateLocalItemStatus(itemId, newStatus);

        // 부모 컴포넌트에 알림
        this.$emit("status-changed", { itemId, newStatus });
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("상태 변경에 실패했습니다. 다시 시도해주세요.");
      } finally {
        this.statusChanging = null;
      }
    },

    // 데이터 추출 헬퍼 메서드들
    getItemId(item) {
      return item.itemId || (item.data && item.data.itemId) || item.id;
    },

    getItemTitle(item) {
      return (
        item.title || (item.data && item.data.title) || item.name || "제목 없음"
      );
    },

    getItemImage(item) {
      return getItemImageUrl(item);
    },

    getItemPrice(item) {
      return item.price || (item.data && item.data.price) || 0;
    },

    getItemCreatedAt(item) {
      return (
        item.createdAt ||
        (item.data && item.data.createdAt) ||
        new Date().toISOString()
      );
    },

    getItemStatus(item) {
      return item.status || (item.data && item.data.status) || "SELLING";
    },

    getItemLikeCount(item) {
      return item.likeCount || (item.data && item.data.likeCount) || 0;
    },

    getItemViewCount(item) {
      return item.viewCount || (item.data && item.data.viewCount) || 0;
    },

    handleImageError(event) {
      handleImageError(event);
    },

    getStatusClass(status) {
      const classes = {
        SELLING: "bg-green-100 text-green-800 hover:bg-green-200",
        SOLD: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      };
      return (
        classes[status] || "bg-green-100 text-green-800 hover:bg-green-200"
      );
    },

    getStatusText(status) {
      const texts = {
        SELLING: "판매중",
        SOLD: "판매완료",
      };
      return texts[status] || "판매중";
    },

    formatPrice(price) {
      return price ? price.toLocaleString() : "0";
    },

    updateLocalItemStatus(itemId, newStatus) {
      const item = this.salesData.find(
        (item) => this.getItemId(item) === itemId
      );

      if (item) {
        if (item.data) {
          item.data.status = newStatus;
        }
        item.status = newStatus;

        // Vue 반응성 트리거
        this.$forceUpdate();
      }
    },
  },
};
</script>
