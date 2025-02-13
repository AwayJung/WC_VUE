<!-- components/layout/TheFooter.vue -->
<template>
  <footer class="bg-gray-50 border-t">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-sm font-semibold mb-4">중고거래</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >매물 등록</a
              >
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >안전거래</a
              >
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >자주 묻는 질문</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-4">서비스</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >이용약관</a
              >
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >개인정보처리방침</a
              >
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >운영정책</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-4">기타</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >공지사항</a
              >
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >앱 다운로드</a
              >
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700"
                >회사 소개</a
              >
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-4">고객센터</h3>
          <p class="text-sm text-gray-500">
            평일 09:00 ~ 18:00<br />
            (주말, 공휴일 제외)
          </p>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-400">
          © 2024 당근마켓 클론. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "TheFooter",
};
</script>

<style scoped>
.container {
  max-width: 1160px;
}
</style>
