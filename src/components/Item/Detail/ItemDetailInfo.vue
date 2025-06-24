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

    <!-- 관심과 조회수 -->
    <div class="flex items-center text-sm text-gray-500 mb-4">
      <div class="flex items-center mr-4">
        <p>관심 {{ formattedLikeCount }}</p>
      </div>
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
    formattedLikeCount() {
      const likeCount = this.item.data?.likeCount;
      return likeCount ?? 0;
    },
  },
};
</script>
