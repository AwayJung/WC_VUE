<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="$router.go(-1)" class="p-1">
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

        <!-- Submit Button -->
        <button type="button" @click="onSubmit" class="submit-button">
          작성 완료
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
import ImageInput from "@/components/Item/ImageInput.vue";
import CategoryInput from "@/components/Item/CategoryInput.vue";
import PriceInput from "@/components/Item/PriceInput.vue";
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
    };
  },
  methods: {
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
    onSubmit() {
      console.log("Form submitted:", this.formData);
      // API 호출 로직
    },
  },
};
</script>

<style>
.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #f97316;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  margin-bottom: 4rem;
}
</style>
