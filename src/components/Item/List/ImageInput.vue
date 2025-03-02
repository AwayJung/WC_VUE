<template>
  <div class="w-full">
    <div class="relative w-full h-96">
      <img
        :key="displayImage"
        :src="displayImage"
        class="w-full h-full object-cover"
        @error="handleImageError"
        v-if="!forceDefault"
      />
      <img
        v-else
        src="@/assets/images/default-placeholder.png"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      forceDefault: false,
    };
  },
  computed: {
    // Vuex 스토어에서 기본 API URL 가져오기
    ...mapState({
      baseUrl: (state) => state.app.baseUrl || "http://localhost:8080",
    }),
    displayImage() {
      const imageUrl = this.item?.data?.imageUrl;
      if (!imageUrl) {
        return "";
      }

      // Vuex 스토어의 baseUrl 사용
      return `${this.baseUrl}${imageUrl}`;
    },
  },
  methods: {
    handleImageError() {
      console.error(`이미지 로드 실패: ${this.displayImage}`);
      this.forceDefault = true;
    },
    resetImage() {
      this.forceDefault = false;
    },
  },
  watch: {
    displayImage: {
      handler(newVal) {
        console.log("계산된 이미지 URL:", newVal);
        this.resetImage();
      },
      immediate: true,
    },
  },
  mounted() {
    console.log(
      "컴포넌트 마운트됨, 원본 이미지 URL:",
      this.item?.data?.imageUrl
    );
    console.log("컴포넌트 마운트됨, 변환된 이미지 URL:", this.displayImage);
  },
};
</script>
