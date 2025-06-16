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
            <span class="text-2xl">📋</span>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">약관 및 정책</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            당근마켓 서비스 이용과 관련된 약관 및 정책을 확인하세요
          </p>
        </div>

        <!-- 네비게이션 탭 -->
        <div class="flex justify-center mb-12">
          <div
            class="bg-white rounded-xl border border-gray-200 p-1 inline-flex"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-3 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- 컨텐츠 섹션 -->
        <div class="mb-20">
          <!-- 서비스 이용약관 -->
          <div
            v-show="activeTab === 'terms'"
            class="bg-white rounded-xl border border-gray-200 p-8"
          >
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                서비스 이용약관
              </h2>
              <p class="text-sm text-gray-500">최종 수정일: 2024년 12월 1일</p>
            </div>

            <div class="prose max-w-none">
              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  제1조 (목적)
                </h3>
                <p class="text-gray-700 leading-relaxed mb-4">
                  이 약관은 당근마켓 주식회사(이하 "회사")가 제공하는 당근마켓
                  서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의
                  권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
                  합니다.
                </p>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  제2조 (정의)
                </h3>
                <div class="space-y-3">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="font-medium text-gray-900 mb-2">1. "서비스"</p>
                    <p class="text-gray-700">
                      회사가 제공하는 당근마켓 플랫폼 및 이와 관련된 제반
                      서비스를 의미합니다.
                    </p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="font-medium text-gray-900 mb-2">2. "이용자"</p>
                    <p class="text-gray-700">
                      이 약관에 따라 회사가 제공하는 서비스를 받는 개인 또는
                      법인을 의미합니다.
                    </p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="font-medium text-gray-900 mb-2">3. "계정"</p>
                    <p class="text-gray-700">
                      서비스 이용을 위해 이용자가 등록한 개인정보와 서비스
                      이용정보를 의미합니다.
                    </p>
                  </div>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  제3조 (약관의 효력 및 변경)
                </h3>
                <ol class="list-decimal list-inside space-y-2 text-gray-700">
                  <li>
                    이 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이
                    발생합니다.
                  </li>
                  <li>
                    회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할
                    수 있습니다.
                  </li>
                  <li>
                    약관이 변경되는 경우 적용일자 및 변경사유를 명시하여
                    현행약관과 함께 제1항의 방식에 따라 그 적용일자 7일 이전부터
                    공지합니다.
                  </li>
                </ol>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  제4조 (서비스의 제공)
                </h3>
                <div
                  class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg mb-4"
                >
                  <p class="text-orange-800 font-medium">
                    당근마켓이 제공하는 주요 서비스
                  </p>
                </div>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li>중고거래 플랫폼 서비스</li>
                  <li>동네생활 커뮤니티 서비스</li>
                  <li>알바/구인구직 서비스</li>
                  <li>부동산 직거래 서비스</li>
                  <li>중고차 직거래 서비스</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </section>
            </div>
          </div>

          <!-- 개인정보 처리방침 -->
          <div
            v-show="activeTab === 'privacy'"
            class="bg-white rounded-xl border border-gray-200 p-8"
          >
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                개인정보 처리방침
              </h2>
              <p class="text-sm text-gray-500">최종 수정일: 2024년 12월 1일</p>
            </div>

            <div class="prose max-w-none">
              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  1. 개인정보의 처리목적
                </h3>
                <p class="text-gray-700 leading-relaxed mb-4">
                  당근마켓은 다음의 목적을 위하여 개인정보를 처리합니다.
                  처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지
                  않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에
                  따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>

                <div class="grid md:grid-cols-2 gap-4">
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-900 mb-2">
                      서비스 제공
                    </h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                      <li>• 회원가입 및 관리</li>
                      <li>• 서비스 제공에 관한 계약 이행</li>
                      <li>• 콘텐츠 제공</li>
                    </ul>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-900 mb-2">
                      서비스 개선
                    </h4>
                    <ul class="text-sm text-green-800 space-y-1">
                      <li>• 신규 서비스 개발</li>
                      <li>• 맞춤형 서비스 제공</li>
                      <li>• 통계작성 및 학술연구</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  2. 처리하는 개인정보 항목
                </h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          구분
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          수집항목
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          수집목적
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          필수정보
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                          휴대폰번호, 닉네임, 프로필사진
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                          회원가입, 본인인증
                        </td>
                      </tr>
                      <tr>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          선택정보
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                          이메일, 주소, 관심사
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                          맞춤형 서비스 제공
                        </td>
                      </tr>
                      <tr>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          자동수집
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                          IP주소, 쿠키, 방문기록
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                          서비스 이용분석, 개선
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  3. 개인정보의 보유 및 이용기간
                </h3>
                <div
                  class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
                >
                  <p class="text-yellow-800">
                    회사는 법령에 따른 개인정보 보유·이용기간 또는
                    정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
                    보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>
                </div>
              </section>
            </div>
          </div>

          <!-- 커뮤니티 가이드라인 -->
          <div
            v-show="activeTab === 'community'"
            class="bg-white rounded-xl border border-gray-200 p-8"
          >
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                커뮤니티 가이드라인
              </h2>
              <p class="text-sm text-gray-500">최종 수정일: 2024년 12월 1일</p>
            </div>

            <div class="prose max-w-none">
              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  🤝 우리가 지향하는 가치
                </h3>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="text-center p-4 bg-orange-50 rounded-lg">
                    <div class="text-3xl mb-2">💚</div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      따뜻한 소통
                    </h4>
                    <p class="text-sm text-gray-600">
                      이웃과 따뜻하게 소통하며 서로를 배려합니다
                    </p>
                  </div>
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-3xl mb-2">🔒</div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      안전한 거래
                    </h4>
                    <p class="text-sm text-gray-600">
                      신뢰할 수 있는 안전한 거래 환경을 만듭니다
                    </p>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-3xl mb-2">🌱</div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      건전한 문화
                    </h4>
                    <p class="text-sm text-gray-600">
                      모두가 편안한 건전한 커뮤니티를 지향합니다
                    </p>
                  </div>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  ✅ 이런 활동을 권장해요
                </h3>
                <div class="space-y-3">
                  <div
                    class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                  >
                    <span class="text-green-600 mt-0.5">✓</span>
                    <div>
                      <p class="font-medium text-green-900">
                        정확하고 상세한 상품 설명
                      </p>
                      <p class="text-sm text-green-700">
                        상품의 상태, 구매 시기, 사용감 등을 솔직하게
                        작성해주세요
                      </p>
                    </div>
                  </div>
                  <div
                    class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                  >
                    <span class="text-green-600 mt-0.5">✓</span>
                    <div>
                      <p class="font-medium text-green-900">예의 바른 소통</p>
                      <p class="text-sm text-green-700">
                        상대방을 배려하는 따뜻한 말투로 대화해주세요
                      </p>
                    </div>
                  </div>
                  <div
                    class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                  >
                    <span class="text-green-600 mt-0.5">✓</span>
                    <div>
                      <p class="font-medium text-green-900">약속 시간 준수</p>
                      <p class="text-sm text-green-700">
                        거래 약속 시간을 지키고, 변경 시에는 미리 연락해주세요
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  ❌ 이런 행위는 금지돼요
                </h3>
                <div class="space-y-3">
                  <div
                    class="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
                  >
                    <span class="text-red-600 mt-0.5">✗</span>
                    <div>
                      <p class="font-medium text-red-900">허위 정보 및 사기</p>
                      <p class="text-sm text-red-700">
                        거짓 정보를 제공하거나 사기성 거래를 시도하는 행위
                      </p>
                    </div>
                  </div>
                  <div
                    class="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
                  >
                    <span class="text-red-600 mt-0.5">✗</span>
                    <div>
                      <p class="font-medium text-red-900">욕설 및 비방</p>
                      <p class="text-sm text-red-700">
                        상대방에게 모욕감을 주는 언어나 행동
                      </p>
                    </div>
                  </div>
                  <div
                    class="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
                  >
                    <span class="text-red-600 mt-0.5">✗</span>
                    <div>
                      <p class="font-medium text-red-900">금지 물품 판매</p>
                      <p class="text-sm text-red-700">
                        법적으로 판매가 금지된 물품이나 위험한 물품의 거래
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  🚨 신고 및 제재
                </h3>
                <div class="bg-gray-50 p-6 rounded-lg">
                  <p class="text-gray-700 mb-4">
                    가이드라인을 위반하는 행위를 발견하시면 즉시 신고해주세요.
                    신고된 내용은 검토 후 다음과 같은 조치가 취해질 수 있습니다.
                  </p>
                  <ul class="list-disc list-inside space-y-2 text-gray-700">
                    <li>경고 메시지 발송</li>
                    <li>일시적 서비스 이용 제한</li>
                    <li>계정 영구 정지</li>
                    <li>관련 기관 신고 (법적 위반 시)</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>

          <!-- 쿠키 정책 -->
          <div
            v-show="activeTab === 'cookie'"
            class="bg-white rounded-xl border border-gray-200 p-8"
          >
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">쿠키 정책</h2>
              <p class="text-sm text-gray-500">최종 수정일: 2024년 12월 1일</p>
            </div>

            <div class="prose max-w-none">
              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  쿠키란 무엇인가요?
                </h3>
                <p class="text-gray-700 leading-relaxed mb-4">
                  쿠키는 사용자가 웹사이트를 방문할 때 사용자의 컴퓨터에
                  저장되는 작은 텍스트 파일입니다. 쿠키를 통해 웹사이트는
                  사용자의 기기를 식별하고 일부 정보를 저장할 수 있습니다.
                </p>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  당근마켓에서 사용하는 쿠키
                </h3>
                <div class="space-y-4">
                  <div class="border border-gray-200 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">필수 쿠키</h4>
                    <p class="text-gray-700 text-sm mb-2">
                      웹사이트의 기본 기능을 위해 반드시 필요한 쿠키입니다.
                    </p>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      <li>로그인 상태 유지</li>
                      <li>보안 및 인증</li>
                      <li>사이트 기본 설정</li>
                    </ul>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">성능 쿠키</h4>
                    <p class="text-gray-700 text-sm mb-2">
                      웹사이트의 성능 개선을 위한 쿠키입니다.
                    </p>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      <li>페이지 로딩 시간 측정</li>
                      <li>오류 발생 추적</li>
                      <li>사용자 경험 개선</li>
                    </ul>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">분석 쿠키</h4>
                    <p class="text-gray-700 text-sm mb-2">
                      서비스 이용 패턴 분석을 위한 쿠키입니다.
                    </p>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                      <li>방문 페이지 및 체류 시간</li>
                      <li>사용자 행동 패턴</li>
                      <li>인기 콘텐츠 분석</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section class="mb-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  쿠키 관리 방법
                </h3>
                <div
                  class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg"
                >
                  <p class="text-blue-800 mb-2">
                    사용자는 브라우저 설정을 통해 쿠키를 관리할 수 있습니다.
                  </p>
                  <ul
                    class="text-sm text-blue-700 list-disc list-inside space-y-1"
                  >
                    <li>쿠키 허용/차단 설정</li>
                    <li>기존 쿠키 삭제</li>
                    <li>쿠키 저장 시 알림 설정</li>
                  </ul>
                </div>
              </section>
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
  name: "TermsAndPolicy",
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      activeTab: "terms",
      tabs: [
        { id: "terms", name: "이용약관" },
        { id: "privacy", name: "개인정보처리방침" },
        { id: "community", name: "커뮤니티 가이드라인" },
        { id: "cookie", name: "쿠키 정책" },
      ],
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  watch: {
    activeTab() {
      this.scrollToTop();
    },
  },
};
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose h3 {
  margin-top: 0;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin: 1rem 0;
}

.prose li {
  margin: 0.25rem 0;
}

.prose table {
  margin: 1rem 0;
}

.prose td,
.prose th {
  border: 1px solid #e5e7eb;
}
</style>
