<template>
  <div class="mb-6">
    <div class="text-sm mb-2">상품 이미지</div>
    <div class="flex flex-wrap gap-2">
      <!-- 이미지 업로드 버튼 -->
      <label
        v-if="images.length < 5"
        class="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
      >
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          multiple
          class="hidden"
        />
        <span class="text-gray-400 text-3xl">+</span>
      </label>

      <!-- 미리보기 이미지 -->
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative w-20 h-20"
      >
        <img
          :src="imageUrls[index]"
          class="w-full h-full object-cover rounded"
        />
        <button
          @click.prevent="removeImage(index)"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-1">
      최대 5개의 이미지를 업로드할 수 있습니다.
    </p>
  </div>
</template>

<script>
export default {
  name: "ImageUploader",
  props: {
    images: {
      type: Array,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      const remainingSlots = 5 - this.images.length;
      const filesToAdd = files.slice(0, remainingSlots);

      // Validate file types and sizes
      const validFiles = filesToAdd.filter((file) => {
        // Check file type
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
          alert(
            "지원되지 않는 파일 형식입니다. JPEG, PNG, GIF 파일만 업로드 가능합니다."
          );
          return false;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB를 초과할 수 없습니다.");
          return false;
        }

        return true;
      });

      // 유효한 파일 emit
      this.$emit("upload-images", validFiles);

      // Reset file input
      event.target.value = "";
    },

    removeImage(index) {
      this.$emit("remove-image", index);
    },
  },
};
</script>
