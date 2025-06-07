<template>
  <div class="space-y-6">
    <h3 class="text-xl font-semibold text-gray-900">고객지원</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 자주 묻는 질문 -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">자주 묻는 질문</h4>
        <div class="space-y-3">
          <a
            v-for="faq in faqItems"
            :key="faq.id"
            :href="faq.link"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-gray-400 mr-3 group-hover:text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="font-medium group-hover:text-orange-600">
                {{ faq.title }}
              </span>
            </div>
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- 고객센터 -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">고객센터</h4>
        <div class="space-y-3">
          <!-- 고객센터 메뉴들 -->
          <a
            v-for="menu in supportMenus"
            :key="menu.id"
            :href="menu.link"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-gray-400 mr-3 group-hover:text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="menu.iconPath"
                />
              </svg>
              <span class="font-medium group-hover:text-orange-600">
                {{ menu.title }}
              </span>
            </div>
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          <!-- 고객센터 전화 -->
          <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-orange-500 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <div class="font-medium text-orange-800 mb-1">
                  고객센터 전화
                </div>
                <div class="text-orange-700 font-semibold">1588-7777</div>
                <div class="text-sm text-orange-600 mt-1">
                  평일 09:00 - 18:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupportTab",

  data() {
    return {
      faqItems: [
        {
          id: 1,
          title: "안전한 거래 방법은?",
          link: "#",
        },
        {
          id: 2,
          title: "계정 관련 문의",
          link: "#",
        },
        {
          id: 3,
          title: "신고 및 차단",
          link: "#",
        },
      ],

      supportMenus: [
        {
          id: 1,
          title: "공지사항",
          link: "Notice",
          iconPath:
            "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
        },
        {
          id: 2,
          title: "약관 및 정책",
          link: "#",
          iconPath:
            "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
        {
          id: 3,
          title: "1:1 문의하기",
          link: "#",
          iconPath:
            "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
        },
      ],
    };
  },
};
</script>
