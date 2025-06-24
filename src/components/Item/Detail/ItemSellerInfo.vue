<template>
  <div class="px-6 py-4 border-b">
    <div class="flex items-center">
      <div class="w-12 h-12 rounded-full bg-gray-200">
        <img
          :src="sellerProfileImage"
          :alt="item.data.sellerNickname || '판매자'"
          class="w-full h-full rounded-full object-cover"
        />
      </div>
      <div class="ml-4 flex-1">
        <h3 class="font-bold text-base">
          {{ item.data.sellerNickname || "판매자" }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ItemSellerInfo",

  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data() {
    return {
      isLoadingProfile: false,
    };
  },

  computed: {
    ...mapGetters("auth", ["getSellerProfile"]),

    sellerInfo() {
      return this.item.seller || {};
    },

    sellerId() {
      return this.item.data?.sellerId;
    },

    // Vuex store에서 캐시된 판매자 프로필 가져오기
    sellerProfile() {
      return this.sellerId ? this.getSellerProfile(this.sellerId) : null;
    },

    sellerProfileImage() {
      // 판매자 프로필 이미지 처리 (마이페이지와 동일한 로직)
      const imageFileName = this.sellerProfile?.profileImage;

      if (imageFileName) {
        return `http://localhost:8080/images/${imageFileName}`;
      }

      // 기본 이미지 반환
      return require("@/assets/images/carrot_profile_default.jpg");
    },
  },

  methods: {
    ...mapActions("auth", ["fetchSellerProfile"]),

    async loadSellerProfile() {
      if (!this.sellerId || this.isLoadingProfile) return;

      if (this.sellerProfile) return;

      this.isLoadingProfile = true;

      try {
        await this.fetchSellerProfile(this.sellerId);
        console.log("판매자 프로필 로딩 성공:", this.sellerProfile);
      } catch (error) {
        console.error("판매자 프로필 로딩 실패:", error);
      } finally {
        this.isLoadingProfile = false;
      }
    },
  },

  watch: {
    // sellerId가 변경될 때마다 프로필 다시 로딩
    sellerId: {
      immediate: true,
      handler(newSellerId) {
        if (newSellerId) {
          this.loadSellerProfile();
        }
      },
    },
  },
};
</script>
