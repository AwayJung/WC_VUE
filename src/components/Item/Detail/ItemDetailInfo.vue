<template>
  <div class="p-4">
    <!-- 제목 -->
    <h2 class="text-xl font-bold mb-2">{{ item.data.title || "제목 없음" }}</h2>
    <!-- 카테고리와 날짜 -->
    <div class="flex items-center text-sm text-gray-500 mb-4">
      <span class="mr-1">{{ item.data.categoryName }}</span>
      <span class="mr-1">·</span>
      <span>{{ formatTimeAgo(item.data.createdAt) }}</span>
    </div>
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
import { timeUtilsMixin } from "@/utils/timeUtils";

export default {
  name: "ItemDetailInfo",
  mixins: [timeUtilsMixin],
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
      const likeCount = this.item.data && this.item.data.likeCount;
      if (likeCount === null || likeCount === undefined) return 0;

      return likeCount;
    },
  },
  methods: {},
  mounted() {
    console.log("ItemDetailInfo mounted with item:", this.item);
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
