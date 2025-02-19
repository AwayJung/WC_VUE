/* eslint-disable */ // CategoryInput.vue
<template>
  <div class="mb-6 relative">
    <button
      type="button"
      class="w-full text-left px-4 py-3 border rounded-lg"
      @click="showCategories = !showCategories"
    >
      {{ value || "카테고리 선택" }}
    </button>

    <!-- Category List -->
    <div
      v-if="showCategories"
      class="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10"
    >
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="w-full px-4 py-3 text-left hover:bg-gray-100"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryInput",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showCategories: false,
      categories: [
        "디지털기기",
        "생활가전",
        "가구/인테리어",
        "의류",
        "생활/주방",
        "도서",
        "게임",
        "스포츠/레저",
        "뷰티/미용",
        "기타",
      ],
    };
  },
  methods: {
    selectCategory(category) {
      this.$emit("input", category);
      this.showCategories = false;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showCategories = false;
      }
    },
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
