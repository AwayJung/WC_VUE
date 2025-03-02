<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="handleGoBack" class="p-1">
          <span class="text-2xl">×</span>
        </button>
        <h1 class="text-lg font-medium">내 물건 팔기</h1>
        <div class="w-20 text-right">
          <span class="text-gray-400">임시저장</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto mt-14">
      <form @submit.prevent="onSubmit" class="p-4">
        <!-- 이미지 업로드 -->
        <div class="mb-6">
          <div class="text-sm mb-2">상품 이미지</div>
          <div class="flex flex-wrap gap-2">
            <!-- 이미지 업로드 버튼 -->
            <label
              v-if="formData.images.length < 5"
              class="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
            >
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                multiple
                class="hidden"
              />
              <span class="text-gray-400 text-3xl">+</span>
            </label>

            <!-- 미리보기 이미지 -->
            <div
              v-for="(image, index) in formData.images"
              :key="index"
              class="relative w-20 h-20"
            >
              <img
                :src="formData.imageUrls[index]"
                class="w-full h-full object-cover rounded"
              />
              <button
                @click.prevent="removeImage(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            최대 5개의 이미지를 업로드할 수 있습니다.
          </p>
        </div>

        <!-- 제목 -->
        <div class="mb-6">
          <div class="text-sm mb-2">제목</div>
          <input
            v-model="formData.title"
            type="text"
            placeholder="글 제목"
            class="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <!-- 카테고리 -->
        <div class="mb-6">
          <div class="text-sm mb-2">카테고리</div>
          <select
            v-model="formData.category"
            class="w-full px-4 py-3 border rounded-lg"
          >
            <option value="">카테고리 선택</option>
            <option value="electronics">전자기기</option>
            <option value="clothing">의류</option>
            <option value="books">책</option>
            <option value="furniture">가구</option>
            <option value="etc">기타</option>
          </select>
        </div>

        <!-- 가격 입력 -->
        <div class="mb-6">
          <div class="text-sm mb-2">가격</div>
          <div class="flex items-center space-x-2">
            <input
              v-model="formData.price"
              type="number"
              placeholder="가격을 입력하세요"
              class="w-full px-4 py-3 border rounded-lg"
            />
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="formData.priceFlexible"
                class="mr-2"
              />
              <span class="text-sm">가격 흥정 가능</span>
            </label>
          </div>
        </div>

        <!-- 설명 -->
        <div class="mb-6">
          <div class="text-sm mb-2">자세한 설명</div>
          <textarea
            v-model="formData.description"
            rows="6"
            placeholder="게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)"
            class="w-full px-4 py-3 border rounded-lg resize-none"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm mb-4 text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="!isFormValid || isSubmitting"
          class="submit-button"
          :class="{ 'opacity-50': !isFormValid || isSubmitting }"
        >
          {{ isSubmitting ? "등록 중..." : "작성 완료" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ItemCreatePage",
  data() {
    return {
      formData: {
        images: [],
        imageUrls: [], // 이미지 URL을 저장할 배열 추가
        title: "",
        category: "",
        price: "",
        priceFlexible: false,
        description: "",
      },
      isSubmitting: false,
      error: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.images.length > 0 &&
        this.formData.title.trim() &&
        this.formData.category &&
        this.formData.price &&
        this.formData.description.trim()
      );
    },
  },
  methods: {
    handleImageUpload(event) {
      const files = Array.from(event.target.files);

      // Check total number of images
      const remainingSlots = 5 - this.formData.images.length;
      const filesToAdd = files.slice(0, remainingSlots);

      // Validate file types and sizes
      const validFiles = filesToAdd.filter((file) => {
        // Check file type
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
          alert(
            "지원되지 않는 파일 형식입니다. JPEG, PNG, GIF 파일만 업로드 가능합니다."
          );
          return false;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB를 초과할 수 없습니다.");
          return false;
        }

        return true;
      });

      // 유효한 파일 추가 및 URL 생성
      validFiles.forEach((file) => {
        this.formData.images.push(file);
        // URL 생성 및 저장
        this.formData.imageUrls.push(window.URL.createObjectURL(file));
      });

      // Reset file input
      event.target.value = "";
    },

    removeImage(index) {
      this.formData.images.splice(index, 1);
      this.formData.imageUrls.splice(index, 1); // URL도 함께 제거
    },

    handleGoBack() {
      if (
        this.formData.title ||
        this.formData.description ||
        this.formData.images.length
      ) {
        if (
          window.confirm("작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?")
        ) {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    },
    async onSubmit() {
      // Reset previous error
      this.error = null;

      // Validate form
      if (!this.isFormValid) {
        this.error = "모든 필드를 채워주세요.";
        return;
      }

      // Prevent multiple submissions
      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        // FormData 객체 생성
        const formData = new FormData();

        // 이미지 추가
        if (this.formData.images.length > 0) {
          // 모든 이미지를 "images" 키로 추가
          for (let i = 0; i < this.formData.images.length; i++) {
            formData.append("images", this.formData.images[i]);
          }
        }

        // 아이템 데이터를 JSON 문자열로 변환하여 추가
        const itemData = {
          title: this.formData.title.trim(),
          category: this.formData.category,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: 3,
        };

        // 아이템 데이터 추가
        formData.append("item", JSON.stringify(itemData));

        // FormData 내용 확인 (디버깅용)
        for (let pair of formData.entries()) {
          console.log(
            pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
          );
        }

        // API 요청
        const response = await axios.post(
          "http://localhost:8080/api/items/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("아이템 등록 응답:", response.data);

        // 성공 시 폼 초기화
        this.resetForm();

        // 목록 페이지로 이동
        this.$router.push("/items");
      } catch (error) {
        console.error("아이템 등록 실패:", error);
        console.error(
          "응답 데이터:",
          error.response ? error.response.data : "응답 없음"
        );
        console.error(
          "응답 상태:",
          error.response ? error.response.status : "상태 코드 없음"
        );
        this.error =
          error.response?.data?.message ||
          error.message ||
          "아이템 등록에 실패했습니다. 다시 시도해주세요.";
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        images: [],
        imageUrls: [],
        title: "",
        category: "",
        price: "",
        priceFlexible: false,
        description: "",
      };
    },
  },
};
</script>

<style scoped>
.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #f97316;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  margin-bottom: 4rem;
  transition: opacity 0.2s ease;
}

.submit-button:disabled {
  cursor: not-allowed;
}
</style>
