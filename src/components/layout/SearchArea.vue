<template>
  <div class="flex items-center px-4 py-2.5 border-t">
    <div class="flex-1 relative">
      <div class="flex items-center">
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          class="w-full px-4 py-2.5 bg-gray-100 rounded-md focus:outline-none"
          v-model="searchText"
          @input="onSearch"
        />
        <button class="absolute right-3">
          <svg
            class="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchArea",
  data() {
    return {
      searchText: "",
    };
  },
  methods: {
    onSearch() {
      this.$emit("search", this.searchText);
    },
  },
};
</script>
