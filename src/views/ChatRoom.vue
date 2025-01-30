<template>
  <div class="chat-room">
    <div class="chat-header">
      <h2>채팅방 {{ roomId }}</h2>
      <button @click="goBack" class="back-btn">뒤로가기</button>
    </div>

    <div class="chat-messages" ref="messageContainer">
      <div
        v-for="message in messages"
        :key="message.id || message.timestamp"
        :class="['message', message.senderId === userId ? 'sent' : 'received']"
      >
        <div class="message-content">
          <span class="sender">{{
            message.senderId === userId ? "나" : "너"
          }}</span>
          <p class="text">{{ message.content }}</p>
          <span class="time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
        type="text"
      />
      <button @click="sendMessage" :disabled="!isConnected">전송</button>
    </div>

    <div class="connection-status" :class="connectionStatusClass">
      연결 상태: {{ connectionStatus }}
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
      };

      try {
        // 메시지를 로컬 messages 배열에 먼저 추가
        this.messages.push(message);

        // 서버로 메시지 전송
        await this.stompClient.publish({
          destination: `/app/chat/${this.roomId}`,
          body: JSON.stringify(message),
          headers: { "content-type": "application/json" },
        });

        // 입력창 초기화
        this.newMessage = "";

        // 스크롤을 최하단으로
        this.scrollToBottom();
      } catch (error) {
        console.error("[STOMP] 메시지 전송 실패:", error);
        // 전송 실패시 마지막 메시지 제거
        this.messages.pop();
      }
    },

    sendSystemMessage(type) {
      if (!this.isConnected) return;

      const message = {
        type,
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
        this.messages = response.data;
        this.scrollToBottom();
      } catch (error) {
        console.error("채팅 히스토리 로딩 실패:", error);
      }
    },
  },

  created() {
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

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background: #f5f5f5;
}

.chat-header {
  padding: 1rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.5rem;
  border-radius: 8px;
  margin: 0.5rem 0;
}

.sent {
  align-self: flex-end;
  background: #007aff;
  color: white;
}

.received {
  align-self: flex-start;
  background: white;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sender {
  font-size: 0.8rem;
  opacity: 0.7;
}

.text {
  margin: 0;
  word-break: break-word;
}

.time {
  font-size: 0.7rem;
  opacity: 0.7;
  align-self: flex-end;
}

.chat-input {
  padding: 1rem;
  background: white;
  display: flex;
  gap: 1rem;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.chat-input button {
  padding: 0.5rem 1rem;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:hover {
  background: #0056b3;
}

.connection-status {
  padding: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}
.status-connected {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}

.status-connecting {
  color: #ffc107;
}

.chat-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
