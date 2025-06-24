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
          :class="[
            'w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-medium mb-16 transition-opacity',
            !isFormValid || isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-orange-600',
          ]"
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

    currentUserId() {
      return this.currentUser?.userId || null;
    },

    isFormValid() {
      return (
        this.formData.title.trim() &&
        this.formData.categoryId &&
        this.formData.price &&
        this.formData.description.trim() &&
        this.currentUserId
      );
    },
  },
  created() {
    if (!this.isAuthenticated) {
      this.$router.push("/login");
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
      this.error = null;

      if (!this.isAuthenticated || !this.currentUserId) {
        this.error = "로그인이 필요합니다.";
        return;
      }

      if (!this.isFormValid) {
        this.error = "모든 필드를 채워주세요.";
        return;
      }

      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        const formData = new FormData();

        this.formData.images.forEach((file) => {
          formData.append("images", file);
        });

        const itemData = {
          title: this.formData.title.trim(),
          categoryId: this.formData.categoryId,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: this.currentUserId,
        };

        formData.append("item", JSON.stringify(itemData));

        await axios.post("http://localhost:8080/api/items/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.resetForm();
        this.$router.push("/items");
      } catch (error) {
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
        categoryId: "",
        price: "",
        priceFlexible: false,
        description: "",
      };
    },
  },
};
</script>
