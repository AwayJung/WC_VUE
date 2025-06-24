<template>
  <div>
    <!-- 제목 -->
    <div class="mb-6">
      <div class="text-sm mb-2">제목</div>
      <input
        :value="title"
        @input="$emit('update:title', $event.target.value)"
        type="text"
        placeholder="글 제목"
        class="w-full px-4 py-3 border rounded-lg"
      />
    </div>

    <div class="text-sm mb-2">카테고리</div>
    <CategoryInput
      :value="categoryId"
      @input="$emit('update:categoryId', $event)"
    />

    <!-- 가격 입력 -->
    <div class="mb-6">
      <div class="text-sm mb-2">가격</div>
      <div class="flex items-center space-x-2">
        <input
          :value="price"
          @input="handlePriceInput"
          type="number"
          placeholder="가격을 입력하세요"
          class="w-full px-4 py-3 border rounded-lg no-spinner"
          :disabled="isSharing"
        />
      </div>
      <div class="mt-2 flex items-center">
        <label class="inline-flex items-center cursor-pointer">
          <input
            :checked="priceFlexible"
            @change="handleSharingChange"
            type="checkbox"
            class="form-checkbox mr-2"
          />
          <span class="text-sm whitespace-nowrap">나눔하기</span>
        </label>
        <!-- 가격 표시 -->
        <div
          v-if="price !== null && price !== ''"
          class="ml-4 text-sm font-medium"
          :class="isSharing ? 'text-green-600' : 'text-gray-500'"
        >
          {{ isSharing ? "나눔" : Number(price).toLocaleString() + "원" }}
        </div>
      </div>
    </div>

    <!-- 설명 -->
    <div class="mb-6">
      <div class="text-sm mb-2">자세한 설명</div>
      <textarea
        :value="description"
        @input="$emit('update:description', $event.target.value)"
        rows="6"
        placeholder="게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)"
        class="w-full px-4 py-3 border rounded-lg resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script>
import CategoryInput from "../category/CategoryInput.vue";

export default {
  name: "ItemForm",

  components: {
    CategoryInput,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    categoryId: {
      type: [String, Number],
      required: true,
    },
    price: {
      type: [String, Number],
      required: true,
    },
    priceFlexible: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },

  computed: {
    isSharing() {
      return this.priceFlexible && (this.price === 0 || this.price === "0");
    },
  },

  methods: {
    handlePriceInput(event) {
      this.$emit("update:price", event.target.value);

      if (event.target.value === "0") {
        this.$emit("update:priceFlexible", true);
      }
    },

    handleSharingChange(event) {
      this.$emit("update:priceFlexible", event.target.checked);

      if (event.target.checked) {
        this.$emit("update:price", "0");
      } else {
        this.$emit("update:price", "");
      }
    },
  },
};
</script>

<style scoped>
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
