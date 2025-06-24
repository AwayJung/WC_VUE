<template>
  <div class="flex flex-col h-screen bg-white">
    <MarketHeader
      :isLoggedIn="isAuthenticated"
      :showSearchButton="false"
      :showShareButton="false"
    />

    <ChatItemInfo
      :item-id="itemId"
      :is-authenticated="isAuthenticated"
      @item-click="handleItemClick"
      @item-loaded="handleItemLoaded"
      @go-back="goBack"
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

    <!-- 사용자 정보 로딩 중 -->
    <div
      v-else-if="isAuthenticated && !currentUserId"
      class="flex justify-center items-center h-full"
    >
      <div class="text-center">
        <p class="text-gray-500 mb-4">사용자 정보를 불러오는 중...</p>
      </div>
    </div>

    <!-- 채팅 메시지 목록 컴포넌트 -->
    <ChatMessageList
      v-else
      :messages="messages"
      :current-user-id="currentUserId"
      ref="messageList"
    />

    <!-- 메시지 입력 컴포넌트 -->
    <ChatInputArea
      v-if="isAuthenticated && currentUserId"
      :is-connected="isConnected"
      :is-authenticated="isAuthenticated"
      @send-message="sendMessage"
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
import MarketHeader from "@/components/layout/MarketHeader.vue";

export default {
  name: "ChatRoom",

  components: {
    ChatItemInfo,
    ChatMessageList,
    ChatInputArea,
    MarketHeader,
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

    currentUserId() {
      const userId = this.currentUser?.userId;
      return userId === null || userId === undefined || userId === 0
        ? null
        : userId;
    },

    isUserLoaded() {
      return this.isAuthenticated && this.currentUserId !== null;
    },
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    handleItemLoaded(itemData) {
      this.itemInfo = itemData;
    },

    handleItemClick(itemId) {
      if (itemId) {
        this.$router.push(`/items/${itemId}`);
      }
    },

    async waitForUserInfo() {
      if (this.currentUserId) {
        return;
      }

      const maxWaitTime = 5000;
      const checkInterval = 100;
      let waitedTime = 0;

      return new Promise((resolve, reject) => {
        const checkUser = () => {
          if (this.currentUserId) {
            resolve();
          } else if (waitedTime >= maxWaitTime) {
            reject(new Error("사용자 정보 로딩 타임아웃"));
          } else {
            waitedTime += checkInterval;
            setTimeout(checkUser, checkInterval);
          }
        };
        checkUser();
      });
    },

    initWebSocket() {
      if (!this.isAuthenticated || !this.currentUserId) {
        return;
      }

      if (this.stompClient) {
        this.stompClient.deactivate();
      }

      const socket = new SockJS("http://localhost:8080/ws", null, {
        transports: ["websocket"],
        serverPath: "/ws",
      });

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          host: "localhost:8080",
          userId: this.currentUserId.toString(),
        },
      });

      this.setupStompHandlers();
      this.connectStomp();
    },

    setupStompHandlers() {
      this.stompClient.onConnect = () => {
        this.isConnected = true;
        this.connectionStatus = "connected";
        this.reconnectAttempts = 0;

        this.subscribeToChatRoom();
        this.sendSystemMessage("JOIN");
      };

      this.stompClient.onStompError = () => {
        this.handleError();
      };

      this.stompClient.onWebSocketError = () => {
        this.handleError();
      };

      this.stompClient.onDisconnect = () => {
        this.handleDisconnection();
      };
    },

    subscribeToChatRoom() {
      return this.stompClient.subscribe(
        `/topic/chat/${this.roomId}`,
        this.handleIncomingMessage,
        {
          id: `chat-sub-${this.roomId}`,
          userId: this.currentUserId.toString(),
        }
      );
    },

    handleIncomingMessage(message) {
      try {
        const receivedMessage = JSON.parse(message.body);

        if (receivedMessage.senderId !== this.currentUserId) {
          this.messages.push(receivedMessage);
        }
      } catch (error) {
        console.error("[메시지 파싱 에러]", error);
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
        this.handleError();
      }
    },

    async sendMessage(messageContent) {
      if (
        !messageContent ||
        !this.isConnected ||
        !this.isAuthenticated ||
        !this.currentUserId
      ) {
        return;
      }

      const message = {
        type: "TALK",
        roomId: this.roomId,
        senderId: this.currentUserId,
        content: messageContent,
        sentTime: new Date().toISOString(),
        itemId: this.itemId,
      };

      try {
        this.messages.push({
          ...message,
          senderId: this.currentUserId,
        });

        const headers = {
          "content-type": "application/json",
          userId: this.currentUserId.toString(),
          itemId: this.itemId?.toString() || this.$route.query.itemId,
        };

        await this.stompClient.publish({
          destination: `/app/chat/${this.roomId}`,
          body: JSON.stringify(message),
          headers: headers,
        });
      } catch (error) {
        console.error("[메시지 전송 실패]", error);
        this.messages.pop();
        alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
      }
    },

    sendSystemMessage(type) {
      if (!this.isConnected || !this.isAuthenticated || !this.currentUserId) {
        return;
      }

      const message = {
        type: type,
        roomId: this.roomId,
        senderId: this.currentUserId,
        timestamp: new Date().toISOString(),
      };

      this.stompClient.publish({
        destination: `/app/chat/${this.roomId}`,
        body: JSON.stringify(message),
        headers: {
          userId: this.currentUserId.toString(),
        },
      });
    },

    async loadChatHistory() {
      if (!this.isAuthenticated || !this.currentUserId) {
        this.messages = [];
        return;
      }

      try {
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
          this.messages = response.data.map((msg) => ({
            ...msg,
            senderId: Number(msg.senderId),
          }));
        } else {
          this.messages = [];
        }
      } catch (error) {
        console.error("채팅 히스토리 로딩 실패:", error);
        this.messages = [];
      }
    },

    focusInput() {
      if (this.$refs.inputArea) {
        this.$refs.inputArea.focus();
      }
    },
  },

  async created() {
    if (this.isAuthenticated) {
      try {
        await this.waitForUserInfo();
        await this.loadChatHistory();
        this.initWebSocket();
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error);
        this.$router.push("/login");
      }
    }
  },

  beforeDestroy() {
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
    isAuthenticated(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.waitForUserInfo().then(() => {
          this.loadChatHistory();
          this.initWebSocket();
        });
      } else if (!newVal && oldVal) {
        if (this.stompClient) {
          this.stompClient.deactivate();
        }
        this.messages = [];
        this.isConnected = false;
      }
    },

    currentUserId(newVal, oldVal) {
      if (newVal !== oldVal && this.isAuthenticated) {
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
