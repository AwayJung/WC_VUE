<template>
  <div class="px-6 py-4">
    <!-- 제목 -->
    <h2 class="text-xl font-bold mb-3 px-1">
      {{ item.data.title || "제목 없음" }}
    </h2>

    <!-- 카테고리와 날짜 -->
    <div class="flex items-center text-sm text-gray-500 mb-6 px-1">
      <span class="mr-1">{{ item.data.categoryName }}</span>
      <span class="mr-1">·</span>
      <span>{{ formatTimeAgo(item.data.createdAt) }}</span>
    </div>

    <!-- 설명 (글자 크기 증가 + 여백 추가) -->
    <div class="mb-6 whitespace-pre-line text-lg leading-relaxed px-2 py-1">
      {{ item.data.description }}
    </div>

    <!-- 관심과 조회수 -->
    <div class="flex items-center text-sm text-gray-500 mb-4 px-1">
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
