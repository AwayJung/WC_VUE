<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <TheHeader />

    <!-- Main Content -->
    <div class="flex-1 w-full max-w-4xl mx-auto px-5 font-sans">
      <div class="mt-6 text-2xl font-bold">공지사항</div>

      <!-- 탭 메뉴 -->
      <div class="flex border-b border-gray-200 mt-4 mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'px-4 py-2 bg-transparent border-none border-b-2 cursor-pointer text-base text-gray-600 transition-all duration-200',
            selectedTab === tab.key
              ? 'text-black border-black'
              : 'border-transparent hover:text-gray-800',
          ]"
          @click="selectTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 공지 목록 테이블 -->
      <table class="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th
              class="w-1/6 py-3 px-2 text-left border-b border-gray-200 text-sm bg-gray-50 font-medium"
            >
              구분
            </th>
            <th
              class="w-4/6 py-3 px-2 text-left border-b border-gray-200 text-sm bg-gray-50 font-medium"
            >
              제목
            </th>
            <th
              class="w-1/6 py-3 px-2 text-right border-b border-gray-200 text-sm bg-gray-50 font-medium"
            >
              날짜
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="notice in paginatedNotices" :key="notice.id">
            <td class="py-3 px-2 text-left border-b border-gray-200 text-sm">
              {{ notice.category }}
            </td>
            <td class="py-3 px-2 text-left border-b border-gray-200 text-sm">
              {{ notice.title }}
            </td>
            <td
              class="py-3 px-2 text-right border-b border-gray-200 text-sm text-gray-500"
            >
              {{ notice.date }}
            </td>
          </tr>
          <tr v-if="paginatedNotices.length === 0">
            <td colspan="3" class="text-center text-gray-400 py-5">
              표시할 공지가 없습니다.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이징 네비게이션 -->
      <div class="flex justify-center items-center mt-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          :class="[
            'mx-1 px-2.5 py-1.5 bg-white border border-gray-300 cursor-pointer text-sm text-gray-700 transition-all duration-200',
            currentPage === 1
              ? 'cursor-default text-gray-400 border-gray-200'
              : 'hover:bg-gray-100',
          ]"
        >
          &lt;
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'mx-1 px-2.5 py-1.5 border cursor-pointer text-sm transition-all duration-200',
            currentPage === page
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>

        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          :class="[
            'mx-1 px-2.5 py-1.5 bg-white border border-gray-300 cursor-pointer text-sm text-gray-700 transition-all duration-200',
            currentPage === totalPages
              ? 'cursor-default text-gray-400 border-gray-200'
              : 'hover:bg-gray-100',
          ]"
        >
          &gt;
        </button>
      </div>
    </div>

    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script>
import TheHeader from "@/components/layout/TheHeader.vue";
import TheFooter from "@/components/layout/TheFooter.vue";

export default {
  name: "NoticeList",
  components: {
    TheHeader,
    TheFooter,
  },

  data() {
    return {
      tabs: [
        { label: "전체", key: "all" },
        { label: "공지", key: "공지" },
        { label: "이벤트", key: "이벤트" },
        { label: "전문가모드", key: "전문가모드" },
      ],
      selectedTab: "all",

      notices: [
        {
          id: 1,
          category: "공지",
          title: "후기 평점 산정 방식에 변화가 있어요",
          date: "2025.05.27",
        },
        {
          id: 2,
          category: "공지",
          title: "간편모드 개선사항 안내(2025.05.21)",
          date: "2025.05.21",
        },
        {
          id: 3,
          category: "공지",
          title: "채팅을 통한 '후기요청' 기능이 종료돼요",
          date: "2025.05.21",
        },
        {
          id: 4,
          category: "공지",
          title: "검색광고 최대 노출 개수 확대 테스트 안내",
          date: "2025.05.16",
        },
        {
          id: 5,
          category: "공지",
          title: "검색광고 소개 문구 정책 변경 안내",
          date: "2025.05.15",
        },
        {
          id: 6,
          category: "공지",
          title: "추가 사업자 인증을 진행해 주세요",
          date: "2025.05.14",
        },
        {
          id: 7,
          category: "공지",
          title: "재방문 고객도 후기를 남길 수 있어요",
          date: "2025.05.12",
        },
        {
          id: 8,
          category: "이벤트",
          title: "당근 전문가모드 광고 웨비나 (05.21)",
          date: "2025.05.07",
        },
        {
          id: 9,
          category: "공지",
          title: "[상품판매/포장주문]영중소 등급 및 차액정산",
          date: "2025.05.07",
        },
        {
          id: 10,
          category: "전문가모드",
          title: "변동파라미터 기능을 사용해 보세요.",
          date: "2025.05.02",
        },
      ],

      currentPage: 1,
      itemsPerPage: 10,
    };
  },

  computed: {
    filteredNotices() {
      if (this.selectedTab === "all") {
        return this.notices;
      }
      return this.notices.filter(
        (notice) => notice.category === this.selectedTab
      );
    },

    totalPages() {
      return Math.ceil(this.filteredNotices.length / this.itemsPerPage) || 1;
    },

    paginatedNotices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNotices.slice(start, end);
    },
  },

  methods: {
    selectTab(tabKey) {
      if (this.selectedTab === tabKey) return;
      this.selectedTab = tabKey;
      this.currentPage = 1;
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
};
</script>
