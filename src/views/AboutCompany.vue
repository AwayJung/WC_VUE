<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white"
  >
    <!-- Header -->
    <TheHeader />

    <!-- Main Content -->
    <div class="flex-1">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 페이지 헤더 -->
        <div class="text-center pt-16 pb-12">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-6">
            당근마켓 이야기
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            따뜻한 동네를 만드는 우리의 여정과 비전을 소개합니다
          </p>
        </div>

        <!-- 우리의 비전 -->
        <section class="mb-20">
          <div
            class="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-12 border border-orange-100"
          >
            <div class="text-center mb-8">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-6"
              >
                <span class="text-2xl">✨</span>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">우리의 비전</h2>
            </div>
            <div class="max-w-4xl mx-auto">
              <p class="text-xl text-gray-700 leading-relaxed text-center mb-8">
                당근마켓은 우리 동네를 더 따뜻하고 안전하게 만드는 것을 목표로
                합니다. 이웃 간의 신뢰를 바탕으로 한 중고거래 플랫폼을 통해
                지속가능한 소비문화를 만들어 갑니다.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div class="text-center p-4">
                  <div class="text-3xl mb-2">🤝</div>
                  <h3 class="font-semibold text-gray-900 mb-2">신뢰 기반</h3>
                  <p class="text-sm text-gray-600">
                    이웃 간의 믿음으로 만드는 안전한 거래
                  </p>
                </div>
                <div class="text-center p-4">
                  <div class="text-3xl mb-2">🌱</div>
                  <h3 class="font-semibold text-gray-900 mb-2">지속 가능</h3>
                  <p class="text-sm text-gray-600">
                    환경을 생각하는 순환 경제 실현
                  </p>
                </div>
                <div class="text-center p-4">
                  <div class="text-3xl mb-2">🏘️</div>
                  <h3 class="font-semibold text-gray-900 mb-2">동네 중심</h3>
                  <p class="text-sm text-gray-600">지역 공동체 강화와 상생</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 주요 성과 -->
        <section class="mb-20">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">주요 성과</h2>
            <p class="text-gray-600">당근마켓의 성장과 함께한 이웃들</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center group">
              <div
                class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 group-hover:shadow-xl transition-all duration-300"
              >
                <div class="text-4xl font-bold text-orange-500 mb-2">
                  2,000만+
                </div>
                <div class="text-sm text-gray-600 font-medium">
                  월 활성 사용자
                </div>
              </div>
            </div>
            <div class="text-center group">
              <div
                class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 group-hover:shadow-xl transition-all duration-300"
              >
                <div class="text-4xl font-bold text-green-500 mb-2">전국</div>
                <div class="text-sm text-gray-600 font-medium">서비스 지역</div>
              </div>
            </div>
            <div class="text-center group">
              <div
                class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 group-hover:shadow-xl transition-all duration-300"
              >
                <div class="text-4xl font-bold text-blue-500 mb-2">9년+</div>
                <div class="text-sm text-gray-600 font-medium">서비스 운영</div>
              </div>
            </div>
            <div class="text-center group">
              <div
                class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 group-hover:shadow-xl transition-all duration-300"
              >
                <div class="text-4xl font-bold text-purple-500 mb-2">1위</div>
                <div class="text-sm text-gray-600 font-medium">중고거래 앱</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 연혁 -->
        <section class="mb-20">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              당근마켓의 여정
            </h2>
            <p class="text-gray-600">
              작은 시작에서 전국 서비스까지의 성장 이야기
            </p>
          </div>

          <div class="max-w-4xl mx-auto">
            <div class="relative">
              <!-- 타임라인 선 -->
              <div
                class="absolute left-4 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"
              ></div>

              <div class="space-y-12">
                <div class="relative flex items-start group">
                  <div
                    class="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold px-5 py-3 rounded-2xl z-10 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  >
                    2015
                  </div>
                  <div
                    class="ml-6 md:ml-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex-1 group-hover:shadow-xl transition-all duration-300"
                  >
                    <div class="flex items-start">
                      <div
                        class="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4"
                      >
                        <span class="text-xl">🚀</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900 mb-2 text-xl">
                          당근마켓 서비스 시작
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                          판교 지역 중고거래 앱으로 첫 발을 내딛었습니다. 이웃
                          간의 신뢰를 바탕으로 한 새로운 거래 경험의
                          시작이었습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="relative flex items-start group">
                  <div
                    class="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-5 py-3 rounded-2xl z-10 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  >
                    2018
                  </div>
                  <div
                    class="ml-6 md:ml-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex-1 group-hover:shadow-xl transition-all duration-300"
                  >
                    <div class="flex items-start">
                      <div
                        class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4"
                      >
                        <span class="text-xl">🗺️</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900 mb-2 text-xl">
                          전국 서비스 확대
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                          대한민국 전 지역으로 서비스를 확장하며, 전국의
                          이웃들이 당근마켓을 통해 소통할 수 있게 되었습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="relative flex items-start group">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-5 py-3 rounded-2xl z-10 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  >
                    2020
                  </div>
                  <div
                    class="ml-6 md:ml-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex-1 group-hover:shadow-xl transition-all duration-300"
                  >
                    <div class="flex items-start">
                      <div
                        class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4"
                      >
                        <span class="text-xl">💬</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900 mb-2 text-xl">
                          동네생활 서비스 출시
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                          단순한 중고거래를 넘어 이웃과의 일상 소통이 가능한
                          동네생활 플랫폼으로 발전했습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="relative flex items-start group">
                  <div
                    class="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold px-5 py-3 rounded-2xl z-10 shadow-lg group-hover:scale-105 transition-transform duration-300"
                  >
                    2023
                  </div>
                  <div
                    class="ml-6 md:ml-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex-1 group-hover:shadow-xl transition-all duration-300"
                  >
                    <div class="flex items-start">
                      <div
                        class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4"
                      >
                        <span class="text-xl">🏆</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900 mb-2 text-xl">
                          월 활성 사용자 2,000만 명 돌파
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                          대한민국 대표 동네 플랫폼으로 성장하여 전국민이
                          사랑하는 서비스가 되었습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 핵심 가치 -->
        <section class="mb-20">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">핵심 가치</h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              당근마켓이 추구하는 세 가지 핵심 가치로 더 나은 동네를
              만들어갑니다
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div
              class="group bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
              <div class="relative z-10">
                <div
                  class="w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                >
                  <span class="text-4xl">🥕</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-6 text-2xl">신뢰</h3>
                <p class="text-gray-600 leading-relaxed text-lg mb-6">
                  이웃 간의 믿음을 바탕으로 안전하고 투명한 거래환경을 만듭니다.
                </p>
                <div
                  class="flex items-center justify-center space-x-2 text-sm text-gray-500"
                >
                  <span>✓ 본인인증</span>
                  <span>•</span>
                  <span>✓ 거래후기</span>
                  <span>•</span>
                  <span>✓ 매너온도</span>
                </div>
              </div>
            </div>

            <div
              class="group bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
              <div class="relative z-10">
                <div
                  class="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                >
                  <span class="text-4xl">🏠</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-6 text-2xl">지역성</h3>
                <p class="text-gray-600 leading-relaxed text-lg mb-6">
                  우리 동네 중심의 서비스로 지역 공동체를 더욱 강화합니다.
                </p>
                <div
                  class="flex items-center justify-center space-x-2 text-sm text-gray-500"
                >
                  <span>✓ 동네인증</span>
                  <span>•</span>
                  <span>✓ 근거리 거래</span>
                  <span>•</span>
                  <span>✓ 동네모임</span>
                </div>
              </div>
            </div>

            <div
              class="group bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
              <div class="relative z-10">
                <div
                  class="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                >
                  <span class="text-4xl">♻️</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-6 text-2xl">
                  지속가능성
                </h3>
                <p class="text-gray-600 leading-relaxed text-lg mb-6">
                  중고거래를 통해 환경을 생각하는 순환 경제를 실현합니다.
                </p>
                <div
                  class="flex items-center justify-center space-x-2 text-sm text-gray-500"
                >
                  <span>✓ 재사용</span>
                  <span>•</span>
                  <span>✓ 탄소절약</span>
                  <span>•</span>
                  <span>✓ 친환경</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="pb-20">
          <div
            class="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-black bg-opacity-10"></div>
            <div class="relative z-10">
              <div class="mb-8">
                <span class="text-6xl">🥕</span>
              </div>
              <h2 class="text-4xl font-bold mb-6">
                함께 만들어가는 따뜻한 동네
              </h2>
              <p
                class="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                당근마켓과 함께 지속가능한 미래를 만들어보세요. 우리 동네에서
                시작되는 작은 변화가 더 큰 가치를 만들어냅니다.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link
                  to="/"
                  class="inline-block bg-white text-orange-500 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  서비스 이용하기
                </router-link>
                <router-link
                  to="/contact"
                  class="inline-block bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  문의하기
                </router-link>
              </div>
            </div>
          </div>
        </section>
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
  name: "AboutCompany",
  components: {
    TheHeader,
    TheFooter,
  },
};
</script>
