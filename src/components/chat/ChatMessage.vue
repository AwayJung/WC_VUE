<template>
  <div class="px-4 py-2">
    <!-- 메시지 버블 -->
    <div :class="['flex', isOwnMessage ? 'justify-end' : 'justify-start']">
      <div
        :class="[
          'max-w-[70%] rounded-3xl px-5 py-3',
          isOwnMessage
            ? 'bg-orange-500 text-white'
            : 'bg-white text-gray-900 shadow-sm border border-gray-100',
        ]"
      >
        <!-- 메시지 내용 -->
        <p class="text-base leading-6 break-words">{{ message.content }}</p>
      </div>
    </div>

    <!-- 시간 표시 -->
    <div
      :class="[
        'text-sm text-gray-400 mt-1.5',
        isOwnMessage ? 'text-right mr-1' : 'text-left ml-1',
      ]"
    >
      <span>{{ formatTime(message.sentTime) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatMessage",

  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return message && typeof message.content === "string";
      },
    },
    currentUserId: {
      type: [String, Number],
      required: true,
    },
  },

  computed: {
    // 자신의 메시지인지 확인 (개선된 버전)
    isOwnMessage() {
      const messageSenderId = this.message?.senderId;
      const currentUserId = this.currentUserId;

      // 🔧 더 엄격한 검증
      if (
        !currentUserId ||
        currentUserId === 0 ||
        currentUserId === null ||
        currentUserId === undefined
      ) {
        console.log("[ChatMessage] currentUserId 무효:", currentUserId);
        return false;
      }

      if (!messageSenderId && messageSenderId !== 0) {
        console.log("[ChatMessage] messageSenderId 무효:", messageSenderId);
        return false;
      }

      // 🔧 숫자로 변환하여 비교 (더 안전)
      const messageId = Number(messageSenderId);
      const userId = Number(currentUserId);

      const isOwn = messageId === userId;

      // 🔍 상세 로그
      console.log("[ChatMessage 비교]", {
        messageContent: this.message.content?.substring(0, 20) + "...",
        messageSenderId: messageSenderId,
        messageIdConverted: messageId,
        currentUserId: currentUserId,
        userIdConverted: userId,
        isOwn: isOwn,
        timestamp: this.message.timestamp,
      });

      return isOwn;
    },
  },

  // 🆕 props 변경 감시
  watch: {
    currentUserId(newVal, oldVal) {
      console.log(
        `[ChatMessage] currentUserId 변경 (${this.message.content?.substring(
          0,
          10
        )}...):`,
        {
          from: oldVal,
          to: newVal,
          messageSenderId: this.message.senderId,
        }
      );
    },

    // isOwnMessage 변경 감시 (디버깅용)
    isOwnMessage(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log(
          `[ChatMessage] isOwnMessage 변경 (${this.message.content?.substring(
            0,
            10
          )}...):`,
          {
            from: oldVal,
            to: newVal,
            currentUserId: this.currentUserId,
            messageSenderId: this.message.senderId,
          }
        );
      }
    },
  },

  // 🆕 컴포넌트 생성 시 로그
  created() {
    console.log("[ChatMessage] 생성됨:", {
      messageContent: this.message.content?.substring(0, 20) + "...",
      messageSenderId: this.message.senderId,
      currentUserId: this.currentUserId,
      isOwnMessage: this.isOwnMessage,
    });
  },

  methods: {
    // 시간 포맷팅
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
  },
};
</script>

<style scoped>
/* 긴 텍스트 처리 */
.break-words {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
</style>
