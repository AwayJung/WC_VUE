<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <img src="@/assets/logo/logo.svg" alt="당근마켓 로고" class="h-8" />
          </div>

          <!-- Navigation -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <select
                class="appearance-none bg-gray-100 rounded-md px-4 py-2 pr-8"
              >
                <option>안양시 만안구</option>
              </select>
            </div>

            <div class="hidden md:flex space-x-4">
              <a href="#" class="text-gray-700">중고거래</a>
              <a href="#" class="text-gray-700">부동산</a>
              <a href="#" class="text-gray-700">중고차</a>
              <a href="#" class="text-gray-700">알바</a>
              <a href="#" class="text-gray-700">동네업체</a>
            </div>

            <button class="bg-orange-500 text-white px-4 py-2 rounded-md">
              앱 다운로드
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mt-4">
          <div class="relative">
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              class="w-full px-4 py-2 border rounded-md"
            />
            <button class="absolute right-2 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400"
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
      </nav>
    </header>

    <!-- Main Banner -->
    <div class="bg-yellow-100 py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="max-w-lg">
            <h1 class="text-4xl font-bold mb-4">
              믿을만한<br />이웃 간 중고거래
            </h1>
            <p class="text-gray-600 mb-8">
              동네 주민들과 가깝고 따뜻한 거래를<br />지금 경험해보세요.
            </p>
          </div>
          <div class="hidden md:block relative w-96 h-96">
            <img
              src="/api/placeholder/400/400"
              alt="Banner Items"
              class="absolute right-0 bottom-0"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Categories -->
    <div class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">인기 카테고리</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div
              class="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-2xl"
            >
              {{ category.icon }}
            </div>
            <span class="text-sm text-gray-700">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainPage",
  data() {
    return {
      categories: [
        { id: 1, name: "디지털기기", icon: "💻" },
        { id: 2, name: "생활가전", icon: "🔌" },
        { id: 3, name: "가구/인테리어", icon: "🪑" },
        { id: 4, name: "생활/주방", icon: "🍳" },
        { id: 5, name: "유아동", icon: "🧸" },
        { id: 6, name: "유아도서", icon: "📚" },
        { id: 7, name: "의류", icon: "👕" },
      ],
    };
  },
};
</script>
