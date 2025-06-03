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

    <!-- 상품 정보 컴포넌트 -->
    <ChatItemInfo
      :item-id="itemId"
      :is-authenticated="isAuthenticated"
      @item-click="goToItemDetail"
    />

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

    <!-- 채팅 메시지 목록 컴포넌트 -->
    <ChatMessageList
      v-else
      :messages="messages"
      :current-user-id="currentUserId"
      @message-click="handleMessageClick"
      @message-options="handleMessageOptions"
      @message-reaction="handleMessageReaction"
      ref="messageList"
    />

    <!-- 메시지 입력 컴포넌트 -->
    <ChatInputArea
      :is-connected="isConnected"
      :is-authenticated="isAuthenticated"
      @send-message="sendMessage"
      @add-action="handleAddAction"
      ref="inputArea"
    />
  </div>
</template>

<script>
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { mapGetters } from "vuex";
import ChatItemInfo from "@/components/chat/ChatItemInfo.vue";
import ChatMessageList from "@/components/chat/ChatMessageList.vue";
import ChatInputArea from "@/components/chat/ChatInputArea.vue";

export default {
  name: "ChatRoom",

  components: {
    ChatItemInfo,
    ChatMessageList,
    ChatInputArea,
  },

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
          userId: this.currentUserId?.toString(),
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
          // MessageList 컴포넌트가 자동으로 스크롤 처리
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

    // ChatInputArea에서 메시지 전송 이벤트 받음
    async sendMessage(messageContent) {
      if (!messageContent || !this.isConnected || !this.isAuthenticated) {
        console.log("[메시지 전송] 조건 불충족:", {
          hasMessage: !!messageContent,
          isConnected: this.isConnected,
          isAuthenticated: this.isAuthenticated,
        });
        return;
      }

      const message = {
        type: "TALK",
        roomId: this.roomId,
        senderId: this.currentUserId,
        content: messageContent,
        timestamp: new Date().toISOString(),
        itemId: this.itemId,
      };

      try {
        // 메시지를 로컬 messages 배열에 먼저 추가
        this.messages.push({
          ...message,
          senderId: this.currentUserId,
        });

        const headers = {
          "content-type": "application/json",
          userId: this.currentUserId?.toString(),
          itemId: this.itemId?.toString() || this.$route.query.itemId,
        };

        console.log("전송할 메시지:", message);
        console.log("전송 헤더:", headers);

        await this.stompClient.publish({
          destination: `/app/chat/${this.roomId}`,
          body: JSON.stringify(message),
          headers: headers,
        });

        console.log("메시지 전송 성공");
      } catch (error) {
        console.error("[STOMP] 메시지 전송 실패:", error);
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
        senderId: this.currentUserId,
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
        } else {
          this.messages = [];
          console.log("[채팅 히스토리] 기록 없음");
        }
      } catch (error) {
        console.error("채팅 히스토리 로딩 실패:", error);
        this.messages = [];
      }
    },

    // 상품 상세 페이지로 이동 (ChatItemInfo에서 이벤트 받음)
    goToItemDetail(itemId) {
      if (itemId) {
        console.log("[라우팅] 상품 상세 페이지로 이동:", itemId);
        this.$router.push(`/items/${itemId}`);
      }
    },

    // 메시지 관련 이벤트 핸들러들
    handleMessageClick(message) {
      console.log("[메시지 클릭]", message);
      // 메시지 클릭 시 동작 (확장 가능)
    },

    handleMessageOptions(message) {
      console.log("[메시지 옵션]", message);
      // 메시지 옵션 메뉴 표시 (확장 가능)
    },

    handleMessageReaction(data) {
      console.log("[메시지 반응]", data);
      // 메시지 반응 처리 (확장 가능)
    },

    // ChatInputArea 이벤트 핸들러들
    handleAddAction() {
      console.log("[추가 액션] 파일 첨부 등");
      // 파일 첨부 등 추가 기능 (확장 가능)
    },

    // 외부에서 입력창 포커스 (유틸리티)
    focusInput() {
      if (this.$refs.inputArea) {
        this.$refs.inputArea.focus();
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
      }, 100);
    } else if (this.stompClient) {
      this.stompClient.deactivate();
    }
  },

  watch: {
    // 로그인 상태 변경 감지
    isAuthenticated(newVal, oldVal) {
      console.log("[Auth 상태 변경]", { from: oldVal, to: newVal });

      if (newVal && !oldVal) {
        console.log("로그인됨 - 채팅 기능 활성화");
        this.loadChatHistory();
        this.initWebSocket();
      } else if (!newVal && oldVal) {
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
