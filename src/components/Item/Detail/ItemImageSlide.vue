<template>
  <div class="w-full">
    <div class="relative w-full overflow-hidden" style="max-height: 50vh">
      <img
        :key="currentImageUrl"
        :src="currentImageUrl"
        class="w-full object-contain mx-auto transition-opacity duration-300"
        style="max-height: 50vh"
        @error="handleImageError"
        v-if="!forceDefault"
      />
      <img
        v-else
        src="@/assets/images/default-placeholder.png"
        class="w-full object-contain mx-auto"
        style="max-height: 50vh"
      />

      <!-- Navigation arrows -->
      <div class="absolute inset-0 flex items-center justify-between px-4">
        <button
          @click="prevImage"
          class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          @click="nextImage"
          class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Image indicator dots -->
      <div
        class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2"
      >
        <button
          v-for="(_, index) in allImages"
          :key="index"
          @click="currentIndex = index"
          class="w-3 h-3 rounded-full"
          :class="
            currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
          "
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
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
      currentIndex: 0,
    };
  },
  computed: {
    allImages() {
      const mainImage = this.item?.data?.imageUrl;
      const imageUrlList = this.item?.data?.imageUrlList || [];

      // additionalImages 처리 - JSON 문자열이 들어올 수 있음
      let additionalImages = [];
      const rawAdditionalImages = this.item?.data?.additionalImages;

      if (rawAdditionalImages) {
        // 문자열인 경우 JSON 파싱 시도
        if (typeof rawAdditionalImages === "string") {
          try {
            // JSON 문자열에서 따옴표 치환 문제 해결
            const cleanedJson = rawAdditionalImages.replace(/'/g, '"');
            additionalImages = JSON.parse(cleanedJson);
          } catch (e) {
            console.error("additionalImages JSON 파싱 오류:", e);
            additionalImages = [];
          }
        }
        // 이미 배열인 경우
        else if (Array.isArray(rawAdditionalImages)) {
          additionalImages = rawAdditionalImages;
        }
      }

      // 유효한 이미지 URL만 필터링
      const allImageUrls = [mainImage, ...imageUrlList, ...additionalImages]
        .filter((url) => url && typeof url === "string")
        .filter(
          (url) =>
            !url.includes("[") &&
            !url.includes("]") &&
            !url.includes('"') &&
            !url.includes("'")
        )
        .filter((url, index, self) => self.indexOf(url) === index);

      console.log("유효한 이미지 URLs:", allImageUrls);
      return allImageUrls.length > 0 ? allImageUrls : [""];
    },

    currentImageUrl() {
      const imgUrl = this.allImages[this.currentIndex];
      return imgUrl ? this.getFullUrl(imgUrl) : "";
    },
  },
  methods: {
    getFullUrl(imageUrl) {
      if (!imageUrl) return "";

      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }

      return `http://localhost:8080${imageUrl}`;
    },

    handleImageError() {
      console.error(`이미지 로드 실패: ${this.currentImageUrl}`);
      this.forceDefault = true;
    },

    resetImage() {
      this.forceDefault = false;
    },

    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.allImages.length;
      this.resetImage();
      // 페이지 상단으로 스크롤하지 않도록 이벤트 전파 중지
      event.stopPropagation();
      event.preventDefault();
    },

    prevImage() {
      this.currentIndex =
        (this.currentIndex - 1 + this.allImages.length) % this.allImages.length;
      this.resetImage();
      // 페이지 상단으로 스크롤하지 않도록 이벤트 전파 중지
      event.stopPropagation();
      event.preventDefault();
    },
  },
  watch: {
    "item.data": {
      handler() {
        this.currentIndex = 0;
        this.resetImage();
      },
      deep: true,
    },
  },
  mounted() {
    console.log("컴포넌트 마운트됨, 모든 이미지 URLs:", this.allImages);
  },
};
</script>
