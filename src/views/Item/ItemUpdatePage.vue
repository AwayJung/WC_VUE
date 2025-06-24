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
      <div class="rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
          class="w-full p-3 bg-orange-500 text-white rounded-lg font-medium mb-16 transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50"
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
      originalImages: [],
      isSubmitting: false,
      formError: null,
    };
  },
  computed: {
    ...mapState("item", ["loading", "error", "currentItem"]),
    ...mapGetters("auth", ["currentUser", "isAuthenticated"]),

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

    isOwner() {
      return (
        this.isAuthenticated &&
        this.currentItem?.data?.sellerId === this.currentUserId
      );
    },
  },
  methods: {
    ...mapActions("item", ["fetchItem", "updateItem"]),

    async loadItemData() {
      try {
        if (!this.isAuthenticated) {
          return;
        }

        await this.fetchItem(this.itemId);

        if (this.currentItem && this.currentItem.data) {
          const item = this.currentItem.data;

          if (item.sellerId !== this.currentUserId) {
            alert("자신의 상품만 수정할 수 있습니다.");
            this.$router.push(`/items/${this.itemId}`);
            return;
          }

          this.formData = {
            images: [],
            imageUrls: [],
            title: item.title || "",
            categoryId: item.categoryId || item.category || "",
            price: item.price ? String(item.price) : "",
            priceFlexible: item.priceFlexible || false,
            description: item.description || "",
          };

          const imageUrls = [];
          this.originalImages = [];

          if (item.imageUrl) {
            imageUrls.push(item.imageUrl);
            this.originalImages.push({
              url: item.imageUrl,
              deleted: false,
            });
          }

          if (item.imageUrlList && item.imageUrlList.length > 0) {
            item.imageUrlList.forEach((url) => {
              imageUrls.push(url);
              this.originalImages.push({
                url: url,
                deleted: false,
              });
            });
          }

          this.formData.imageUrls = imageUrls;
        }
      } catch (error) {
        console.error("상품 정보 로드 실패:", error);
        this.formError = "상품 정보를 불러오는데 실패했습니다.";
      }
    },

    addImages(files) {
      files.forEach((file) => {
        this.formData.images.push(file);
        this.formData.imageUrls.push(window.URL.createObjectURL(file));
      });
    },

    removeImage(index) {
      this.formData.imageUrls.splice(index, 1);

      if (index < this.formData.images.length) {
        this.formData.images.splice(index, 1);
      } else if (this.originalImages.length > 0) {
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

    getImageNameFromUrl(imageUrl) {
      if (!imageUrl) return null;
      const urlParts = imageUrl.split("/");
      return urlParts[urlParts.length - 1];
    },

    async onSubmit() {
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

      this.formError = null;

      if (!this.isFormValid) {
        this.formError = "모든 필드를 채워주세요.";
        return;
      }

      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;

        const formData = new FormData();

        if (this.formData.images.length > 0) {
          for (let i = 0; i < this.formData.images.length; i++) {
            formData.append("images", this.formData.images[i]);
          }
        }

        const imageFileNames = this.originalImages
          .filter((img) => !img.deleted)
          .map((img) => this.getImageNameFromUrl(img.url));

        const itemData = {
          title: this.formData.title.trim(),
          categoryId: this.formData.categoryId,
          price: Number(this.formData.price),
          priceFlexible: this.formData.priceFlexible,
          description: this.formData.description.trim(),
          sellerId: this.currentUserId,
          imageIds: imageFileNames,
        };

        formData.append("item", JSON.stringify(itemData));

        await axios.put(
          `http://localhost:8080/api/items/${this.itemId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.$router.push(`/items/${this.itemId}`);
      } catch (error) {
        console.error("아이템 수정 실패:", error);
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

  async beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      if (!vm.isAuthenticated) {
        alert("로그인이 필요합니다.");
        vm.$router.push("/login");
        return;
      }

      if (vm.currentItem && !vm.isOwner) {
        alert("자신의 상품만 수정할 수 있습니다.");
        vm.$router.push(`/items/${vm.itemId}`);
        return;
      }
    });
  },
};
</script>
