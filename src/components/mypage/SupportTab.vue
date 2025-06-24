<template>
  <div class="space-y-6">
    <h3 class="text-xl font-semibold text-gray-900">고객지원</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 고객센터 메뉴 -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">고객센터</h4>
        <div class="space-y-3">
          <!-- 고객센터 메뉴들 -->
          <component
            v-for="menu in supportMenus"
            :key="menu.id"
            :is="menu.isRouter ? 'router-link' : 'a'"
            :to="menu.isRouter ? menu.link : undefined"
            :href="menu.isRouter ? undefined : menu.link"
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
          </component>
        </div>
      </div>

      <!-- 자주 묻는 질문 & 문의 -->
      <div class="space-y-4">
        <h4 class="text-lg font-medium text-gray-900">도움말</h4>
        <div class="space-y-3">
          <!-- 자주 묻는 질문 -->
          <router-link
            to="/SupportFAQ"
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
                자주 묻는 질문
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
          </router-link>

          <!-- 1:1 문의하기 -->
          <button
            @click="openInquiryModal"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span class="font-medium group-hover:text-orange-600">
                1:1 문의하기
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
          </button>

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

    <!-- 1:1 문의하기 모달 -->
    <div
      v-if="showInquiryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeInquiryModal"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- 모달 헤더 -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900">1:1 문의하기</h3>
          <button
            @click="closeInquiryModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 모달 내용 -->
        <form @submit.prevent="submitInquiry" class="p-6 space-y-4">
          <!-- 문의 유형 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              문의 유형
            </label>
            <select
              v-model="inquiryForm.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              <option value="account">계정/로그인</option>
              <option value="trading">거래 관련</option>
              <option value="technical">기술적 문제</option>
              <option value="payment">결제 문의</option>
              <option value="other">기타</option>
            </select>
          </div>

          <!-- 제목 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              v-model="inquiryForm.title"
              placeholder="문의 제목을 입력해주세요"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <!-- 내용 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              문의 내용
            </label>
            <textarea
              v-model="inquiryForm.content"
              rows="6"
              placeholder="문의하실 내용을 자세히 작성해주세요"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- 이메일 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              답변 받을 이메일
            </label>
            <input
              type="email"
              v-model="inquiryForm.email"
              placeholder="example@email.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <!-- 안내 메시지 -->
          <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
            <p class="text-sm text-blue-800">
              💡 문의하신 내용은 영업일 기준 1-2일 내에 답변드립니다.
            </p>
          </div>

          <!-- 버튼 -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeInquiryModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              문의하기
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupportTab",

  data() {
    return {
      showInquiryModal: false,
      inquiryForm: {
        category: "",
        title: "",
        content: "",
        email: "",
      },
      supportMenus: [
        {
          id: 1,
          title: "공지사항",
          link: "/notice",
          isRouter: true,
          iconPath:
            "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
        },
        {
          id: 2,
          title: "약관 및 정책",
          link: "/PolicyPages",
          isRouter: true,
          iconPath:
            "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
      ],
    };
  },

  methods: {
    openInquiryModal() {
      this.showInquiryModal = true;
      document.body.style.overflow = "hidden";
    },

    closeInquiryModal() {
      this.showInquiryModal = false;
      document.body.style.overflow = "auto";

      this.inquiryForm = {
        category: "",
        title: "",
        content: "",
        email: "",
      };
    },

    submitInquiry() {
      if (
        !this.inquiryForm.category ||
        !this.inquiryForm.title ||
        !this.inquiryForm.content ||
        !this.inquiryForm.email
      ) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      // 실제 API 호출 위치
      console.log("문의 내용:", this.inquiryForm);

      alert(
        "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다."
      );
      this.closeInquiryModal();
    },
  },

  beforeDestroy() {
    document.body.style.overflow = "auto";
  },
};
</script>
