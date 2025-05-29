<template>
  <div class="flex flex-col h-screen bg-white">
    <!-- 헤더 -->
    <div class="bg-white px-4 py-3 flex items-center border-b">
      <button @click="goBack" class="text-gray-800 -ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 class="ml-2 text-lg">채팅방</h2>
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

    <!-- 채팅 메시지 영역 -->
    <div
      v-else
      class="flex-1 overflow-y-auto bg-gray-50"
      ref="messageContainer"
    >
      <div
        v-for="message in messages"
        :key="message.id || message.timestamp"
        class="px-4 py-1"
      >
        <div
          :class="[
            'flex',
            message.senderId === currentUserId
              ? 'justify-end'
              : 'justify-start',
          ]"
        >
          <div
            :class="[
              'max-w-[70%] rounded-3xl px-4 py-2.5',
              message.senderId === currentUserId
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-900',
            ]"
          >
            <p class="text-sm leading-5">{{ message.content }}</p>
          </div>
        </div>
        <div
          :class="[
            'text-xs text-gray-400 mt-1',
            message.senderId === currentUserId
              ? 'text-right mr-1'
              : 'text-left ml-1',
          ]"
        >
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- 메시지 입력 영역 -->
    <div
      v-if="isAuthenticated"
      class="border-t bg-white px-2 py-2 flex items-center gap-2"
    >
      <button class="w-10 h-10 flex items-center justify-center text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="메시지를 입력하세요..."
        class="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm focus:outline-none border border-gray-200"
      />
      <button
        @click="sendMessage"
        :disabled="!isConnected"
        class="w-10 h-10 flex items-center justify-center text-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M20 12L4 4L6 12L4 20L20 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { mapGetters } from "vuex";

