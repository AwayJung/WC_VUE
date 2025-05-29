<template>
  <div class="h-screen flex flex-col bg-white">
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="handleGoBack" class="p-1">
          <span class="text-2xl">×</span>
        </button>
        <h1 class="text-lg font-medium mx-auto">내 물건 팔기</h1>
      </div>
    </header>

    <!-- 로그인 필요 메시지 -->
    <div
      v-if="!isAuthenticated"
      class="flex-1 flex justify-center items-center mt-14"
    >
      <div class="text-center p-8">
        <p class="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <button
          @click="$router.push('/login')"
          class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          로그인하기
        </button>
      </div>
    </div>

    <!-- 로그인된 사용자용 폼 -->
    <main v-else class="flex-1 overflow-y-auto mt-14">
      <form @submit.prevent="onSubmit" class="p-4">
        <ImageUploader
          :images="formData.images"
          :imageUrls="formData.imageUrls"
          @upload-images="addImages"
          @remove-image="removeImage"
        />

        <ItemForm
          :title="formData.title"
          @update:title="formData.title = $event"
          :categoryId="formData.categoryId"
          @update:categoryId="formData.categoryId = $event"
          :price="formData.price"
          @update:price="formData.price = $event"
          :priceFlexible="formData.priceFlexible"
          @update:priceFlexible="formData.priceFlexible = $event"
          :description="formData.description"
          @update:description="formData.description = $event"
        />

        <div v-if="error" class="text-red-500 text-sm mb-4 text-center">
          {{ error }}
        </div>

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
import { mapGetters } from "vuex";
import axios from "axios";
import ItemForm from "@/components/Item/Create/ItemForm.vue";
import ImageUploader from "@/components/Item/Create/ImageUploader.vue";

export default {
  name: "ItemCreatePage",
  components: {
    ImageUploader,
    ItemForm,
  },
  data() {
    return {
      formData: {
        images: [],
        imageUrls: [],
        title: "",
        categoryId: "",
        price: "",
        priceFlexible: false,
        description: "",
      },
      isSubmitting: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

    // 현재 사용자 ID
    currentUserId() {
      return this.currentUser?.userId || null;
    },

    isFormValid() {
      return (
        this.formData.title.trim() &&
        this.formData.categoryId &&
        this.formData.price &&
        this.formData.description.trim() &&
        this.currentUserId // 사용자 ID도 유효성 검사에 포함
      );
    },
  },
  created() {
    // 컴포넌트 생성시 로그인 상태 확인
    console.log("=== ItemCreatePage 로그인 정보 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);
    console.log("사용자 ID:", this.currentUserId);
    console.log("===============================");

    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!this.isAuthenticated) {
      console.log("로그인되지 않음 - 로그인 페이지로 이동");
      this.$router.push("/login");
      return;
    }
  },
  methods: {
    addImages(files) {
      files.forEach((file) => {
        this.formData.images.push(file);
        this.formData.imageUrls.push(window.URL.createObjectURL(file));
      });
    },

    removeImage(index) {
      this.formData.images.splice(index, 1);
      this.formData.imageUrls.splice(index, 1);
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
      console.log("=== 아이템 등록 시작 ===");
      console.log("현재 사용자 ID:", this.currentUserId);
      console.log("인증 상태:", this.isAuthenticated);

      this.error = null;

      // 로그인 체크
      if (!this.isAuthenticated || !this.currentUserId) {
        this.error = "로그인이 필요합니다.";
        console.error("로그인되지 않음");
        return;
      }

      if (!this.isFormValid) {
        this.error = "모든 필드를 채워주세요.";
        console.error("폼 유효성 검사 실패");
        return;
      }

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
          categoryId: this.formData.categoryId,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: this.currentUserId, // ✅ Vuex에서 가져온 실제 사용자 ID
        };

        console.log("전송할 아이템 데이터:", itemData);

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
        console.log("=== 아이템 등록 종료 ===");
      }
    },

    resetForm() {
      this.formData = {
        images: [],
        imageUrls: [],
        title: "",
        categoryId: "",
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
