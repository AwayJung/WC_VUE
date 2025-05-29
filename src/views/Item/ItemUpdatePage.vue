<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="h-14 fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between h-full px-4">
        <button @click="handleGoBack" class="p-1">
          <span class="text-2xl">×</span>
        </button>
        <h1 class="text-lg font-medium mx-auto">상품 수정하기</h1>
      </div>
    </header>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
      <span class="ml-2">로딩 중...</span>
    </div>

    <!-- 권한 없음 메시지 -->
    <div
      v-else-if="!isAuthenticated"
      class="flex justify-center items-center h-screen"
    >
      <div class="text-center">
        <p class="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <button
          @click="$router.push('/login')"
          class="px-4 py-2 bg-orange-500 text-white rounded"
        >
          로그인하기
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="flex-1 overflow-y-auto mt-14">
      <form @submit.prevent="onSubmit" class="p-4">
        <!-- 이미지 업로드 컴포넌트 -->
        <ImageUploader
          :images="formData.images"
          :imageUrls="formData.imageUrls"
          @upload-images="addImages"
          @remove-image="removeImage"
        />

        <!-- 상품 정보 폼 컴포넌트 -->
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

        <!-- Error Message -->
        <div v-if="formError" class="text-red-500 text-sm mb-4 text-center">
          {{ formError }}
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          @click="onSubmit"
          :disabled="!isFormValid || isSubmitting"
          class="submit-button"
          :class="{ 'opacity-50': !isFormValid || isSubmitting }"
        >
          {{ isSubmitting ? "수정 중..." : "수정 완료" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions, mapGetters } from "vuex";
import ItemForm from "@/components/Item/Create/ItemForm.vue";
import ImageUploader from "@/components/Item/Create/ImageUploader.vue";

export default {
  name: "ItemUpdatePage",
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
      originalImages: [], // 기존 이미지 정보 저장
      isSubmitting: false,
      formError: null, // 이름 변경: error -> formError
    };
  },
  computed: {
    ...mapState("item", ["loading", "error", "currentItem"]),
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
        this.formData.description.trim()
      );
    },

    itemId() {
      return this.$route.params.id;
    },

    // 현재 사용자가 이 상품의 소유자인지 확인
    isOwner() {
      return (
        this.isAuthenticated &&
        this.currentItem?.data?.sellerId === this.currentUserId
      );
    },
  },
  methods: {
    ...mapActions("item", ["fetchItem", "updateItem"]),

    // 상품 데이터 불러오기
    async loadItemData() {
      try {
        // 로그인 체크
        if (!this.isAuthenticated) {
          console.log("로그인되지 않은 사용자");
          return;
        }

        await this.fetchItem(this.itemId);

        if (this.currentItem && this.currentItem.data) {
          const item = this.currentItem.data;

          // 판매자 확인 (자신의 상품이 아니면 리다이렉트)
          if (item.sellerId !== this.currentUserId) {
            alert("자신의 상품만 수정할 수 있습니다.");
            this.$router.push(`/items/${this.itemId}`);
            return;
          }

          // 폼 데이터 초기화
          this.formData = {
            images: [],
            imageUrls: [],
            title: item.title || "",
            categoryId: item.categoryId || item.category || "",
            price: item.price ? String(item.price) : "",
            priceFlexible: item.priceFlexible || false,
            description: item.description || "",
          };

          // 기존 이미지 초기화
          const imageUrls = [];
          this.originalImages = []; // 초기화

          // 대표 이미지가 있으면 추가
          if (item.imageUrl) {
            imageUrls.push(item.imageUrl);
            this.originalImages.push({
              url: item.imageUrl,
              deleted: false,
            });
          }

          // 추가 이미지가 있으면 추가
          if (item.imageUrlList && item.imageUrlList.length > 0) {
            item.imageUrlList.forEach((url) => {
              imageUrls.push(url);
              this.originalImages.push({
                url: url,
                deleted: false,
              });
            });
          }

          // 이미지 URL 초기화
          this.formData.imageUrls = imageUrls;

          console.log("상품 데이터 로드 완료:", {
            itemId: this.itemId,
            sellerId: item.sellerId,
            currentUserId: this.currentUserId,
            isOwner: this.isOwner,
          });
        }
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        this.formError = "상품 정보를 불러오는데 실패했습니다.";
      }
    },

    // 이미지 업로더에서 사용할 메소드들
    addImages(files) {
      files.forEach((file) => {
        this.formData.images.push(file);
        this.formData.imageUrls.push(window.URL.createObjectURL(file));
      });
    },

    removeImage(index) {
      // 이미지 URL 배열에서 해당 이미지 제거
      this.formData.imageUrls.splice(index, 1);

      // 새로 추가된 이미지인 경우 images 배열에서도 제거
      if (index < this.formData.images.length) {
        this.formData.images.splice(index, 1);
      }
      // 기존 이미지인 경우 originalImages에서 제거 표시
      else if (this.originalImages.length > 0) {
        const originalIndex = index - this.formData.images.length;
        if (originalIndex >= 0 && originalIndex < this.originalImages.length) {
          this.originalImages[originalIndex].deleted = true;
        }
      }
    },

    handleGoBack() {
      if (
        this.formData.title !== (this.currentItem?.data?.title || "") ||
        this.formData.description !==
          (this.currentItem?.data?.description || "") ||
        this.formData.images.length
      ) {
        if (
          window.confirm("수정 중인 내용이 있습니다. 페이지를 나가시겠습니까?")
        ) {
          this.$router.go(-1);
        }
      } else {
        this.$router.go(-1);
      }
    },

    // 이미지 URL에서 파일명 추출
    getImageNameFromUrl(imageUrl) {
      if (!imageUrl) return null;
      const urlParts = imageUrl.split("/");
      return urlParts[urlParts.length - 1];
    },

    async onSubmit() {
      // 로그인 및 권한 체크
      if (!this.isAuthenticated) {
        alert("로그인이 필요합니다.");
        this.$router.push("/login");
        return;
      }

      if (!this.isOwner) {
        alert("권한이 없습니다.");
        this.$router.push(`/items/${this.itemId}`);
        return;
      }

      // Reset previous error
      this.formError = null;

      // Validate form
      if (!this.isFormValid) {
        this.formError = "모든 필드를 채워주세요.";
        return;
      }

      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        const formData = new FormData();

        // 새로운 이미지 추가
        if (this.formData.images.length > 0) {
          // 모든 이미지를 "images" 키로 추가
          for (let i = 0; i < this.formData.images.length; i++) {
            formData.append("images", this.formData.images[i]);
          }
        }

        // 남아있는 기존 이미지 파일명 수집
        const imageFileNames = this.originalImages
          .filter((img) => !img.deleted)
          .map((img) => this.getImageNameFromUrl(img.url));

        // 아이템 데이터를 JSON 문자열로 변환하여 추가
        const itemData = {
          title: this.formData.title.trim(),
          categoryId: this.formData.categoryId,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: this.currentUserId,
          imageIds: imageFileNames, // 남아있는 기존 이미지 파일명 전달
        };

        // 아이템 데이터 추가
        formData.append("item", JSON.stringify(itemData));

        // FormData 내용 확인 (디버깅용)
        console.log("=== 수정 요청 데이터 ===");
        console.log("사용자 ID:", this.currentUserId);
        console.log("아이템 데이터:", itemData);
        for (let pair of formData.entries()) {
          console.log(
            pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
          );
        }

        const response = await axios.put(
          `http://localhost:8080/api/items/${this.itemId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("아이템 수정 응답:", response.data);

        this.$router.push(`/items/${this.itemId}`);
      } catch (error) {
        console.error("아이템 수정 실패:", error);
        console.error(
          "응답 데이터:",
          error.response ? error.response.data : "응답 없음"
        );
        console.error(
          "응답 상태:",
          error.response ? error.response.status : "상태 코드 없음"
        );
        this.formError =
          error.response?.data?.message ||
          error.message ||
          "아이템 수정에 실패했습니다. 다시 시도해주세요.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },

  async created() {
    await this.loadItemData();
  },

  mounted() {
    console.log("=== ItemUpdatePage 로그인 정보 ===");
    console.log("인증 상태:", this.isAuthenticated);
    console.log("현재 사용자:", this.currentUser);
    console.log("사용자 ID:", this.currentUserId);
    console.log("상품 소유자 여부:", this.isOwner);
    console.log("===============================");
  },

  // 라우트 가드 - 페이지 진입 전 권한 체크
  async beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      // 로그인 체크
      if (!vm.isAuthenticated) {
        alert("로그인이 필요합니다.");
        vm.$router.push("/login");
        return;
      }

      // 상품 정보가 로드된 후 권한 체크
      if (vm.currentItem && !vm.isOwner) {
        alert("자신의 상품만 수정할 수 있습니다.");
        vm.$router.push(`/items/${vm.itemId}`);
        return;
      }
    });
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