export default {
  name: "ChatRoom",
  props: {
    roomId: {
      type: [String, Number],
      required: true,
    },
    itemId: {
      type: [String, Number],
      required: false,
    },
  },

  data() {
    return {
      messages: [],
      newMessage: "",
      stompClient: null,
      isConnected: false,
      connectionStatus: "disconnected",
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
    };
  },

  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    // 현재 사용자 ID
    currentUserId() {
      return this.currentUser?.userId || null;
    },

    connectionStatusClass() {
      return {
        "status-connected": this.connectionStatus === "connected",
        "status-error": this.connectionStatus === "error",
        "status-connecting": this.connectionStatus === "connecting",
      };
    },
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    initWebSocket() {
      // 로그인되지 않은 경우 WebSocket 연결하지 않음
      if (!this.isAuthenticated) {
        console.log("[WebSocket] 로그인되지 않아 연결하지 않음");
        return;
      }

      console.log("[WebSocket] 초기화 시작");
      console.log("[WebSocket] 사용자 ID:", this.currentUserId);

      if (this.stompClient) {
        console.log("[WebSocket] 기존 연결 해제");
        this.stompClient.deactivate();
      }

      const socket = new SockJS("http://localhost:8080/ws", null, {
        transports: ["websocket"],
        serverPath: "/ws",
      });

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("[STOMP]", str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          host: "localhost:8080",
          userId: this.currentUserId?.toString(), // 실제 사용자 ID 추가
        },
      });

      this.setupStompHandlers();
      this.connectStomp();
    },

    setupStompHandlers() {
      this.stompClient.onConnect = (frame) => {
        console.log("[STOMP] 연결 성공:", frame);
        console.log("[STOMP] 사용자 ID:", this.currentUserId);
        this.isConnected = true;
        this.connectionStatus = "connected";
        this.reconnectAttempts = 0;

        this.subscribeToChatRoom();
        this.sendSystemMessage("JOIN");
      };

      this.stompClient.onStompError = (frame) => {
        console.error("[STOMP] 프로토콜 에러:", frame);
        this.handleError();
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error("[STOMP] WebSocket 에러:", error);
        this.handleError();
      };

      this.stompClient.onDisconnect = () => {
        console.log("[STOMP] 연결 해제됨");
        this.handleDisconnection();
      };
    },

    subscribeToChatRoom() {
      const subscription = this.stompClient.subscribe(
        `/topic/chat/${this.roomId}`,
        this.handleIncomingMessage,
        {
          id: `chat-sub-${this.roomId}`,
          userId: this.currentUserId?.toString(),
        }
      );

      console.log("[STOMP] 채팅방 구독 완료:", `/topic/chat/${this.roomId}`);
      return subscription;
    },

    handleIncomingMessage(message) {
      try {
        const receivedMessage = JSON.parse(message.body);
        console.log("[STOMP] 메시지 수신:", receivedMessage);

        // 자신이 보낸 메시지는 이미 messages 배열에 추가되어 있으므로 건너뜀
        if (receivedMessage.senderId !== this.currentUserId) {
          this.messages.push(receivedMessage);
          this.scrollToBottom();
        }
      } catch (error) {
        console.error("[STOMP] 메시지 파싱 에러:", error);
      }
    },

    handleError() {
      this.connectionStatus = "error";
      this.isConnected = false;

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `[WebSocket] 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
        );
        setTimeout(() => this.initWebSocket(), 5000);
      } else {
        console.error("[WebSocket] 최대 재연결 시도 횟수 초과");
      }
    },

    handleDisconnection() {
      this.isConnected = false;
      this.connectionStatus = "disconnected";
      console.log("[STOMP] 연결 상태 변경: disconnected");
    },

    connectStomp() {
      try {
        this.connectionStatus = "connecting";
        this.stompClient.activate();
      } catch (error) {
        console.error("[STOMP] 활성화 에러:", error);
        this.handleError();
      }
    },

    async sendMessage() {
      if (
        !this.newMessage.trim() ||
        !this.isConnected ||
        !this.isAuthenticated
      ) {
        console.log("[메시지 전송] 조건 불충족:", {
          hasMessage: !!this.newMessage.trim(),
          isConnected: this.isConnected,
          isAuthenticated: this.isAuthenticated,
        });
        return;
      }

      const message = {
        type: "TALK",
        roomId: this.roomId,
        senderId: this.currentUserId, // 실제 사용자 ID 사용
        content: this.newMessage,
        timestamp: new Date().toISOString(),
        itemId: this.itemId,
      };

      try {
        // 메시지를 로컬 messages 배열에 먼저 추가
        this.messages.push({
          ...message,
          senderId: this.currentUserId, // 로컬 표시용 senderId 추가
        });

        // headers 객체를 생성하고, itemId가 있을 경우에만 추가
        const headers = {
          "content-type": "application/json",
          userId: this.currentUserId?.toString(),
          itemId: this.itemId?.toString() || this.$route.query.itemId,
        };

        console.log("전송할 메시지:", message);
        console.log("전송 헤더:", headers);
        console.log("현재 메시지 수:", this.messages.length);
        console.log("itemId prop:", this.itemId);
        console.log("사용자 ID:", this.currentUserId);

        await this.stompClient.publish({
          destination: `/app/chat/${this.roomId}`,
          body: JSON.stringify(message),
          headers: headers,
        });

        // 전송 성공 로그
        console.log("메시지 전송 성공");

        this.newMessage = "";
        this.scrollToBottom();
      } catch (error) {
        console.error("[STOMP] 메시지 전송 실패:", error);
        console.error("실패한 메시지:", message);
        // 전송 실패시 로컬에 추가한 메시지 제거
        this.messages.pop();
        alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      }
    },

    sendSystemMessage(type) {
      if (!this.isConnected || !this.isAuthenticated) {
        console.log("[시스템 메시지] 전송 조건 불충족");
        return;
      }

      const message = {
        type: type,
        roomId: this.roomId,
        senderId: this.currentUserId, // 실제 사용자 ID 사용
        timestamp: new Date().toISOString(),
      };

      console.log(`[시스템 메시지] ${type} 전송:`, message);

      this.stompClient.publish({
        destination: `/app/chat/${this.roomId}`,
        body: JSON.stringify(message),
        headers: {
          userId: this.currentUserId?.toString(),
        },
      });
    },

    formatTime(timestamp) {
      if (!timestamp) return "";
      try {
        return new Date(timestamp).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } catch (error) {
        console.error("시간 포맷 에러:", error);
        return "";
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    async loadChatHistory() {
      if (!this.isAuthenticated) {
        console.log("[채팅 히스토리] 로그인되지 않아 로드하지 않음");
        this.messages = [];
        return;
      }

      try {
        console.log("[채팅 히스토리] 로드 시작:", {
          roomId: this.roomId,
          userId: this.currentUserId,
        });

        const response = await this.$store.dispatch(
          "chat/fetchMessages",
          this.roomId
        );

        // 채팅 기록이 있고, 데이터가 배열이며, 내용이 있는 경우에만 메시지를 표시
        if (
          response &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.messages = response.data;
          console.log(
            "[채팅 히스토리] 로드 완료:",
            this.messages.length + "개"
          );
          this.scrollToBottom();
        } else {
          // 채팅 기록이 없는 경우 빈 배열로 초기화
          this.messages = [];
          console.log("[채팅 히스토리] 기록 없음");
        }
      } catch (error) {
        console.error("채팅 히스토리 로딩 실패:", error);
        // 에러 발생시에도 빈 배열로 초기화
        this.messages = [];
      }
    },
  },

  async created() {
    console.log("=== ChatRoom 컴포넌트 생성 ===");
    console.log("itemId:", this.itemId);
    console.log("roomId:", this.roomId);
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);
    console.log("사용자 ID:", this.currentUserId);
    console.log("===============================");

    // 로그인된 사용자만 채팅 기능 초기화
    if (this.isAuthenticated) {
      await this.loadChatHistory();
      this.initWebSocket();
    } else {
      console.log("로그인되지 않은 사용자 - 채팅 기능 비활성화");
    }
  },

  mounted() {
    // 마운트 후 로그인 정보 재확인
    console.log("=== ChatRoom 마운트 완료 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("사용자 ID:", this.currentUserId);
    console.log("연결 상태:", this.connectionStatus);
    console.log("===========================");
  },

  beforeDestroy() {
    console.log("[컴포넌트] 소멸 시작");
    if (this.stompClient && this.isConnected && this.isAuthenticated) {
      this.sendSystemMessage("LEAVE");
      setTimeout(() => {
        this.stompClient.deactivate();
      }, 100); // 시스템 메시지 전송 후 연결 해제
    } else if (this.stompClient) {
      this.stompClient.deactivate();
    }
  },

  watch: {
    messages: {
      deep: true,
      handler() {
        this.scrollToBottom();
      },
    },

    // 로그인 상태 변경 감지
    isAuthenticated(newVal, oldVal) {
      console.log("[Auth 상태 변경]", { from: oldVal, to: newVal });

      if (newVal && !oldVal) {
        // 로그인됨 - 채팅 기능 활성화
        console.log("로그인됨 - 채팅 기능 활성화");
        this.loadChatHistory();
        this.initWebSocket();
      } else if (!newVal && oldVal) {
        // 로그아웃됨 - 채팅 기능 비활성화
        console.log("로그아웃됨 - 채팅 기능 비활성화");
        if (this.stompClient) {
          this.stompClient.deactivate();
        }
        this.messages = [];
        this.isConnected = false;
      }
    },

    // 사용자 ID 변경 감지 (사용자 계정 변경)
    currentUserId(newVal, oldVal) {
      if (newVal !== oldVal && this.isAuthenticated) {
        console.log("[사용자 변경]", { from: oldVal, to: newVal });
        // 기존 연결 해제 후 새로운 사용자로 재연결
        if (this.stompClient) {
          this.stompClient.deactivate();
        }
        this.loadChatHistory();
        this.initWebSocket();
      }
    },
  },
};
</script>

<style scoped>
.status-connected {
  color: green;
}

.status-error {
  color: red;
}

.status-connecting {
  color: orange;
}
</style>
