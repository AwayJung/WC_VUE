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

    <!-- 탭 메뉴 -->
    <div class="flex border-b">
      <button
        class="flex-1 px-4 py-3 font-medium border-b-2 border-black text-black"
      >
        일반
      </button>
      <button class="flex-1 px-4 py-3 font-medium text-gray-400">
        비즈니스
      </button>
    </div>

    <!-- 필터 버튼들 -->
    <div class="flex gap-2 p-4 overflow-x-auto">
      <button class="px-4 py-2 bg-gray-900 text-white rounded-full text-sm">
        전체
      </button>
      <button class="px-4 py-2 bg-white border rounded-full text-sm">
        판매
      </button>
      <button class="px-4 py-2 bg-white border rounded-full text-sm">
        구매
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

    <!-- 하단 네비게이션 -->
    <div class="flex justify-around py-3 border-t bg-white">
      <button class="flex flex-col items-center text-xs text-gray-500">
        <svg
          class="w-6 h-6 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        홈
      </button>
      <button class="flex flex-col items-center text-xs text-gray-500">
        <svg
          class="w-6 h-6 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        동네생활
      </button>
      <button class="flex flex-col items-center text-xs text-gray-500">
        <svg
          class="w-6 h-6 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        내 근처
      </button>
      <button class="flex flex-col items-center text-xs text-gray-900">
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
          />
        </svg>
        채팅
      </button>
      <button class="flex flex-col items-center text-xs text-gray-500">
        <svg
          class="w-6 h-6 mb-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        나의 당근
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ChatList",
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
      console.log("Route query params:", this.$route.query);
      console.log("Route params:", this.$route.params);
      console.log("Full route object:", this.$route);

      try {
        await this.fetchUserRooms(userId);
        console.log("Loaded rooms (all):", this.rooms);
        console.log(
          "Room structures:",
          this.rooms.map((room) => ({
            roomId: room.roomId,
            itemId: room.itemId,
          }))
        );

        if (this.itemId) {
          console.log(
            "Filtering for itemId:",
            this.itemId,
            "Type:",
            typeof this.itemId
          );
          console.log("Filtered rooms:", this.filteredRooms);

          // 데이터 타입 불일치 확인
          const parsedItemId = parseInt(this.itemId);
          console.log(
            "Parsed itemId:",
            parsedItemId,
            "Type:",
            typeof parsedItemId
          );

          // 각 room의 itemId 확인
          this.rooms.forEach((room) => {
            console.log(
              `Room ${room.roomId} itemId:`,
              room.itemId,
              "Type:",
              typeof room.itemId,
              "Match?",
              room.itemId === parsedItemId
            );
          });
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
    console.log("ChatList query params:", this.$route.query);
    console.log("itemId from query:", this.$route.query.itemId);
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
