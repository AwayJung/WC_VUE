<template>
  <div class="mb-6">
    <!-- 이미지 업로드 버튼 -->
    <div
      class="w-24 h-24 border rounded-lg flex items-center justify-center cursor-pointer"
      @click="triggerFileInput"
    >
      <div v-if="!uploadedImages.length" class="text-center">
        <div class="text-gray-400">
          <svg
            class="w-8 h-8 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
        <div class="text-sm text-gray-500">{{ uploadedImages.length }}/10</div>
      </div>
      <!-- 이미지 프리뷰 -->
      <img
        v-else
        :src="previewUrl || require('@/assets/images/default-placeholder.png')"
        class="w-full h-full object-cover rounded-lg"
        alt="Preview"
      />
    </div>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      accept="image/*"
      multiple
      class="hidden"
    />
  </div>
</template>

<script>
export default {
  name: "ImageInput",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      uploadedImages: [],
      previewUrl: null,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const files = Array.from(event.target.files);
      if (this.uploadedImages.length + files.length > 10) {
        alert("최대 10개의 사진만 업로드할 수 있습니다.");
        return;
      }

      try {
        // FormData 생성
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("images", file);
        });

        // API 호출하여 이미지 업로드
        const response = await this.$axios.post(
          "/api/images/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // 서버에서 받은 이미지 URL 저장
        this.uploadedImages = [...this.uploadedImages, ...response.data.urls];

        // 프리뷰 업데이트 (첫 번째 이미지)
        if (files.length > 0) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewUrl = e.target.result;
          };
          reader.readAsDataURL(files[0]);
        }

        // 부모 컴포넌트에 업데이트된 이미지 URL 배열 전달
        this.$emit("input", this.uploadedImages);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    },
  },
};
</script>
