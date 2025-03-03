<template>
  <div class="min-h-screen bg-white flex flex-col">
    <div class="flex-1">
      <the-header :is-logged-in="isLoggedIn" :user-id="userId" @login="login" />

      <!-- 검색 영역 컨테이너 추가 -->
      <div class="bg-white border-b">
        <div class="max-w-6xl mx-auto px-6 py-3">
          <div class="flex items-center">
            <!-- 검색창 - 기존 SearchArea를 감싸는 컨테이너 -->
            <div class="flex-grow">
              <search-area
                :show-recent-searches="false"
                @search="handleSearch"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Banner -->
      <div class="bg-yellow-100">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex items-center justify-between py-16">
            <div class="max-w-lg">
              <h1 class="text-3xl md:text-4xl font-bold mb-4">
                믿을만한<br />이웃 간 중고거래
              </h1>
              <p class="text-gray-700 text-base md:text-lg leading-relaxed">
                동네 주민들과 가깝고 따뜻한 거래를<br />지금 경험해보세요.
              </p>
            </div>
            <div class="hidden md:block w-80 h-64 relative">
              <div class="absolute right-0 bottom-0 translate-x-1/4">
                <div class="relative">
                  <div class="absolute -inset-4">
                    <div
                      class="w-full h-full opacity-40 blur-lg filter bg-gradient-to-r from-yellow-400 to-orange-300"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div class="py-12 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-lg font-bold mb-6">인기 카테고리</h2>
          <div class="grid grid-cols-4 md:grid-cols-7 gap-4 md:gap-6">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex flex-col items-center"
            >
              <div
                class="w-14 h-14 md:w-16 md:h-16 mb-2 bg-gray-50 rounded-full flex items-center justify-center text-2xl md:text-3xl"
              >
                {{ category.emoji }}
              </div>
              <span class="text-xs md:text-sm text-gray-900">{{
                category.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <the-footer class="mt-auto" />
  </div>
</template>

<script>
import TheHeader from "@/components/layout/TheHeader.vue";
import SearchArea from "@/components/layout/SearchArea.vue";
import TheFooter from "@/components/layout/TheFooter.vue";

export default {
  name: "MainPage",
  components: {
    TheHeader,
    SearchArea,
    TheFooter,
  },
  data() {
    return {
      isLoggedIn: false,
      userId: "",
      categories: [
        { id: 1, name: "디지털기기", emoji: "📱" },
        { id: 2, name: "생활가전", emoji: "🏠" },
        { id: 3, name: "가구/인테리어", emoji: "🪑" },
        { id: 4, name: "생활/주방", emoji: "🍽" },
        { id: 5, name: "유아동", emoji: "👶" },
        { id: 6, name: "유아도서", emoji: "📚" },
        { id: 7, name: "의류", emoji: "👕" },
      ],
    };
  },
  methods: {
    login() {
      this.isLoggedIn = true;
      this.userId = "3";
    },
    logout() {
      this.isLoggedIn = false;
      this.userId = "";
    },
    handleSearch(searchText) {
      console.log("Search:", searchText);
      // 검색 로직 구현
    },
  },
};
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* SearchArea 스타일 오버라이드 */
:deep(.search-area) {
  width: 100%;
}

:deep(.search-area input) {
  border-radius: 6px;
  height: 40px;
}
</style>
