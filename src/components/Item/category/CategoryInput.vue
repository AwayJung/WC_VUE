<template>
  <div class="mb-6 relative">
    <button
      type="button"
      class="w-full text-left px-4 py-3 border rounded-lg"
      @click="showCategories = !showCategories"
    >
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
      <div v-if="loading" class="px-4 py-3 text-center text-gray-500">
        카테고리 로딩 중...
      </div>

      <div v-else-if="error" class="px-4 py-3 text-center text-red-500">
        {{ error }}
      </div>

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
      categoriesMap: {},
      loading: false,
      error: null,
    };
  },

  computed: {
    selectedCategory() {
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
        const response = await categoryApi.getCategories();

        if (response.data?.code === 20000 && response.data?.data) {
          this.categoriesList = response.data.data;

          this.categoriesMap = {};
          this.categoriesList.forEach((category) => {
            this.categoriesMap[category.id] = category;
          });
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
      this.$emit("input", Number(categoryId));
      this.showCategories = false;
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showCategories = false;
      }
    },
  },

  created() {
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
