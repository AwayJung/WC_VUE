<template>
  <!-- 채팅 메시지 영역 -->
  <div class="flex-1 overflow-y-auto bg-gray-50" ref="messageContainer">
    <div v-for="item in messagesWithDateSeparators" :key="item.key">
      <!-- 날짜 표시 -->
      <div
        v-if="item.type === 'date'"
        class="flex items-center justify-center py-3"
      >
        <span class="text-sm text-gray-500">{{ item.date }}</span>
      </div>

      <!-- 채팅 메시지 -->
      <ChatMessage
        v-else
        :message="item.message"
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

  computed: {
    messagesWithDateSeparators() {
      if (!this.messages || this.messages.length === 0) {
        return [];
      }

      const result = [];
      let lastDate = null;

      this.messages.forEach((message, index) => {
        const messageDate = this.getDateString(
          message.sentTime || message.timestamp
        );

        if (messageDate !== lastDate) {
          result.push({
            type: "date",
            date: this.formatDateForDisplay(messageDate),
            key: `date-${messageDate}`,
          });
          lastDate = messageDate;
        }

        result.push({
          type: "message",
          message: message,
          key: `message-${
            message.id || message.timestamp || Date.now()
          }-${index}`,
        });
      });

      return result;
    },
  },

  watch: {
    messages: {
      deep: true,
      handler() {
        this.scrollToBottom();
      },
    },

    currentUserId() {
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
  },

  mounted() {
    this.scrollToBottom();
  },

  methods: {
    getDateString(timestamp) {
      if (!timestamp) return "";

      try {
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0];
      } catch (error) {
        console.error("날짜 파싱 에러:", error);
        return "";
      }
    },

    formatDateForDisplay(dateString) {
      if (!dateString) return "";

      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (error) {
        console.error("날짜 포맷 에러:", error);
        return dateString;
      }
    },

    isSameDate(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

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

.date-separator {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
