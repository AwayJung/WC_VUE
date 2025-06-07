<template>
  <div class="notice-container">
    <TheHeader/>
    <div class="mt-6 text-2xl font-bold">공지사항</div>
    <!-- 1. 탭 메뉴 -->
    <div class="tabs mt-4 mb-4 border-b border-gray-200">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: selectedTab === tab.key }]"
          @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 2. 공지 목록 테이블 -->
    <table class="notice-table">
      <thead>
      <tr>
        <th class="col-category">구분</th>
        <th class="col-title">제목</th>
        <th class="col-date">날짜</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="notice in paginatedNotices" :key="notice.id">
        <td class="col-category">{{ notice.category }}</td>
        <td class="col-title">{{ notice.title }}</td>
        <td class="col-date">{{ notice.date }}</td>
      </tr>
      <tr v-if="paginatedNotices.length === 0">
        <td colspan="3" class="no-data">표시할 공지가 없습니다.</td>
      </tr>
      </tbody>
    </table>

    <!-- 3. 페이징 네비게이션 -->
    <div class="pagination">
      <button
          class="page-nav"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
      >
        &lt;
      </button>
      <button
          v-for="page in totalPages"
          :key="page"
          :class="['page-number', { active: currentPage === page }]"
          @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button
          class="page-nav"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script>
import TheHeader from "@/components/layout/TheHeader.vue";

export default {
  name: 'NoticeList',
  components: {TheHeader},

  data() {
    return {
      // 탭 정보: label(화면에 보이는 이름), key(내부에서 비교할 값)
      tabs: [
        { label: '전체', key: 'all' },
        { label: '공지', key: '공지' },
        { label: '이벤트', key: '이벤트' },
        { label: '전문가모드', key: '전문가모드' },
      ],
      // 초기 선택 탭: all (전체)
      selectedTab: 'all',

      // 예시 공지 데이터 (실제 프로젝트에서는 API 호출 등으로 동적 로딩)
      notices: [
        { id: 1, category: '공지', title: '후기 평점 산정 방식에 변화가 있어요', date: '2025.05.27' },
        { id: 2, category: '공지', title: '간편모드 개선사항 안내(2025.05.21)', date: '2025.05.21' },
        { id: 3, category: '공지', title: "채팅을 통한 '후기요청' 기능이 종료돼요", date: '2025.05.21' },
        { id: 4, category: '공지', title: '검색광고 최대 노출 개수 확대 테스트 안내', date: '2025.05.16' },
        { id: 5, category: '공지', title: '검색광고 소개 문구 정책 변경 안내', date: '2025.05.15' },
        { id: 6, category: '공지', title: '추가 사업자 인증을 진행해 주세요', date: '2025.05.14' },
        { id: 7, category: '공지', title: '재방문 고객도 후기를 남길 수 있어요', date: '2025.05.12' },
        { id: 8, category: '이벤트', title: '당근 전문가모드 광고 웨비나 (05.21)', date: '2025.05.07' },
        { id: 9, category: '공지', title: '[상품판매/포장주문]영중소 등급 및 차액정산', date: '2025.05.07' },
        { id: 10, category: '전문가모드', title: '변동파라미터 기능을 사용해 보세요.', date: '2025.05.02' },
        // 필요 시 추가 항목...
      ],

      // 페이징 상태
      currentPage: 1,     // 현재 보고 있는 페이지 번호
      itemsPerPage: 10,    // 한 페이지당 보여줄 공지 개수
    };
  },

  computed: {
    // 선택된 탭(키)에 따라 필터링된 공지 목록 반환
    filteredNotices() {
      if (this.selectedTab === 'all') {
        return this.notices;
      }
      // category 필드가 탭의 key와 일치하는 항목만 반환
      return this.notices.filter(notice => notice.category === this.selectedTab);
    },

    // 필터링된 공지 기준 총 페이지 개수
    totalPages() {
      return Math.ceil(this.filteredNotices.length / this.itemsPerPage) || 1;
    },

    // 현재 페이지에 해당하는 공지 목록 (slice 사용)
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNotices.slice(start, end);
    },
  },

  methods: {
    // 탭 변경 시 호출 -> 선택 값 업데이트, 그리고 페이지를 항상 1로 초기화
    selectTab(tabKey) {
      if (this.selectedTab === tabKey) return;
      this.selectedTab = tabKey;
      this.currentPage = 1;
    },

    // 페이지 변경 시 호출 (이전/다음 또는 번호 클릭)
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.notice-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 1. 탭 스타일 */
.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 16px;
  color: #555;
  transition: color 0.2s, border-bottom-color 0.2s;
}

.tab-btn:hover {
  color: #222;
}

.tab-btn.active {
  color: #000;
  border-bottom-color: #000;
}

/* 2. 테이블 스타일 */
.notice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.notice-table th,
.notice-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #ececec;
  font-size: 14px;
}

.notice-table thead th {
  background-color: #f8f8f8;
  font-weight: 500;
}

.col-category {
  width: 15%;
}

.col-title {
  width: 70%;
}

.col-date {
  width: 15%;
  text-align: right;
  color: #888;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

/* 3. 페이징 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
}

.page-nav,
.page-number {
  margin: 0 4px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s, color 0.2s;
}

.page-nav[disabled] {
  cursor: default;
  color: #bbb;
  border-color: #eee;
}

.page-number:hover:not(.active) {
  background-color: #f0f0f0;
}

.page-number.active {
  background-color: #333;
  color: white;
  border-color: #333;
}
</style>
