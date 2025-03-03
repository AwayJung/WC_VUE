<template>
  <div
    class="fixed top-14 left-0 right-0 z-40 bg-white border-b overflow-x-auto"
  >
    <div class="flex px-2 py-3 space-x-3 whitespace-nowrap">
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'all'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('all')"
      >
        전체
      </button>
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'digital'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('digital')"
      >
        디지털기기
      </button>
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'appliance'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('appliance')"
      >
        생활가전
      </button>
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'furniture'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('furniture')"
      >
        가구/인테리어
      </button>
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'kids'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('kids')"
      >
        유아동
      </button>
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'women'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('women')"
      >
        여성의류
      </button>
      <button
        class="px-3 py-1 rounded-full text-sm"
        :class="
          selectedCategory === 'men'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
        @click="selectCategory('men')"
      >
        남성의류
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListCategoryFilter",
  data() {
    return {
      selectedCategory: "all",
    };
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category;
      this.$emit("category-selected", category);
    },
  },
};
</script>
