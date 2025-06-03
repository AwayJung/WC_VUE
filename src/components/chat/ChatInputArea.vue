<template>
  <!-- 메시지 입력 영역 -->
  <div
    v-if="isAuthenticated"
    class="border-t bg-white px-2 py-2 flex items-center gap-2"
  >
    <!-- 추가 버튼 (파일 첨부 등) -->
    <button
      @click="handleAddButtonClick"
      class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
      :disabled="!isConnected"
    >
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

    <!-- 메시지 입력창 -->
    <input
      v-model="messageText"
      @keyup.enter="handleSendMessage"
      @input="handleInput"
      type="text"
      placeholder="메시지를 입력하세요..."
      :disabled="!isConnected"
      class="flex-1 bg-gray-50 rounded-full px-5 py-3 text-base focus:outline-none border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    />

    <!-- 전송 버튼 -->
    <button
      @click="handleSendMessage"
      :disabled="!canSend"
      class="w-10 h-10 flex items-center justify-center transition-all duration-200"
      :class="[
        canSend
          ? 'text-orange-500 hover:text-orange-600 hover:scale-105'
          : 'text-gray-400 cursor-not-allowed',
      ]"
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

  <!-- 로그인 필요 안내 -->
  <div v-else class="border-t bg-gray-100 px-4 py-3 text-center">
    <p class="text-sm text-gray-500">메시지를 보내려면 로그인이 필요합니다.</p>
  </div>
</template>

<script>
export default {
  name: "ChatInputArea",

  props: {
    isConnected: {
      type: Boolean,
      default: false,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "메시지를 입력하세요...",
    },
  },

  data() {
    return {
      messageText: "",
    };
  },

  computed: {
    // 전송 가능 여부
    canSend() {
      return (
        this.messageText.trim() && this.isConnected && this.isAuthenticated
      );
    },
  },

  methods: {
    // 메시지 전송
    handleSendMessage() {
      if (!this.canSend) {
        console.log("[메시지 입력] 전송 조건 불충족:", {
          hasMessage: !!this.messageText.trim(),
          isConnected: this.isConnected,
          isAuthenticated: this.isAuthenticated,
        });
        return;
      }

      const message = this.messageText.trim();

      // 부모 컴포넌트에 메시지 전송 이벤트 발생
      this.$emit("send-message", message);

      // 입력창 초기화
      this.messageText = "";
    },

    // 입력 변화 감지
    handleInput() {
      // 필요시 타이핑 이벤트 발생
      this.$emit("typing");
    },

    // 추가 버튼 클릭 (파일 첨부 등)
    handleAddButtonClick() {
      if (!this.isConnected) return;

      // 부모 컴포넌트에 추가 기능 이벤트 발생
      this.$emit("add-action");
    },

    // 외부에서 입력창 포커스
    focus() {
      this.$nextTick(() => {
        const input = this.$el.querySelector("input");
        if (input) {
          input.focus();
        }
      });
    },

    // 외부에서 입력창 내용 설정
    setMessage(message) {
      this.messageText = message;
    },
  },
};
</script>

<style scoped>
/* 추가 스타일링 */
.border-t {
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* 전송 버튼 활성화 시 애니메이션 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse 2s infinite;
}
</style>
