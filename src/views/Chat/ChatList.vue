<template>
  <div class="flex flex-col h-screen bg-white">
    <!-- 헤더 -->
    <MarketHeader
      :isLoggedIn="isAuthenticated"
      :showSearchButton="false"
      :showShareButton="false"
    />

    <!-- 로그인된 사용자만 채팅 목록 표시 -->
    <div v-if="isAuthenticated">
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
            class="flex items-center px-4 py-3 hover:bg-gray-50 group"
          >
            <!-- 채팅방 내용 클릭 영역 -->
            <div
              @click="enterRoom(room)"
              class="flex items-center flex-1 cursor-pointer"
            >
              <div
                class="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center"
              >
                <span class="text-xs text-gray-600">💬</span>
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <span class="font-medium">{{
                      room.name || `채팅방 ${room.roomId}`
                    }}</span>
                    <span class="text-sm text-gray-500 ml-2"
                      >· {{ formatTimeAgo(room.lastMessageTime) }}</span
                    >
                  </div>
                </div>
                <div class="mt-1">
                  <p class="text-gray-600 text-sm line-clamp-1">
                    {{ room.lastMessage || "메시지가 없습니다." }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ room.itemTitle }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 삭제 버튼 -->
            <button
              @click.stop="confirmDeleteRoom(room)"
              class="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              title="채팅방 삭제"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
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

    <!-- 삭제 확인 모달 -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div class="bg-white rounded-lg p-6 mx-4 max-w-sm w-full" @click.stop>
        <h3 class="text-lg font-semibold mb-4">채팅방 삭제</h3>
        <p class="text-gray-600 mb-6">
          정말로 이 채팅방을 삭제하시겠습니까?<br />
          <span class="text-sm text-red-500"
            >삭제된 채팅방과 메시지는 복구할 수 없습니다.</span
          >
        </p>
        <div class="flex space-x-3">
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button
            @click="executeDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {{ deleting ? "삭제 중..." : "삭제" }}
          </button>
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
import MarketHeader from "@/components/layout/MarketHeader.vue";
import { timeUtilsMixin } from "@/utils/timeUtils";

export default {
  name: "ChatList",
  mixins: [timeUtilsMixin],
  components: {
    BottomNavigation,
    MarketHeader,
  },
  data() {
    return {
      itemId: null,
      showDeleteModal: false,
      roomToDelete: null,
      deleting: false,
    };
  },
  computed: {
    ...mapState("chat", ["rooms", "currentRoom", "loading", "error"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    currentUserId() {
      return this.currentUser?.userId || null;
    },

    filteredRooms() {
      if (!this.itemId) return this.rooms;
      return this.rooms.filter((room) => room.itemId === parseInt(this.itemId));
    },
  },
  methods: {
    ...mapActions("chat", ["fetchUserRooms", "deleteChatRoom"]),

    // 로그인 체크
    checkAuthAndRedirect() {
      if (!this.isAuthenticated) {
        alert("로그인이 필요한 서비스입니다.");
        this.$router.push("/login");
        return false;
      }
      return true;
    },

    // 삭제 확인 다이얼로그 표시
    confirmDeleteRoom(room) {
      this.roomToDelete = room;
      this.showDeleteModal = true;
    },

    // 삭제 취소
    cancelDelete() {
      this.showDeleteModal = false;
      this.roomToDelete = null;
      this.deleting = false;
    },

    // 실제 삭제 실행
    async executeDelete() {
      if (!this.roomToDelete) return;

      this.deleting = true;

      try {
        await this.deleteChatRoom(this.roomToDelete.roomId);
        alert("채팅방이 삭제되었습니다.");
        this.cancelDelete();
      } catch (error) {
        console.error("채팅방 삭제 실패:", error);
        alert("채팅방 삭제에 실패했습니다. 다시 시도해주세요.");
        this.deleting = false;
      }
    },

    async loadRooms() {
      if (!this.checkAuthAndRedirect()) return;

      this.itemId = this.$route.query.itemId || null;

      try {
        await this.fetchUserRooms(this.currentUserId);
      } catch (error) {
        console.error("Error loading rooms:", error);
      }
    },

    enterRoom(room) {
      if (!this.checkAuthAndRedirect()) return;

      this.$router.push({
        name: "ChatRoom",
        params: {
          roomId: room.roomId.toString(),
        },
        query: {
          itemId: room.itemId,
        },
      });
    },
  },

  async created() {
    await this.$nextTick();

    if (this.isAuthenticated) {
      await this.loadRooms();
    } else {
      this.checkAuthAndRedirect();
    }
  },

  watch: {
    "$route.query.itemId": function () {
      if (this.isAuthenticated) {
        this.loadRooms();
      }
    },

    isAuthenticated(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.loadRooms();
      } else if (!newVal && oldVal) {
        this.checkAuthAndRedirect();
      }
    },

    currentUserId(newVal, oldVal) {
      if (newVal !== oldVal && this.isAuthenticated) {
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
