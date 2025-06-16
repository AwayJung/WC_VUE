<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <TheHeader />

    <!-- Main Content -->
    <div class="flex-1">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 페이지 헤더 -->
        <div class="text-center pt-16 pb-12">
          <div
            class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <span class="text-2xl">❓</span>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">자주 묻는 질문</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            당근마켓 이용 중 궁금한 점들을 빠르게 찾아보세요
          </p>
        </div>

        <!-- 검색 바 -->
        <div class="max-w-xl mx-auto mb-12">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="검색어를 입력하세요"
              class="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            />
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
              <span class="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        <!-- 카테고리 탭 -->
        <div class="flex justify-center mb-12">
          <div
            class="bg-white rounded-xl border border-gray-200 p-1 inline-flex"
          >
            <button
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- FAQ 섹션 -->
        <div class="mb-20">
          <div
            v-for="category in categories"
            :key="category.id"
            v-show="activeCategory === 'all' || activeCategory === category.id"
            class="mb-12"
          >
            <!-- 카테고리 제목 -->
            <div v-if="activeCategory === 'all'" class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <span class="mr-2">{{ category.icon }}</span>
                {{ category.name }}
              </h2>
              <div class="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </div>

            <!-- FAQ 리스트 -->
            <div class="space-y-3">
              <div
                v-for="(faq, index) in getFilteredFAQs(category.faqs)"
                :key="index"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <!-- 질문 -->
                <button
                  @click="toggleFAQ(category.id, index)"
                  class="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <h3 class="font-medium text-gray-900 pr-4">
                    {{ faq.question }}
                  </h3>
                  <div
                    :class="[
                      'w-6 h-6 flex items-center justify-center text-gray-400 transition-transform',
                      faq.isOpen ? 'rotate-180' : '',
                    ]"
                  >
                    <span>▼</span>
                  </div>
                </button>

                <!-- 답변 -->
                <div
                  v-show="faq.isOpen"
                  class="px-6 pb-6 border-t border-gray-100 bg-gray-50"
                >
                  <div class="pt-4">
                    <div
                      v-html="faq.answer"
                      class="text-gray-700 prose prose-sm max-w-none"
                    ></div>
                    <!-- 태그 -->
                    <div v-if="faq.tags" class="mt-4 flex flex-wrap gap-2">
                      <span
                        v-for="tag in faq.tags"
                        :key="tag"
                        class="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-md"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  name: "FrequentlyAskedQuestions",
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      searchQuery: "",
      activeCategory: "all",
      categories: [
        {
          id: "all",
          name: "전체",
          icon: "📋",
          faqs: [],
        },
        {
          id: "account",
          name: "계정/인증",
          icon: "👤",
          faqs: [
            {
              question: "동네 인증은 어떻게 하나요?",
              answer: `
                  <p class="mb-3"><strong>동네 인증 방법:</strong></p>
                  <ol class="list-decimal list-inside space-y-2 mb-4">
                    <li>당근마켓 앱에서 '나의 당근' → '내 동네 설정' 선택</li>
                    <li>현재 위치를 기반으로 동네를 선택</li>
                    <li>GPS 기능을 켜고 '현재 위치로 동네 인증' 버튼 클릭</li>
                    <li>인증 완료 후 해당 동네에서 활동 가능</li>
                  </ol>
                  <p class="text-sm text-blue-600">💡 팁: 최대 2개 동네까지 설정할 수 있어요!</p>
                `,
              tags: ["동네인증", "GPS", "위치"],
              isOpen: false,
            },
            {
              question: "매너온도는 어떻게 올릴 수 있나요?",
              answer: `
                  <p class="mb-3"><strong>매너온도 향상 방법:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li>약속 시간과 장소를 정확히 지키기</li>
                    <li>상품 상태를 정확하게 설명하기</li>
                    <li>예의 바른 채팅과 친근한 소통</li>
                    <li>거래 후 감사 인사 전하기</li>
                    <li>동네 이웃들과 활발한 소통</li>
                  </ul>
                  <p class="text-sm text-green-600">🌡️ 매너온도는 이웃들의 후기를 통해 올라가요!</p>
                `,
              tags: ["매너온도", "거래후기", "소통"],
              isOpen: false,
            },
            {
              question: "계정을 삭제하고 싶어요.",
              answer: `
                  <p class="mb-3"><strong>계정 삭제 방법:</strong></p>
                  <ol class="list-decimal list-inside space-y-2 mb-4">
                    <li>'나의 당근' → '설정' → '계정/정보관리' 선택</li>
                    <li>'당근마켓 탈퇴' 선택</li>
                    <li>탈퇴 사유 선택 후 확인</li>
                    <li>최종 확인 후 계정 삭제 완료</li>
                  </ol>
                  <p class="text-sm text-red-600">⚠️ 주의: 삭제된 계정과 데이터는 복구할 수 없습니다.</p>
                `,
              tags: ["계정삭제", "탈퇴", "개인정보"],
              isOpen: false,
            },
          ],
        },
        {
          id: "trading",
          name: "거래/판매",
          icon: "💰",
          faqs: [
            {
              question: "안전한 거래 방법이 궁금해요.",
              answer: `
                  <p class="mb-3"><strong>안전거래 수칙:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><strong>직거래 우선:</strong> 가능한 직접 만나서 거래하세요</li>
                    <li><strong>공개된 장소:</strong> 카페, 지하철역 등 사람이 많은 곳에서 만나세요</li>
                    <li><strong>사전 확인:</strong> 상대방의 매너온도와 후기를 확인하세요</li>
                    <li><strong>현금거래:</strong> 계좌이체보다는 현금거래를 권장해요</li>
                    <li><strong>의심스러운 경우:</strong> 거래를 중단하고 신고하세요</li>
                  </ul>
                  <p class="text-sm text-blue-600">🛡️ 당근페이를 이용하면 더욱 안전하게 거래할 수 있어요!</p>
                `,
              tags: ["안전거래", "직거래", "당근페이"],
              isOpen: false,
            },
            {
              question: "좋은 상품 사진은 어떻게 찍나요?",
              answer: `
                  <p class="mb-3"><strong>상품 사진 촬영 팁:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><strong>자연광 활용:</strong> 창가에서 밝은 자연광으로 촬영</li>
                    <li><strong>깔끔한 배경:</strong> 흰색이나 단색 배경 사용</li>
                    <li><strong>다양한 각도:</strong> 정면, 측면, 뒷면 등 여러 각도로 촬영</li>
                    <li><strong>실제 상태:</strong> 흠집이나 사용감도 정직하게 촬영</li>
                    <li><strong>크기 비교:</strong> 동전이나 손 등을 함께 찍어 크기 표현</li>
                  </ul>
                  <p class="text-sm text-green-600">📸 좋은 사진은 빠른 판매의 지름길이에요!</p>
                `,
              tags: ["상품사진", "촬영팁", "판매"],
              isOpen: false,
            },
            {
              question: "판매글 작성 시 주의사항이 있나요?",
              answer: `
                  <p class="mb-3"><strong>판매글 작성 가이드:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><strong>정확한 제목:</strong> 브랜드, 모델명, 상태를 명시</li>
                    <li><strong>상세한 설명:</strong> 구매 시기, 사용 기간, 상태 등을 구체적으로</li>
                    <li><strong>적정한 가격:</strong> 시세를 조사해 합리적인 가격 책정</li>
                    <li><strong>카테고리 선택:</strong> 정확한 카테고리로 분류</li>
                    <li><strong>연락 방법:</strong> 선호하는 연락 시간대 명시</li>
                  </ul>
                  <p class="text-sm text-blue-600">✍️ 자세하고 정직한 설명이 신뢰도를 높여줘요!</p>
                `,
              tags: ["판매글", "작성법", "상품설명"],
              isOpen: false,
            },
          ],
        },
        {
          id: "community",
          name: "동네생활",
          icon: "🏘️",
          faqs: [
            {
              question: "동네생활에는 어떤 글을 올릴 수 있나요?",
              answer: `
                  <p class="mb-3"><strong>동네생활 게시 가능한 내용:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><strong>동네질문:</strong> 맛집, 병원, 학원 등 지역 정보 문의</li>
                    <li><strong>동네소식:</strong> 지역 행사, 공지사항 등</li>
                    <li><strong>분실/실종:</strong> 반려동물이나 물건 찾기</li>
                    <li><strong>취미/모임:</strong> 운동, 독서 등 모임 모집</li>
                    <li><strong>일상:</strong> 동네에서의 소소한 일상 공유</li>
                  </ul>
                  <p class="text-sm text-red-600">❌ 광고, 정치, 종교 관련 글은 금지되어 있어요.</p>
                `,
              tags: ["동네생활", "커뮤니티", "게시글"],
              isOpen: false,
            },
            {
              question: "우리 동네에서 모임을 만들고 싶어요.",
              answer: `
                  <p class="mb-3"><strong>동네 모임 만들기:</strong></p>
                  <ol class="list-decimal list-inside space-y-2 mb-4">
                    <li>'동네생활' → '글쓰기' → '모임' 선택</li>
                    <li>모임 제목과 상세 내용 작성</li>
                    <li>모집 인원, 일시, 장소 명시</li>
                    <li>연락 방법과 준비물 안내</li>
                    <li>게시 후 댓글로 참여자 모집</li>
                  </ol>
                  <p class="text-sm text-green-600">👥 같은 관심사를 가진 이웃들과 만나보세요!</p>
                `,
              tags: ["모임", "동네활동", "커뮤니티"],
              isOpen: false,
            },
          ],
        },
        {
          id: "technical",
          name: "기술/오류",
          icon: "⚙️",
          faqs: [
            {
              question: "앱이 자꾸 꺼져요.",
              answer: `
                  <p class="mb-3"><strong>앱 종료 문제 해결 방법:</strong></p>
                  <ol class="list-decimal list-inside space-y-2 mb-4">
                    <li><strong>앱 재시작:</strong> 당근마켓 앱을 완전히 종료 후 재실행</li>
                    <li><strong>업데이트 확인:</strong> 앱스토어에서 최신 버전으로 업데이트</li>
                    <li><strong>저장공간 확인:</strong> 휴대폰 저장공간 부족 시 정리</li>
                    <li><strong>휴대폰 재시작:</strong> 디바이스 전체 재부팅</li>
                    <li><strong>앱 재설치:</strong> 삭제 후 다시 설치</li>
                  </ol>
                  <p class="text-sm text-blue-600">📱 문제가 지속되면 고객센터로 문의해 주세요.</p>
                `,
              tags: ["앱오류", "기술문제", "해결방법"],
              isOpen: false,
            },
            {
              question: "알림이 오지 않아요.",
              answer: `
                  <p class="mb-3"><strong>알림 설정 확인 방법:</strong></p>
                  <ol class="list-decimal list-inside space-y-2 mb-4">
                    <li><strong>앱 내 설정:</strong> '나의 당근' → '설정' → '알림' 확인</li>
                    <li><strong>휴대폰 설정:</strong> 설정 → 알림 → 당근마켓 알림 허용</li>
                    <li><strong>방해금지 모드:</strong> 방해금지 모드 해제</li>
                    <li><strong>배터리 최적화:</strong> 당근마켓 앱 배터리 최적화 해제</li>
                    <li><strong>네트워크 확인:</strong> 와이파이 또는 데이터 연결 상태 확인</li>
                  </ol>
                  <p class="text-sm text-green-600">🔔 중요한 거래 알림을 놓치지 마세요!</p>
                `,
              tags: ["알림", "설정", "푸시알림"],
              isOpen: false,
            },
          ],
        },
        {
          id: "policy",
          name: "정책/약관",
          icon: "📋",
          faqs: [
            {
              question: "개인정보는 어떻게 보호되나요?",
              answer: `
                  <p class="mb-3"><strong>개인정보 보호 정책:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><strong>최소한의 정보 수집:</strong> 서비스 이용에 필요한 최소한의 정보만 수집</li>
                    <li><strong>암호화 저장:</strong> 개인정보는 암호화되어 안전하게 저장</li>
                    <li><strong>제3자 제공 금지:</strong> 동의 없이 개인정보를 제3자에게 제공하지 않음</li>
                    <li><strong>정기적 삭제:</strong> 불필요한 정보는 정기적으로 삭제</li>
                    <li><strong>투명한 공개:</strong> 개인정보 처리방침을 투명하게 공개</li>
                  </ul>
                  <p class="text-sm text-blue-600">🔒 당근마켓은 여러분의 개인정보를 소중히 지킵니다.</p>
                `,
              tags: ["개인정보", "보안", "정책"],
              isOpen: false,
            },
            {
              question: "금지된 물품이 있나요?",
              answer: `
                  <p class="mb-3"><strong>판매 금지 물품:</strong></p>
                  <ul class="list-disc list-inside space-y-2 mb-4">
                    <li><strong>법적 금지:</strong> 총기, 마약, 위조품, 의료기기 등</li>
                    <li><strong>생물:</strong> 동식물 (반려동물 분양은 별도 정책)</li>
                    <li><strong>개인정보:</strong> 신분증, 통장, 카드 등</li>
                    <li><strong>성인용품:</strong> 성인용품 및 관련 콘텐츠</li>
                    <li><strong>기타:</strong> 음식, 화장품(개봉), 속옷 등</li>
                  </ul>
                  <p class="text-sm text-red-600">⚠️ 금지 물품 판매 시 계정 제재를 받을 수 있어요.</p>
                `,
              tags: ["금지물품", "판매정책", "규정"],
              isOpen: false,
            },
          ],
        },
      ],
    };
  },
  computed: {
    filteredCategories() {
      if (this.activeCategory === "all") {
        return this.categories.filter((cat) => cat.id !== "all");
      }
      return this.categories.filter((cat) => cat.id === this.activeCategory);
    },
  },
  methods: {
    toggleFAQ(categoryId, faqIndex) {
      const category = this.categories.find((cat) => cat.id === categoryId);
      if (category && category.faqs[faqIndex]) {
        category.faqs[faqIndex].isOpen = !category.faqs[faqIndex].isOpen;
      }
    },
    getFilteredFAQs(faqs) {
      if (!this.searchQuery) return faqs;

      return faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (faq.tags &&
            faq.tags.some((tag) =>
              tag.toLowerCase().includes(this.searchQuery.toLowerCase())
            ))
      );
    },
  },
};
</script>

<style scoped>
.prose ul li,
.prose ol li {
  margin: 0.5rem 0;
}

.prose strong {
  color: #374151;
}
</style>
