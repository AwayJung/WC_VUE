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
      <div v-if="filteredRooms.length" class="divide-y">
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
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        채팅방이 없습니다.
      </div>
    </div>

    <!-- 하단 네비게이션 컴포넌트 -->
    <BottomNavigation
      activePage="chat"
      :userId="userId || $route.params.userId"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BottomNavigation from "@/components/layout/BottomNavigation.vue";

export default {
  name: "ChatList",
  components: {
    BottomNavigation,
  },
  props: {
    userId: {
      type: [String, Number],
      required: false,
    },
  },
  data() {
    return {
      itemId: null,
    };
  },
  computed: {
    ...mapState("chat", ["rooms", "currentRoom"]),
    filteredRooms() {
      if (!this.itemId) return this.rooms;
      return this.rooms.filter((room) => room.itemId === parseInt(this.itemId));
    },
  },
  methods: {
    ...mapActions("chat", ["fetchUserRooms"]),
    async loadRooms() {
      const userId = this.userId || this.$route.params.userId;
      this.itemId = this.$route.query.itemId || null;

      console.log("Loading rooms for userId:", userId, "itemId:", this.itemId);

      try {
        await this.fetchUserRooms(userId);
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

      this.$router.push({
        name: "ChatRoom",
        params: {
          roomId: room.roomId.toString(),
          userId: this.userId || this.$route.params.userId,
        },
        query: {
          itemId: room.data.itemId,
        },
      });
    },
    clearItemFilter() {
      this.itemId = null;
      this.$router.replace({
        name: "ChatRoomList",
        params: {
          userId: this.userId || this.$route.params.userId,
        },
      });
    },
  },
  created() {
    console.log("ChatList created, route:", this.$route);
    this.loadRooms();
  },
  watch: {
    // URL 쿼리 파라미터가 변경될 때 데이터 다시 로드
    "$route.query.itemId": function () {
      this.loadRooms();
    },
  },
};
</script>
