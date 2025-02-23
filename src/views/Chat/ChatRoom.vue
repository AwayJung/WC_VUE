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

    <!-- 채팅 메시지 영역 -->
    <div class="flex-1 overflow-y-auto bg-gray-50" ref="messageContainer">
      <div
        v-for="message in messages"
        :key="message.id || message.timestamp"
        class="px-4 py-1"
      >
        <div
          :class="[
            'flex',
            message.senderId === userId ? 'justify-end' : 'justify-start',
          ]"
        >
          <div
            :class="[
              'max-w-[70%] rounded-3xl px-4 py-2.5',
              message.senderId === userId
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
            message.senderId === userId ? 'text-right mr-1' : 'text-left ml-1',
          ]"
        >
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- 메시지 입력 영역 -->
    <div class="border-t bg-white px-2 py-2 flex items-center gap-2">
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

export default {
  name: "ChatRoom",
  props: {
    roomId: {
      type: [String, Number],
      required: true,
    },
    userId: {
      type: [String, Number],
      required: true,
    },
    itemId: {
      type: Number,
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
      console.log("[WebSocket] 초기화 시작");

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
        },
      });

      this.setupStompHandlers();
      this.connectStomp();
    },
    setupStompHandlers() {
      this.stompClient.onConnect = (frame) => {
        console.log("[STOMP] 연결 성공:", frame);
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
    },

    subscribeToChatRoom() {
      this.stompClient.subscribe(
        `/topic/chat/${this.roomId}`,
        this.handleIncomingMessage,
        { id: `chat-sub-${this.roomId}` }
      );
    },

    handleIncomingMessage(message) {
      try {
        const receivedMessage = JSON.parse(message.body);

        // 자신이 보낸 메시지는 이미 messages 배열에 추가되어 있으므로 건너뜀
        if (receivedMessage.senderId !== this.userId) {
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
        setTimeout(() => this.initWebSocket(), 5000);
      }
    },

    handleDisconnection() {
      this.isConnected = false;
      this.connectionStatus = "disconnected";
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
      if (!this.newMessage.trim() || !this.isConnected) return;

      const message = {
        type: "TALK",
        roomId: this.roomId,
        senderId: this.userId,
        content: this.newMessage,
        timestamp: new Date().toISOString(),
        itemId: this.itemId,
      };

      try {
        // 메시지를 로컬 messages 배열에 먼저 추가
        this.messages.push(message);

        // headers 객체를 생성하고, itemId가 있을 경우에만 추가
        const headers = {
          "content-type": "application/json",
          itemId: this.itemId?.toString() || this.$route.query.itemId,
        };

        console.log("전송할 메시지:", message);
        console.log("전송 헤더:", headers);
        console.log("현재 메시지 수:", this.messages.length);
        console.log("itemId prop:", this.itemId);

        // 메시지가 첫 메시지인 경우 itemId를 헤더에 추가

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
        this.messages.pop();
      }
    },

    sendSystemMessage(type) {
      if (!this.isConnected) return;

      const message = {
        type: type,
        roomId: this.roomId,
        senderId: this.userId,
        timestamp: new Date().toISOString(),
      };

      this.stompClient.publish({
        destination: `/app/chat/${this.roomId}`,
        body: JSON.stringify(message),
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
      try {
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
          this.scrollToBottom();
        } else {
          // 채팅 기록이 없는 경우 빈 배열로 초기화
          this.messages = [];
        }
      } catch (error) {
        console.error("채팅 히스토리 로딩 실패:", error);
        // 에러 발생시에도 빈 배열로 초기화
        this.messages = [];
      }
    },
  },

  created() {
    console.log("컴포넌트 생성 - itemId:", this.itemId);
    console.log("컴포넌트 생성 - roomId:", this.roomId);
    console.log("컴포넌트 생성 - userId:", this.userId);
    this.loadChatHistory();
    this.initWebSocket();
  },

  beforeDestroy() {
    if (this.stompClient) {
      this.sendSystemMessage("LEAVE");
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
  },
};
</script>
