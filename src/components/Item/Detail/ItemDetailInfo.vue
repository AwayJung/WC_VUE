<template>
  <div class="p-4">
    <!-- 제목 -->
    <h2 class="text-xl font-bold mb-2">{{ item.data.title || "제목 없음" }}</h2>

    <!-- 설명 -->
    <div class="mb-4 whitespace-pre-line">
      {{ item.data.description }}
    </div>

    <!-- 날짜, 하트와 조회수를 같은 줄에 배치 -->
    <div class="flex items-center text-sm text-gray-500 mb-4">
      <!-- 하트 아이콘과 좋아요 수 -->
      <div class="flex items-center mr-4">
        <p>관심 {{ formattedLikeCount }}</p>
      </div>

      <!-- 조회수 -->
      <p>조회 {{ item.data.viewCount }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemDetailInfo",
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    sellerInfo() {
      return this.item.seller || {};
    },
    formattedLikeCount() {
      // 좋아요 수가 없거나 0이면 0을 표시
      const likeCount = this.item.data && this.item.data.likeCount;
      if (likeCount === null || likeCount === undefined) return 0;

      // 1000 이상이면 K 단위로 표시 (예: 1,500 -> 1.5K)
      if (likeCount >= 1000) {
        return (likeCount / 1000).toFixed(1) + "K";
      }
      return likeCount;
    },
  },
  methods: {
    formatTimeAgo(date) {
      if (!date) return "날짜 정보 없음";
      const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formattedDate;
    },
  },
  mounted() {
    console.log("ItemDetailInfo mounted with item:", this.item);
    // 좋아요 정보 로그 추가
    console.log(
      "Item like status:",
      this.item.data
        ? {
            isLiked: this.item.data.isLiked,
            likeCount: this.item.data.likeCount,
          }
        : "No data"
    );
  },
};
</script>
