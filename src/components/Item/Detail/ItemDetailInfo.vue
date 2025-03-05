<template>
  <div class="p-4">
    <!-- 제목 -->
    <h2 class="text-xl font-bold mb-2">{{ item.data.title || "제목 없음" }}</h2>

    <!-- 설명 -->
    <div class="mb-4 whitespace-pre-line">
      {{ item.data.description }}
    </div>
    <!-- 날짜 및 조회수 -->
    <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
      <p>조회수 {{ item.data.viewCount }}</p>
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
  },
};
</script>
