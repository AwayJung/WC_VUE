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
    // 메시지 배열에 날짜 구분선을 추가한 배열을 반환
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

        // 날짜가 바뀌면 날짜 구분선 추가
        if (messageDate !== lastDate) {
          result.push({
            type: "date",
            date: this.formatDateForDisplay(messageDate),
            key: `date-${messageDate}`,
          });
          lastDate = messageDate;
        }

        // 메시지 추가
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
    // 날짜 문자열 반환 (YYYY-MM-DD 형식)
    getDateString(timestamp) {
      if (!timestamp) return "";

      try {
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      } catch (error) {
        console.error("날짜 파싱 에러:", error);
        return "";
      }
    },

    // 화면에 표시할 날짜 형식으로 변환 (항상 "YYYY년 M월 D일" 형식)
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

    // 두 날짜가 같은 날인지 확인
    isSameDate(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },

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

/* 날짜 구분선 애니메이션 */
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
