<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">나의 당근</h1>
          <button
            @click="showProfileEdit = true"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            프로필 수정
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 프로필 상단 카드 -->
      <div class="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img
              :src="profileImage"
              :alt="currentUser?.nickname || '프로필'"
              class="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
            />
            <div
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"
            ></div>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ currentUser?.nickname || currentUser?.name || "사용자" }}
            </h2>
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">가입일 {{ formatJoinDate() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 통계 카드들 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div
            class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
              />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div class="text-sm text-gray-500">판매 상품</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div
            class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div class="text-sm text-gray-500">관심 목록</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div class="text-sm text-gray-500">채팅방</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div
            class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"
          >
            <svg
              class="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div class="text-sm text-gray-500">거래 완료</div>
        </div>
      </div>

      <!-- 탭 콘텐츠 -->
      <div class="bg-white rounded-xl shadow-sm border">
        <!-- 탭 헤더 -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- 탭 내용 -->
        <div class="p-6">
          <!-- 판매내역 탭 -->
          <div v-if="activeTab === 'sales'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold text-gray-900">판매내역</h3>
              <div class="flex items-center space-x-3">
                <select
                  v-model="salesFilter"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">전체 보기</option>
                  <option value="selling">판매중</option>
                  <option value="reserved">예약중</option>
                  <option value="sold">판매완료</option>
                </select>
                <button
                  class="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                >
                  상품 등록
                </button>
              </div>
            </div>

            <!-- 빈 상태 -->
            <div class="text-center py-16">
              <svg
                class="w-24 h-24 text-gray-300 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">
                판매한 상품이 없습니다
              </h4>
              <p class="text-gray-500 mb-6">
                첫 상품을 등록하고 당근마켓을 시작해보세요!
              </p>
              <button
                @click="$router.push('/items/create')"
                class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                상품 등록하기
              </button>
            </div>

            <!-- 판매 상품 리스트 (데이터 있을 때) -->
            <!-- <div class="space-y-4">
                <div class="flex items-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer group">
                  <img
                    src="https://via.placeholder.com/120x120?text=상품이미지"
                    alt="상품명"
                    class="w-24 h-24 object-cover rounded-lg mr-6"
                  />
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      상품명
                    </h4>
                    <p class="text-gray-500 mb-2">지역 • 등록일</p>
                    <p class="text-xl font-bold text-orange-500">가격원</p>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3 bg-green-100 text-green-800">
                      판매중
                    </span>
                    <div class="text-sm text-gray-500 space-y-1">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        0
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        0
                      </div>
                    </div>
                  </div>
                </div>
              </div> -->
          </div>

          <!-- 관심목록 탭 -->
          <div v-if="activeTab === 'likes'" class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-900">관심목록</h3>

            <!-- 빈 상태 -->
            <div class="text-center py-16">
              <svg
                class="w-24 h-24 text-gray-300 mx-auto mb-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">
                관심 상품이 없습니다
              </h4>
              <p class="text-gray-500 mb-6">
                마음에 드는 상품에 하트를 눌러보세요!
              </p>
              <button
                @click="$router.push('/items')"
                class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                상품 둘러보기
              </button>
            </div>

            <!-- 관심 상품 그리드 (데이터 있을 때) -->
            <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div class="relative">
                    <img
                      src="https://via.placeholder.com/300x200?text=상품이미지"
                      alt="상품명"
                      class="w-full h-48 object-cover"
                    />
                    <button class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <div class="p-4">
                    <h4 class="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      상품명
                    </h4>
                    <p class="text-sm text-gray-500 mb-2">지역</p>
                    <p class="text-lg font-bold text-orange-500">가격원</p>
                  </div>
                </div>
              </div> -->
          </div>

          <!-- 고객지원 탭 -->
          <div v-if="activeTab === 'support'" class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-900">고객지원</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 자주 묻는 질문 -->
              <div class="space-y-4">
                <h4 class="text-lg font-medium text-gray-900">
                  자주 묻는 질문
                </h4>
                <div class="space-y-3">
                  <a
                    href="#"
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
                      <span class="font-medium group-hover:text-orange-600"
                        >안전한 거래 방법은?</span
                      >
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
                  <a
                    href="#"
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
                      <span class="font-medium group-hover:text-orange-600"
                        >계정 관련 문의</span
                      >
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
                  <a
                    href="#"
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
                      <span class="font-medium group-hover:text-orange-600"
                        >신고 및 차단</span
                      >
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
                  <a
                    href="#"
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
                          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                        />
                      </svg>
                      <span class="font-medium group-hover:text-orange-600"
                        >공지사항</span
                      >
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

                  <a
                    href="#"
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span class="font-medium group-hover:text-orange-600"
                        >약관 및 정책</span
                      >
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

                  <a
                    href="#"
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
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span class="font-medium group-hover:text-orange-600"
                        >1:1 문의하기</span
                      >
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

                  <div
                    class="p-4 bg-orange-50 rounded-lg border border-orange-200"
                  >
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
                        <div class="text-orange-700 font-semibold">
                          1588-7777
                        </div>
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
        </div>
      </div>
    </div>

    <!-- 프로필 수정 모달 -->
    <div
      v-if="showProfileEdit"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-xl font-semibold mb-6">프로필 수정</h3>
        <div class="space-y-6">
          <div class="text-center">
            <img
              :src="profileImage"
              alt="프로필"
              class="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-orange-100"
            />
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              ref="imageInput"
            />
            <button
              @click="$refs.imageInput.click()"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              사진 변경
            </button>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >닉네임</label
            >
            <input
              v-model="editForm.nickname"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >소개</label
            >
            <textarea
              v-model="editForm.bio"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="자신을 소개해주세요"
            ></textarea>
          </div>
        </div>
        <div class="flex space-x-3 mt-8">
          <button
            @click="showProfileEdit = false"
            class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
          >
            취소
          </button>
          <button
            @click="saveProfile"
            class="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MyPage",
  data() {
    return {
      activeTab: "sales",
      showProfileEdit: false,
      salesFilter: "all",

      tabs: [
        { id: "sales", name: "판매내역" },
        { id: "likes", name: "관심목록" },
        { id: "support", name: "고객지원" },
      ],

      editForm: {
        nickname: "",
        bio: "",
      },
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    profileImage() {
      return (
        this.currentUser?.profileImage ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
      );
    },
  },

  methods: {
    formatJoinDate() {
      // 실제로는 currentUser의 가입일 데이터를 사용
      return "2023년 3월";
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("이미지 업로드:", file.name);
        // 실제로는 서버에 업로드 처리
      }
    },

    saveProfile() {
      console.log("프로필 저장:", this.editForm);
      this.showProfileEdit = false;
      // 실제로는 API 호출하여 프로필 업데이트
      alert("프로필이 수정되었습니다.");
    },
  },

  created() {
    if (!this.isAuthenticated) {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    if (this.currentUser) {
      this.editForm = {
        nickname: this.currentUser.nickname || this.currentUser.name || "",
        bio: this.currentUser.bio || "",
      };
    }
  },
};
</script>
