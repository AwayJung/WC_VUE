import { login } from "@/api/login.js";
import loginApi from "@/api/login.js";
import {
  signupUser,
  getUserProfile,
  updateIntroduction,
  deleteIntroduction,
  uploadProfileImage,
  updateProfileImage,
  deleteProfileImage,
  updateProfile,
  signupWithProfileImage,
  getUserProfileById,
} from "@/api/login.js";
import Vue from "vue";

const state = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  userProfile: null,
  profileLoading: false,
  profileError: null,
  sellerProfiles: {},
};

const getters = {
  isAuthenticated: (state) => !!state.accessToken,
  currentUser: (state) => state.user,
  userProfile: (state) => state.userProfile,
  profileLoading: (state) => state.profileLoading,
  profileError: (state) => state.profileError,
  userIntroduction: (state) => state.userProfile?.introduction || "",
  userProfileImage: (state) => state.userProfile?.profileImage || null,
  getSellerProfile: (state) => (userId) => state.sellerProfiles[userId] || null,
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await login({
        loginEmail: credentials.email,
        password: credentials.password,
      });

      const { data } = response.data;

      if (data) {
        commit("SET_AUTH_DATA", {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: {
            userId: data.userId,
            name: data.name,
            loginEmail: data.loginEmail,
            regDt: data.regDt,
          },
        });
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async signup(_context, signupData) {
    try {
      const response = await signupUser(signupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async signupWithImage(_context, { signupData, profileImage }) {
    try {
      const response = await signupWithProfileImage(signupData, profileImage);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async logout({ commit, state }) {
    const token = state.accessToken;
    if (token) {
      try {
        await loginApi.post("/api/users/logout");
      } catch (e) {
        // 로그아웃 요청 실패는 무시
      }
    }
    commit("CLEAR_AUTH_DATA");
    localStorage.removeItem("vuex");
  },

  async refreshToken({ commit, state }) {
    try {
      const response = await loginApi.post(
        "/api/users/refresh",
        {},
        {
          headers: {
            refreshToken: state.refreshToken,
          },
        }
      );

      const { data } = response.data;

      if (data) {
        commit("UPDATE_TOKENS", {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        return Promise.resolve(data);
      }
    } catch (error) {
      commit("CLEAR_AUTH_DATA");
      return Promise.reject(error);
    }
  },

  async fetchUserProfile({ commit }) {
    commit("SET_PROFILE_LOADING", true);
    commit("SET_PROFILE_ERROR", null);

    try {
      const response = await getUserProfile();
      const profileData = response.data.data;

      commit("SET_USER_PROFILE", profileData);
      commit("SET_PROFILE_LOADING", false);

      return Promise.resolve(profileData);
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "프로필 조회에 실패했습니다."
      );
      commit("SET_PROFILE_LOADING", false);
      return Promise.reject(error);
    }
  },

  async fetchSellerProfile({ commit, state }, userId) {
    if (state.sellerProfiles[userId]) {
      return Promise.resolve(state.sellerProfiles[userId]);
    }

    try {
      const response = await getUserProfileById(userId);
      const profileData = response.data.data;

      commit("SET_SELLER_PROFILE", { userId, profileData });

      return Promise.resolve(profileData);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateUserIntroduction({ commit, dispatch }, introduction) {
    try {
      await updateIntroduction(introduction);
      await dispatch("fetchUserProfile");
      return Promise.resolve();
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "자기소개 수정에 실패했습니다."
      );
      return Promise.reject(error);
    }
  },

  async deleteUserIntroduction({ commit, dispatch }) {
    try {
      await deleteIntroduction();
      await dispatch("fetchUserProfile");
      return Promise.resolve();
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "자기소개 삭제에 실패했습니다."
      );
      return Promise.reject(error);
    }
  },

  async uploadUserProfileImage({ commit, dispatch }, profileImage) {
    try {
      await uploadProfileImage(profileImage);
      await dispatch("fetchUserProfile");
      return Promise.resolve();
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "프로필 이미지 업로드에 실패했습니다."
      );
      return Promise.reject(error);
    }
  },

  async updateUserProfileImage({ commit, dispatch }, profileImage) {
    try {
      await updateProfileImage(profileImage);
      await dispatch("fetchUserProfile");
      return Promise.resolve();
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "프로필 이미지 수정에 실패했습니다."
      );
      return Promise.reject(error);
    }
  },

  async deleteUserProfileImage({ commit, dispatch }) {
    try {
      await deleteProfileImage();
      await dispatch("fetchUserProfile");
      return Promise.resolve();
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "프로필 이미지 삭제에 실패했습니다."
      );
      return Promise.reject(error);
    }
  },

  async updateUserProfile({ commit, dispatch }, { userProfile, profileImage }) {
    try {
      await updateProfile(userProfile, profileImage);
      await dispatch("fetchUserProfile");
      return Promise.resolve();
    } catch (error) {
      commit(
        "SET_PROFILE_ERROR",
        error.response?.data?.message || "프로필 수정에 실패했습니다."
      );
      return Promise.reject(error);
    }
  },

  clearProfileError({ commit }) {
    commit("SET_PROFILE_ERROR", null);
  },
};

const mutations = {
  SET_AUTH_DATA(state, { accessToken, refreshToken, user }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.user = user;
    state.isAuthenticated = true;
  },

  UPDATE_TOKENS(state, { accessToken, refreshToken }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },

  CLEAR_AUTH_DATA(state) {
    state.accessToken = null;
    state.refreshToken = null;
    state.user = null;
    state.isAuthenticated = false;
    state.userProfile = null;
    state.profileError = null;
    state.sellerProfiles = {};
  },

  SET_USER_PROFILE(state, profileData) {
    state.userProfile = profileData;
  },

  SET_SELLER_PROFILE(state, { userId, profileData }) {
    Vue.set(state.sellerProfiles, userId, profileData);
  },

  SET_PROFILE_LOADING(state, loading) {
    state.profileLoading = loading;
  },

  SET_PROFILE_ERROR(state, error) {
    state.profileError = error;
  },

  UPDATE_USER_INTRODUCTION(state, introduction) {
    if (state.userProfile) {
      state.userProfile.introduction = introduction;
    }
  },

  UPDATE_USER_PROFILE_IMAGE(state, profileImage) {
    if (state.userProfile) {
      state.userProfile.profileImage = profileImage;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
