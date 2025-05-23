<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="handleGoBack" class="p-1">
          <span class="text-2xl">×</span>
        </button>
        <h1 class="text-lg font-medium mx-auto">내 물건 팔기</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto mt-14">
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
          :categoryId="formData.categoryId"
          @update:categoryId="formData.categoryId = $event"
          :price="formData.price"
          @update:price="formData.price = $event"
          :priceFlexible="formData.priceFlexible"
          @update:priceFlexible="formData.priceFlexible = $event"
          :description="formData.description"
          @update:description="formData.description = $event"
        />

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm mb-4 text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="!isFormValid || isSubmitting"
          class="submit-button"
          :class="{ 'opacity-50': !isFormValid || isSubmitting }"
        >
          {{ isSubmitting ? "등록 중..." : "작성 완료" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import ItemForm from "@/components/Item/Create/ItemForm.vue";
import ImageUploader from "@/components/Item/Create/ImageUploader.vue";

export default {
  name: "ItemCreatePage",
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
        categoryId: "",
        price: "",
        priceFlexible: false,
        description: "",
      },
      isSubmitting: false,
      error: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.title.trim() &&
        this.formData.categoryId &&
        this.formData.price &&
        this.formData.description.trim()
      );
    },
  },
  methods: {
    // 이미지 업로더에서 사용할 메소드들
    addImages(files) {
      files.forEach((file) => {
        this.formData.images.push(file);
        this.formData.imageUrls.push(window.URL.createObjectURL(file));
      });
    },

    removeImage(index) {
      this.formData.images.splice(index, 1);
      this.formData.imageUrls.splice(index, 1);
    },

    handleGoBack() {
      if (
        this.formData.title ||
        this.formData.description ||
        this.formData.images.length
      ) {
        if (
          window.confirm("작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?")
        ) {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    },

    async onSubmit() {
      // Reset previous error
      this.error = null;

      // Validate form
      if (!this.isFormValid) {
        this.error = "모든 필드를 채워주세요.";
        return;
      }

      // Prevent multiple submissions
      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        // FormData 객체 생성
        const formData = new FormData();

        // 이미지 추가
        if (this.formData.images.length > 0) {
          // 모든 이미지를 "images" 키로 추가
          for (let i = 0; i < this.formData.images.length; i++) {
            formData.append("images", this.formData.images[i]);
          }
        }

        // 아이템 데이터를 JSON 문자열로 변환하여 추가
        const itemData = {
          title: this.formData.title.trim(),
          categoryId: this.formData.categoryId,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: 3,
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
        const response = await axios.post(
          "http://localhost:8080/api/items/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("아이템 등록 응답:", response.data);

        // 성공 시 폼 초기화
        this.resetForm();

        // 목록 페이지로 이동
        this.$router.push("/items");
      } catch (error) {
        console.error("아이템 등록 실패:", error);
        console.error(
          "응답 데이터:",
          error.response ? error.response.data : "응답 없음"
        );
        console.error(
          "응답 상태:",
          error.response ? error.response.status : "상태 코드 없음"
        );
        this.error =
          error.response?.data?.message ||
          error.message ||
          "아이템 등록에 실패했습니다. 다시 시도해주세요.";
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        images: [],
        imageUrls: [],
        title: "",
        category: "",
        price: "",
        priceFlexible: false,
        description: "",
      };
    },
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
</style>
