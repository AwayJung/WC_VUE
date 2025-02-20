<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="handleGoBack" class="p-1">
          <span class="text-2xl">×</span>
        </button>
        <h1 class="text-lg font-medium">내 물건 팔기</h1>
        <div class="w-20 text-right">
          <span class="text-gray-400">임시저장</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto mt-14">
      <form @submit.prevent="onSubmit" class="p-4">
        <!-- 이미지 업로드 -->
        <ImageInput v-model="formData.images" />

        <!-- 제목 -->
        <div class="mb-6">
          <div class="text-sm mb-2">제목</div>
          <input
            v-model="formData.title"
            type="text"
            placeholder="글 제목"
            class="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <!-- 카테고리 -->
        <div class="mb-6">
          <div class="text-sm mb-2">카테고리</div>
          <CategoryInput v-model="formData.category" />
        </div>

        <!-- 가격 입력 -->
        <PriceInput
          v-model="formData.price"
          @update:isFixed="updateIsFixed"
          @update:isPriceFlexible="updateIsPriceFlexible"
        />

        <!-- 설명 -->
        <div class="mb-6">
          <div class="text-sm mb-2">자세한 설명</div>
          <textarea
            v-model="formData.description"
            rows="6"
            placeholder="게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)"
            class="w-full px-4 py-3 border rounded-lg resize-none"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm mb-4 text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="!isFormValid || isSubmitting || loading"
          class="submit-button"
          :class="{ 'opacity-50': !isFormValid || isSubmitting || loading }"
        >
          {{ isSubmitting || loading ? "등록 중..." : "작성 완료" }}
        </button>
      </form>
    </main>

    <!-- Footer Navigation -->
    <div class="fixed bottom-0 left-0 right-0">
      <TheFooter />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ImageInput from "@/components/item/ImageInput.vue";
import CategoryInput from "@/components/item/category/CategoryInput.vue";
import PriceInput from "@/components/item/PriceInput.vue";
import TheFooter from "@/components/layout/TheFooter.vue";

export default {
  name: "ItemCreatePage",
  components: {
    ImageInput,
    CategoryInput,
    PriceInput,
    TheFooter,
  },
  data() {
    return {
      formData: {
        images: [],
        title: "",
        category: "",
        price: "",
        priceFlexible: false,
        description: "",
      },
      isFixed: true,
      isSubmitting: false,
    };
  },
  computed: {
    ...mapState("item", ["loading", "error"]),
    isFormValid() {
      return (
        this.formData.title.trim() &&
        this.formData.category &&
        (this.isFixed ? this.formData.price : true) &&
        this.formData.description.trim()
      );
    },
  },
  methods: {
    ...mapActions("item", ["createItem"]),

    handleGoBack() {
      if (this.formData.title || this.formData.description) {
        if (
          window.confirm("작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?")
        ) {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    },

    updateIsFixed(value) {
      this.isFixed = value;
      if (!value) {
        this.formData.price = "";
        this.formData.priceFlexible = false;
      }
    },

    updateIsPriceFlexible(value) {
      this.formData.priceFlexible = value;
    },

    async uploadImages() {
      if (!this.formData.images.length) return [];

      const formData = new FormData();
      this.formData.images.forEach((image, index) => {
        formData.append("images", image, `image${index}.jpg`);
      });

      try {
        const response = await this.$axios.post(
          "/api/images/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.imageUrls;
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        return [];
      }
    },

    validateForm() {
      if (!this.formData.title.trim()) {
        throw new Error("제목을 입력해주세요.");
      }
      if (!this.formData.category) {
        throw new Error("카테고리를 선택해주세요.");
      }
      if (this.isFixed && !this.formData.price) {
        throw new Error("가격을 입력해주세요.");
      }
      if (!this.formData.description.trim()) {
        throw new Error("설명을 입력해주세요.");
      }
    },

    async onSubmit() {
      if (this.isSubmitting) return;

      try {
        this.validateForm();
        this.isSubmitting = true;

        let imageUrls = [];
        try {
          imageUrls = await this.uploadImages();
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
        }

        const itemData = {
          title: this.formData.title.trim(),
          category: this.formData.category,
          price: this.isFixed ? Number(this.formData.price) : null,
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          imageUrls: imageUrls,
          status: "ACTIVE",
          sellerId: 3,
        };

        await this.createItem(itemData);

        // 성공 후 formData 초기화
        this.formData = {
          images: [],
          title: "",
          category: "",
          price: "",
          priceFlexible: false,
          description: "",
        };

        this.$router.push("/items");
      } catch (error) {
        console.error("아이템 등록 실패:", error);
        alert(
          error.message || "아이템 등록에 실패했습니다. 다시 시도해주세요."
        );
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.formData.title || this.formData.description) {
      const confirmed = window.confirm(
        "작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?"
      );
      next(confirmed);
    } else {
      next();
    }
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
