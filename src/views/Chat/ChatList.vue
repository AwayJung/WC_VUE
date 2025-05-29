<template>
  <div class="flex flex-col h-screen bg-white">
    <!-- 헤더 -->
    <div class="px-4 py-3 flex items-center justify-between border-b">
      <h1 class="text-xl font-bold">채팅</h1>
      <div class="flex items-center space-x-4">
        <button class="p-2">
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
        <button class="p-2">
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
        <button class="p-2">
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 로그인 필요 메시지 -->
    <div
      v-if="!isAuthenticated"
      class="flex justify-center items-center h-full"
    >
      <div class="text-center">
        <p class="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <button
          @click="$router.push('/login')"
          class="px-4 py-2 bg-orange-500 text-white rounded"
        >
          로그인하기
        </button>
      </div>
    </div>

    <div v-else>
      <!-- 필터 버튼들 -->
      <div class="flex gap-2 p-4 overflow-x-auto">
        <button class="px-4 py-2 bg-gray-900 text-white rounded-full text-sm">
          전체
        </button>
        <button
          class="px-4 py-2 bg-white border rounded-full text-sm whitespace-nowrap"
        >
          안 읽은 채팅방
        </button>
      </div>

      <!-- 아이템 필터 표시 (itemId가 있는 경우) -->
      <div v-if="itemId" class="px-4 py-2 flex items-center bg-gray-100">
        <span class="text-sm font-medium">특정 상품의 채팅방만 표시 중</span>
        <button @click="clearItemFilter" class="ml-2 text-blue-500 text-sm">
          모든 채팅방 보기
        </button>
      </div>

      <!-- 채팅방 목록 -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="flex justify-center items-center h-full">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
          ></div>
          <span class="ml-2">로딩 중...</span>
        </div>
        <div
          v-else-if="error"
          class="flex justify-center items-center h-full text-red-500"
        >
          {{ error }}
        </div>
        <div v-else-if="filteredRooms.length" class="divide-y">
          <div
            v-for="room in filteredRooms"
            :key="room.roomId"
            @click="enterRoom(room)"
            class="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
          >
            <div class="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div class="ml-3 flex-1">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-medium">{{
                    room.name || `채팅방 ${room.roomId}`
                  }}</span>
                  <span class="text-sm text-gray-500 ml-2">· 3일 전</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mt-1">마지막 메시지 내용...</p>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center h-full text-gray-500"
        >
          채팅방이 없습니다.
        </div>
      </div>
    </div>

    <!-- 하단 네비게이션 컴포넌트 -->
    <BottomNavigation activePage="chat" :userId="currentUserId" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import BottomNavigation from "@/components/layout/BottomNavigation.vue";

export default {
  name: "ChatList",
  components: {
    BottomNavigation,
  },
  data() {
    return {
      itemId: null,
    };
  },
  computed: {
    ...mapState("chat", ["rooms", "currentRoom", "loading", "error"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    // 현재 사용자 ID
    currentUserId() {
      return this.currentUser?.userId || null;
    },

    filteredRooms() {
      if (!this.itemId) return this.rooms;
      return this.rooms.filter((room) => room.itemId === parseInt(this.itemId));
    },
  },
  methods: {
    ...mapActions("chat", ["fetchUserRooms"]),

    async loadRooms() {
      // 로그인 체크
      if (!this.isAuthenticated) {
        console.log("로그인되지 않은 사용자 - 채팅방 목록 로드 중단");
        return;
      }

      this.itemId = this.$route.query.itemId || null;

      console.log(
        "Loading rooms for userId:",
        this.currentUserId,
        "itemId:",
        this.itemId
      );

      try {
        await this.fetchUserRooms(this.currentUserId);
        console.log("Loaded rooms (all):", this.rooms);

        if (this.itemId) {
          console.log(
            "Filtering for itemId:",
            this.itemId,
            "Type:",
            typeof this.itemId
          );
          console.log("Filtered rooms:", this.filteredRooms);
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
      }
    },

    enterRoom(room) {
      console.log("Entering room:", room);

      // 로그인 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      this.$router.push({
        name: "ChatRoom",
        params: {
          roomId: room.roomId.toString(),
        },
        query: {
          itemId: room.data?.itemId,
        },
      });
    },

    clearItemFilter() {
      this.itemId = null;
      this.$router.replace({
        name: "ChatRoomList",
        // userId 파라미터 제거 - Vuex에서 관리
      });
    },
  },

  async created() {
    console.log("=== ChatList 컴포넌트 생성 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);
    console.log("사용자 ID:", this.currentUserId);
    console.log("라우트:", this.$route);
    console.log("=============================");

    await this.loadRooms();
  },

  mounted() {
    // 마운트 후 로그인 정보 재확인
    console.log("=== ChatList 마운트 완료 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("사용자 ID:", this.currentUserId);
    console.log("채팅방 수:", this.rooms?.length || 0);
    console.log("===========================");
  },

  watch: {
    // URL 쿼리 파라미터가 변경될 때 데이터 다시 로드
    "$route.query.itemId": function () {
      this.loadRooms();
    },

    // 로그인 상태 변경 감지
    isAuthenticated(newVal, oldVal) {
      console.log("[Auth 상태 변경]", { from: oldVal, to: newVal });

      if (newVal && !oldVal) {
        // 로그인됨 - 채팅방 목록 로드
        console.log("로그인됨 - 채팅방 목록 로드");
        this.loadRooms();
      } else if (!newVal && oldVal) {
        // 로그아웃됨 - 데이터 초기화
        console.log("로그아웃됨 - 채팅방 목록 초기화");
        // Vuex store에서 채팅방 목록 초기화하는 액션이 있다면 호출
        // this.$store.commit('chat/CLEAR_ROOMS');
      }
    },

    currentUserId(newVal, oldVal) {
      if (newVal !== oldVal && this.isAuthenticated) {
        console.log("[사용자 변경]", { from: oldVal, to: newVal });
        this.loadRooms();
      }
    },
  },
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
