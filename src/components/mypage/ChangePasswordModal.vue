<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-xl p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
    >
      <!-- 헤더 -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">비밀번호 변경</h3>
        <p class="text-gray-600 text-sm">
          보안을 위해 현재 비밀번호를 확인한 후<br />
          새로운 비밀번호로 변경해주세요.
        </p>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <!-- 현재 비밀번호 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            현재 비밀번호
          </label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            autocomplete="current-password"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="현재 비밀번호를 입력하세요"
            :class="{ 'border-red-500': errors.currentPassword }"
          />
          <p v-if="errors.currentPassword" class="text-red-500 text-xs mt-1">
            {{ errors.currentPassword }}
          </p>
        </div>

        <!-- 새 비밀번호 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호
          </label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            autocomplete="current-password"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="새 비밀번호를 입력하세요 (최소 10자)"
            :class="{ 'border-red-500': errors.newPassword }"
          />
          <p v-if="errors.newPassword" class="text-red-500 text-xs mt-1">
            {{ errors.newPassword }}
          </p>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">
              {{ passwordForm.newPassword.length }}/30자
            </span>
            <span
              v-if="passwordStrength"
              class="text-xs"
              :class="passwordStrengthClass"
            >
              {{ passwordStrength }}
            </span>
          </div>
        </div>

        <!-- 새 비밀번호 확인 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 확인
          </label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            autocomplete="current-password"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="새 비밀번호를 다시 입력하세요"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- 비밀번호 안내 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-600 leading-relaxed">
            <strong>비밀번호 조건:</strong><br />
            • 최소 10자 이상<br />
            • 영문, 숫자 조합 권장<br />
            • 특수문자 포함 시 보안성 향상
          </p>
        </div>
      </form>

      <!-- 버튼 -->
      <div class="flex space-x-3 mt-8">
        <button
          @click="handleClose"
          class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
          :disabled="isChanging"
        >
          취소
        </button>
        <button
          @click="handleChangePassword"
          class="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
          :disabled="!isFormValid || isChanging"
          :class="{
            'opacity-50 cursor-not-allowed': !isFormValid || isChanging,
          }"
        >
          {{ isChanging ? "변경 중..." : "변경하기" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { changePassword } from "@/api/login";

export default {
  name: "ChangePasswordModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "success"],

  data() {
    return {
      passwordForm: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      errors: {},
      isChanging: false,
    };
  },

  computed: {
    isFormValid() {
      return (
        this.passwordForm.currentPassword.trim() &&
        this.passwordForm.newPassword.trim().length >= 10 &&
        this.passwordForm.confirmPassword.trim() &&
        this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
        Object.keys(this.errors).length === 0
      );
    },

    passwordStrength() {
      const password = this.passwordForm.newPassword;
      if (password.length === 0) return "";

      let score = 0;
      if (password.length >= 10) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      if (score < 2) return "약함";
      if (score < 4) return "보통";
      return "강함";
    },

    passwordStrengthClass() {
      const strength = this.passwordStrength;
      if (strength === "약함") return "text-red-500";
      if (strength === "보통") return "text-yellow-500";
      if (strength === "강함") return "text-green-500";
      return "";
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },

    "passwordForm.newPassword"() {
      this.validateNewPassword();
    },

    "passwordForm.confirmPassword"() {
      this.validateConfirmPassword();
    },
  },

  methods: {
    resetForm() {
      this.passwordForm = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      this.errors = {};
      this.isChanging = false;
    },

    validateNewPassword() {
      const password = this.passwordForm.newPassword;

      if (password.length > 0 && password.length < 10) {
        this.$set(
          this.errors,
          "newPassword",
          "비밀번호는 최소 10자 이상이어야 합니다."
        );
      } else if (password.length > 30) {
        this.$set(
          this.errors,
          "newPassword",
          "비밀번호는 최대 30자까지 입력 가능합니다."
        );
      } else {
        this.$delete(this.errors, "newPassword");
      }

      if (this.passwordForm.confirmPassword) {
        this.validateConfirmPassword();
      }
    },

    validateConfirmPassword() {
      const confirmPassword = this.passwordForm.confirmPassword;
      const newPassword = this.passwordForm.newPassword;

      if (confirmPassword.length > 0 && confirmPassword !== newPassword) {
        this.$set(
          this.errors,
          "confirmPassword",
          "비밀번호가 일치하지 않습니다."
        );
      } else {
        this.$delete(this.errors, "confirmPassword");
      }
    },

    async handleChangePassword() {
      if (!this.isFormValid) return;

      try {
        this.isChanging = true;
        this.$delete(this.errors, "currentPassword");

        const response = await changePassword({
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword,
        });

        console.log(response);

        this.$emit("success");
        this.handleClose();
      } catch (error) {
        console.error("비밀번호 변경 실패:", error);

        if (error.response && error.response.data) {
          const message = error.response.data.message;
          if (message && message.includes("현재 비밀번호")) {
            this.$set(
              this.errors,
              "currentPassword",
              "현재 비밀번호가 올바르지 않습니다."
            );
          } else {
            alert(message || "비밀번호 변경에 실패했습니다.");
          }
        } else {
          alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        }
      } finally {
        this.isChanging = false;
      }
    },

    handleClose() {
      if (this.isChanging) return;
      this.$emit("close");
    },
  },
};
</script>
