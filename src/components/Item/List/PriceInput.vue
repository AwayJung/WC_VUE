<!-- PriceInput.vue -->
<template>
  <div class="mb-6">
    <div class="flex gap-4 mb-4">
      <button
        :class="[
          'flex-1 py-2 rounded-full',
          isFixed ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500',
        ]"
        @click="isFixed = true"
      >
        판매하기
      </button>
      <button
        :class="[
          'flex-1 py-2 rounded-full',
          !isFixed ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500',
        ]"
        @click="isFixed = false"
      >
        나눔하기
      </button>
    </div>
    <div v-if="isFixed" class="relative">
      <input
        type="number"
        v-model="price"
        class="w-full px-4 py-3 border rounded-lg"
        placeholder="가격을 입력해주세요"
      />
      <span
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
        >원</span
      >
    </div>
    <div class="mt-2">
      <label class="flex items-center">
        <input type="checkbox" v-model="isPriceFlexible" class="mr-2" />
        <span class="text-gray-600">가격 제안 받기</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "PriceInput",
  data() {
    return {
      isFixed: true,
      price: "",
      isPriceFlexible: false,
    };
  },
  watch: {
    price(newVal) {
      this.$emit("input", newVal);
    },
  },
};
</script>
