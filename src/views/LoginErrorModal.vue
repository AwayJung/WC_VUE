<template>
  <transition name="fade">
    <div
        v-if="visible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h3 class="text-lg font-semibold mb-4">알림</h3>
        <p class="mb-6">{{ message }}</p>
        <div class="text-right">
          <button
              @click="$emit('close')"
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ErrorModal',
  props: {
    visible: Boolean,
    message: String
  }
}
</script>

<style>
/* 간단한 페이드 인/아웃 애니메이션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
