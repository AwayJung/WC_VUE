<template>
  <div class="flex space-x-2 p-4 overflow-x-auto bg-white">
    <button
      v-for="category in categories"
      :key="category.id"
      :class="[
        'flex items-center px-4 py-2 rounded-full whitespace-nowrap',
        selectedCategory === category.id
          ? 'bg-orange-500 text-white'
          : 'bg-gray-100',
      ]"
      @click="handleCategoryClick(category.id)"
    >
      <!-- 아이콘 컴포넌트 -->
      <svg
        v-if="category.icon === 'SearchIcon'"
        class="w-4 h-4 mr-1"
        :stroke="selectedCategory === category.id ? 'white' : 'currentColor'"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <svg
        v-else-if="category.icon === 'HomeIcon'"
        class="w-4 h-4 mr-1"
        :stroke="selectedCategory === category.id ? 'white' : 'currentColor'"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      <svg
        v-else-if="category.icon === 'LightningBoltIcon'"
        class="w-4 h-4 mr-1"
        :stroke="selectedCategory === category.id ? 'white' : 'currentColor'"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      {{ category.name }}
    </button>
  </div>
</template>

<script>
export default {
  name: "CategoryFilter",
  data() {
    return {
      selectedCategory: null,
      categories: [
        {
          id: "part-time",
          name: "알바",
          icon: "SearchIcon",
        },
        {
          id: "real-estate",
          name: "부동산",
          icon: "HomeIcon",
        },
        {
          id: "used-car",
          name: "중고차",
          icon: "LightningBoltIcon",
        },
      ],
    };
  },
  methods: {
    handleCategoryClick(categoryId) {
      this.selectedCategory = categoryId;
      this.$emit("category-change", categoryId);
    },
  },
};
</script>
