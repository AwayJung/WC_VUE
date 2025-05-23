<template>
  <div class="mb-6 relative">
    <button
      type="button"
      class="w-full text-left px-4 py-3 border rounded-lg"
      @click="showCategories = !showCategories"
    >
      <!-- 선택된 카테고리 표시 -->
      <span v-if="selectedCategory">
        {{ selectedCategory.name }}
      </span>

      <span v-else-if="loading">카테고리 로딩 중...</span>

      <span v-else>카테고리 선택</span>
    </button>

    <div
      v-if="showCategories"
      class="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10"
    >
      <!-- 로딩 중 표시 -->
      <div v-if="loading" class="px-4 py-3 text-center text-gray-500">
        카테고리 로딩 중...
      </div>

      <!-- 에러 표시 -->
      <div v-else-if="error" class="px-4 py-3 text-center text-red-500">
        {{ error }}
      </div>

      <!-- 카테고리 목록 -->
      <button
        v-for="category in categoriesList"
        :key="category.id"
        type="button"
        class="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<script>
import categoryApi from "@/api/category.js";

export default {
  name: "CategoryInput",
  props: {
    value: {
      type: [Number, String, null],
      default: null,
    },
  },
  data() {
    return {
      showCategories: false,
      categoriesList: [],
      categoriesMap: {}, //카테고리 ID를 키로 사용하여 카테고리 객체에 빠르게 접근하기 위한 맵 객체
      loading: false,
      error: null,
    };
  },
  computed: {
    // 현재 선택된 카테고리 객체 반환
    selectedCategory() {
      console.log("현재 value prop:", this.value, typeof this.value);

      if (!this.value) return null;
      const categoryId = parseInt(this.value);
      return this.categoriesMap[categoryId] || null;
    },
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        // API 호출
        const response = await categoryApi.getCategories();

        // API 응답 구조에 맞게 데이터 처리
        if (
          response.data &&
          response.data.code === 20000 &&
          response.data.data
        ) {
          // 카테고리 목록 저장
          this.categoriesList = response.data.data;

          // categoriesMap 생성
          this.categoriesMap = {};
          this.categoriesList.forEach((category) => {
            this.categoriesMap[category.id] = category;
          });

          console.log("카테고리 목록 로드 완료:", this.categoriesList);
        } else {
          throw new Error("유효하지 않은 응답 데이터");
        }
      } catch (error) {
        this.error = "카테고리를 불러오는 중 오류가 발생했습니다.";
        console.error("카테고리 로딩 오류:", error);
      } finally {
        this.loading = false;
      }
    },
    selectCategory(categoryId) {
      // 선택된 카테고리 정보 가져오기
      const selectedCategory = this.categoriesMap[categoryId];

      console.log("선택된 카테고리:", selectedCategory);
      console.log("emit할 값:", Number(categoryId));
      console.log("카테고리 ID:", selectedCategory.id);
      console.log("카테고리 이름:", selectedCategory.name);
      // ID 값을 숫자로 전달
      this.$emit("input", Number(categoryId));
      this.showCategories = false;
      setTimeout(() => {
        console.log("emit 후 현재 value:", this.value);
      }, 100);
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showCategories = false;
      }
    },
  },
  created() {
    // 컴포넌트 생성 시 카테고리 목록 가져오기
    this.fetchCategories();
  },
  watch: {
    showCategories(newVal) {
      if (newVal) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
