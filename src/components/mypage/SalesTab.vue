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
          <option value="reserved">예약중</option>
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
        class="flex items-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer group"
        @click="handleItemClick(item)"
      >
        <div class="relative">
          <img
            :src="getItemImage(item)"
            :alt="getItemTitle(item)"
            class="w-24 h-24 object-cover rounded-lg mr-6"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <!-- 이미지 로딩 실패시 대체 아이콘 -->
          <div
            v-if="
              !getItemImage(item) || getItemImage(item).includes('placeholder')
            "
            class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg mr-6"
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
        <div class="flex-1">
          <h4
            class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors"
          >
            {{ getItemTitle(item) }}
          </h4>
          <p class="text-gray-500 mb-2">
            {{ formatDate(getItemCreatedAt(item)) }}
          </p>
          <p class="text-xl font-bold text-orange-500">
            {{ formatPrice(getItemPrice(item)) }}원
          </p>
        </div>
        <div class="text-right">
          <span
            :class="getStatusClass(getItemStatus(item))"
            class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3"
          >
            {{ getStatusText(getItemStatus(item)) }}
          </span>
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
      <div v-if="salesData.length > 3" class="text-center pt-4">
        <button
          @click="handleViewAllSales"
          class="text-orange-500 hover:text-orange-600 font-medium text-sm"
        >
          더보기 ({{ salesData.length - 3 }}개 상품)
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
export default {
  name: "SalesTab",
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
  emits: ["filter-change", "create-item", "view-all-sales"],

  computed: {
    // 처음 3개 상품만 표시
    displayedItems() {
      return this.salesData.slice(0, 3);
    },
  },

  methods: {
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

    // 아이템 데이터 구조에 맞게 값 추출하는 헬퍼 메서드들
    getItemId(item) {
      return item.itemId || (item.data && item.data.itemId) || item.id;
    },

    getItemTitle(item) {
      return (
        item.title || (item.data && item.data.title) || item.name || "제목 없음"
      );
    },

    getItemImage(item) {
      // 다양한 이미지 경로 시도
      let image = null;

      // 직접 속성에서 찾기
      image = item.image || item.imageUrl || item.thumbnail || item.photo;

      // data 객체에서 찾기
      if (!image && item.data) {
        image =
          item.data.image ||
          item.data.imageUrl ||
          item.data.thumbnail ||
          item.data.photo;
      }

      // images 배열에서 첫 번째 이미지 가져오기
      if (
        !image &&
        item.images &&
        Array.isArray(item.images) &&
        item.images.length > 0
      ) {
        image = item.images[0];
      }

      if (
        !image &&
        item.data &&
        item.data.images &&
        Array.isArray(item.data.images) &&
        item.data.images.length > 0
      ) {
        image = item.data.images[0];
      }

      // 이미지가 있다면 절대 경로로 변환
      if (image) {
        // 이미 절대 URL인 경우
        if (image.startsWith("http://") || image.startsWith("https://")) {
          return image;
        }
        // 상대 경로인 경우 API 서버 베이스 URL 추가
        if (image.startsWith("/")) {
          // 여기서 실제 API 서버 URL로 변경하세요
          return `${
            process.env.VUE_APP_API_BASE_URL || "http://localhost:8080"
          }${image}`;
        }
        // 파일명만 있는 경우
        return `${
          process.env.VUE_APP_API_BASE_URL || "http://localhost:8080"
        }/uploads/${image}`;
      }

      // 기본 이미지
      return require("@/assets/images/carrot_profile_default.jpg");
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
      return item.status || (item.data && item.data.status) || "selling";
    },

    getItemLikeCount(item) {
      return item.likeCount || (item.data && item.data.likeCount) || 0;
    },

    getItemViewCount(item) {
      return item.viewCount || (item.data && item.data.viewCount) || 0;
    },

    // 이미지 로딩 이벤트 핸들러
    handleImageError(event) {
      console.log("이미지 로딩 실패:", event.target.src);
      // 기본 이미지로 대체
      event.target.src = require("@/assets/images/carrot_profile_default.jpg");
    },

    handleImageLoad(event) {
      console.log("이미지 로딩 성공:", event.target.src);
    },

    getStatusClass(status) {
      const classes = {
        selling: "bg-green-100 text-green-800",
        reserved: "bg-yellow-100 text-yellow-800",
        sold: "bg-gray-100 text-gray-800",
      };
      return classes[status] || "bg-green-100 text-green-800";
    },

    getStatusText(status) {
      const texts = {
        selling: "판매중",
        reserved: "예약중",
        sold: "판매완료",
      };
      return texts[status] || "판매중";
    },

    formatPrice(price) {
      return price ? price.toLocaleString() : "0";
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "오늘";
      if (diffDays === 2) return "어제";
      if (diffDays <= 7) return `${diffDays - 1}일 전`;

      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    },
  },
};
</script>
