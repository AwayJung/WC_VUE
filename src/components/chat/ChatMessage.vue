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
    isOwnMessage() {
      const messageSenderId = this.message?.senderId;
      const currentUserId = this.currentUserId;

      if (!currentUserId || currentUserId === 0 || currentUserId == null) {
        return false;
      }

      if (!messageSenderId && messageSenderId !== 0) {
        return false;
      }

      return Number(messageSenderId) === Number(currentUserId);
    },
  },

  methods: {
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
.break-words {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}
</style>
