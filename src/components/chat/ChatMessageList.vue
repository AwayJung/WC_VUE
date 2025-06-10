<template>
  <!-- 채팅 메시지 영역 -->
  <div class="flex-1 overflow-y-auto bg-gray-50" ref="messageContainer">
    <ChatMessage
      v-for="(message, index) in messages"
      :key="`msg-${currentUserId}-${message.id || message.timestamp}-${index}`"
      :message="message"
      :current-user-id="currentUserId"
      :show-status="true"
      :show-options="true"
      :show-sender-name="false"
      :show-reaction-bar="false"
      @message-click="handleMessageClick"
      @message-options="handleMessageOptions"
      @message-reaction="handleMessageReaction"
      @message-context-menu="handleMessageContextMenu"
    />
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage.vue";

export default {
  name: "ChatMessageList",

  components: {
    ChatMessage,
  },

  props: {
    messages: {
      type: Array,
      default: () => [],
    },
    currentUserId: {
      type: [String, Number],
      required: true,
    },
  },

  watch: {
    messages: {
      deep: true,
      handler() {
        this.scrollToBottom();
      },
    },

    // currentUserId 변경 시 강제 리렌더링을 위한 감시자
    currentUserId(newVal, oldVal) {
      console.log("[ChatMessageList] currentUserId 변경:", {
        from: oldVal,
        to: newVal,
      });
      // Vue의 $forceUpdate로 강제 리렌더링
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
  },

  mounted() {
    // 컴포넌트 마운트 후 스크롤을 맨 아래로
    this.scrollToBottom();

    console.log("[ChatMessageList] 마운트됨:", {
      currentUserId: this.currentUserId,
      messagesCount: this.messages.length,
    });
  },

  methods: {
    // 스크롤을 맨 아래로 이동
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    // ChatMessage 이벤트들을 부모로 전달
    handleMessageClick(message) {
      this.$emit("message-click", message);
    },

    handleMessageOptions(message) {
      this.$emit("message-options", message);
    },

    handleMessageReaction(data) {
      this.$emit("message-reaction", data);
    },

    handleMessageContextMenu(data) {
      this.$emit("message-context-menu", data);
    },
  },
};
</script>

<style scoped>
/* 스크롤바 스타일링 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
