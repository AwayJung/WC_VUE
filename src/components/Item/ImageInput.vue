<template>
  <div class="mb-6">
    <div
      class="w-24 h-24 border rounded-lg flex items-center justify-center cursor-pointer"
      @click="triggerFileInput"
    >
      <div class="text-center">
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
  data() {
    return {
      uploadedImages: [],
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      if (this.uploadedImages.length + files.length > 10) {
        alert("최대 10개의 사진만 업로드할 수 있습니다.");
        return;
      }
      this.uploadedImages.push(...files);
      this.$emit("input", this.uploadedImages);
    },
  },
};
</script>
