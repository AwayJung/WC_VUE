<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="handleGoBack" class="p-1">
          <span class="text-2xl">×</span>
        </button>
        <h1 class="text-lg font-medium mx-auto">상품 수정하기</h1>
      </div>
    </header>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
      <span class="ml-2">로딩 중...</span>
    </div>

    <!-- Main Content -->
    <main v-else class="flex-1 overflow-y-auto mt-14">
      <form @submit.prevent="onSubmit" class="p-4">
        <!-- 이미지 업로드 컴포넌트 -->
        <ImageUploader
          :images="formData.images"
          :imageUrls="formData.imageUrls"
          @upload-images="addImages"
          @remove-image="removeImage"
        />

        <!-- 상품 정보 폼 컴포넌트 -->
        <ItemForm
          :title="formData.title"
          @update:title="formData.title = $event"
          :category="formData.category"
          @update:category="formData.category = $event"
          :price="formData.price"
          @update:price="formData.price = $event"
          :priceFlexible="formData.priceFlexible"
          @update:priceFlexible="formData.priceFlexible = $event"
          :description="formData.description"
          @update:description="formData.description = $event"
        />

        <!-- Error Message -->
        <div v-if="formError" class="text-red-500 text-sm mb-4 text-center">
          {{ formError }}
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="!isFormValid || isSubmitting"
          class="submit-button"
          :class="{ 'opacity-50': !isFormValid || isSubmitting }"
        >
          {{ isSubmitting ? "수정 중..." : "수정 완료" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
import ItemForm from "@/components/Item/Create/ItemForm.vue";
import ImageUploader from "@/components/Item/Create/ImageUploader.vue";

export default {
  name: "ItemUpdatePage",
  components: {
    ImageUploader,
    ItemForm,
  },
  data() {
    return {
      formData: {
        images: [],
        imageUrls: [],
        title: "",
        category: "",
        price: "",
        priceFlexible: false,
        description: "",
      },
      originalImages: [], // 기존 이미지 정보 저장
      isSubmitting: false,
      formError: null, // 이름 변경: error -> formError
      userId: 3, // 고정된 userId 값
    };
  },
  computed: {
    ...mapState("item", ["loading", "error", "currentItem"]),

    isFormValid() {
      return (
        this.formData.title.trim() &&
        this.formData.category &&
        this.formData.price &&
        this.formData.description.trim()
      );
    },

    itemId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions("item", ["fetchItem", "updateItem"]),

    // 상품 데이터 불러오기
    async loadItemData() {
      try {
        await this.fetchItem(this.itemId);

        if (this.currentItem && this.currentItem.data) {
          const item = this.currentItem.data;

          // 판매자 확인 (자신의 상품이 아니면 리다이렉트)
          if (item.sellerId !== this.userId) {
            alert("자신의 상품만 수정할 수 있습니다.");
            this.$router.push(`/items/${this.itemId}`);
            return;
          }

          // 폼 데이터 초기화
          this.formData = {
            images: [],
            imageUrls: [],
            title: item.title || "",
            category: item.categoryId || item.category || "",
            price: item.price ? String(item.price) : "",
            priceFlexible: item.priceFlexible || false,
            description: item.description || "",
          };

          // 기존 이미지 초기화
          const imageUrls = [];
          this.originalImages = []; // 초기화

          // 대표 이미지가 있으면 추가
          if (item.imageUrl) {
            imageUrls.push(item.imageUrl);
            this.originalImages.push({
              url: item.imageUrl,
              deleted: false,
            });
          }

          // 추가 이미지가 있으면 추가
          if (item.imageUrlList && item.imageUrlList.length > 0) {
            item.imageUrlList.forEach((url) => {
              imageUrls.push(url);
              this.originalImages.push({
                url: url,
                deleted: false,
              });
            });
          }

          // 이미지 URL 초기화
          this.formData.imageUrls = imageUrls;
        }
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        this.formError = "상품 정보를 불러오는데 실패했습니다.";
      }
    },

    // 이미지 업로더에서 사용할 메소드들
    addImages(files) {
      files.forEach((file) => {
        this.formData.images.push(file);
        this.formData.imageUrls.push(window.URL.createObjectURL(file));
      });
    },

    removeImage(index) {
      // 이미지 URL 배열에서 해당 이미지 제거
      this.formData.imageUrls.splice(index, 1);

      // 새로 추가된 이미지인 경우 images 배열에서도 제거
      if (index < this.formData.images.length) {
        this.formData.images.splice(index, 1);
      }
      // 기존 이미지인 경우 originalImages에서 제거 표시
      else if (this.originalImages.length > 0) {
        const originalIndex = index - this.formData.images.length;
        if (originalIndex >= 0 && originalIndex < this.originalImages.length) {
          this.originalImages[originalIndex].deleted = true;
        }
      }
    },

    handleGoBack() {
      if (
        this.formData.title !== (this.currentItem?.data?.title || "") ||
        this.formData.description !==
          (this.currentItem?.data?.description || "") ||
        this.formData.images.length
      ) {
        if (
          window.confirm("수정 중인 내용이 있습니다. 페이지를 나가시겠습니까?")
        ) {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    },

    // 이미지 URL에서 파일명 추출
    getImageNameFromUrl(imageUrl) {
      if (!imageUrl) return null;
      const urlParts = imageUrl.split("/");
      return urlParts[urlParts.length - 1];
    },

    async onSubmit() {
      // Reset previous error
      this.formError = null;

      // Validate form
      if (!this.isFormValid) {
        this.formError = "모든 필드를 채워주세요.";
        return;
      }

      // Prevent multiple submissions
      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        // FormData 객체 생성
        const formData = new FormData();

        // 새로운 이미지 추가
        if (this.formData.images.length > 0) {
          // 모든 이미지를 "images" 키로 추가
          for (let i = 0; i < this.formData.images.length; i++) {
            formData.append("images", this.formData.images[i]);
          }
        }

        // 남아있는 기존 이미지 파일명 수집
        const imageFileNames = this.originalImages
          .filter((img) => !img.deleted)
          .map((img) => this.getImageNameFromUrl(img.url));

        // 아이템 데이터를 JSON 문자열로 변환하여 추가
        const itemData = {
          title: this.formData.title.trim(),
          category: this.formData.category,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: this.userId,
          imageIds: imageFileNames, // 남아있는 기존 이미지 파일명 전달
        };

        // 아이템 데이터 추가
        formData.append("item", JSON.stringify(itemData));

        // FormData 내용 확인 (디버깅용)
        for (let pair of formData.entries()) {
          console.log(
            pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
          );
        }

        // API 요청
        const response = await axios.put(
          `http://localhost:8080/api/items/${this.itemId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("아이템 수정 응답:", response.data);

        // 상세 페이지로 이동
        this.$router.push(`/items/${this.itemId}`);
      } catch (error) {
        console.error("아이템 수정 실패:", error);
        console.error(
          "응답 데이터:",
          error.response ? error.response.data : "응답 없음"
        );
        console.error(
          "응답 상태:",
          error.response ? error.response.status : "상태 코드 없음"
        );
        this.formError =
          error.response?.data?.message ||
          error.message ||
          "아이템 수정에 실패했습니다. 다시 시도해주세요.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },

  async created() {
    await this.loadItemData();
  },
};
</script>

<style scoped>
.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #f97316;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  margin-bottom: 4rem;
  transition: opacity 0.2s ease;
}

.submit-button:disabled {
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
