// src/store/auth.js
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
} from "@/api/login.js";

const state = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  // 프로필 관련 상태 추가
  userProfile: null,
  profileLoading: false,
  profileError: null,
};

const getters = {
  isAuthenticated: (state) => !!state.accessToken,
  currentUser: (state) => state.user,
  // 프로필 관련 getters 추가
  userProfile: (state) => state.userProfile,
  profileLoading: (state) => state.profileLoading,
  profileError: (state) => state.profileError,
  userIntroduction: (state) => state.userProfile?.introduction || "",
  userProfileImage: (state) => state.userProfile?.profileImage || null,
};

const actions = {
  // =============== 기존 인증 관련 액션들 ===============

  // 로그인 액션
  async login({ commit }, credentials) {
    try {
      const response = await login({
        loginEmail: credentials.email,
        password: credentials.password,
      });

      // API 응답 구조에 맞게 데이터 추출
      const { data } = response.data;

      if (data) {
        // Vuex에 인증 정보 저장
        commit("SET_AUTH_DATA", {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: {
            userId: data.userId,
            name: data.name,
            loginEmail: data.loginEmail,
            regDt: data.regDt,
            // 기타 필요한 사용자 정보
          },
        });
        return Promise.resolve(data);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // 회원가입 액션
  async signup(_context, signupData) {
    try {
      const response = await signupUser(signupData);
      // 필요하다면 상태 저장
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 프로필 이미지와 함께 회원가입
  async signupWithImage(_context, { signupData, profileImage }) {
    try {
      const response = await signupWithProfileImage(signupData, profileImage);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 로그아웃 액션
  async logout({ commit, state }) {
    const token = state.accessToken;
    if (token) {
      try {
        await loginApi.post("/api/users/logout");
      } catch (e) {
        /* 무시 */
      }
    }
    commit("CLEAR_AUTH_DATA");
    localStorage.removeItem("vuex");
  },

  // 토큰 갱신 액션
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
      // 갱신 실패시 로그아웃 처리
      commit("CLEAR_AUTH_DATA");
      return Promise.reject(error);
    }
  },

  // =============== 🔥 새로 추가된 프로필 관련 액션들 ===============

  // 프로필 정보 조회
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

  // 자기소개 수정
  async updateUserIntroduction({ commit, dispatch }, introduction) {
    try {
      await updateIntroduction(introduction);

      // 프로필 정보 다시 조회해서 상태 업데이트
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

  // 자기소개 삭제
  async deleteUserIntroduction({ commit, dispatch }) {
    try {
      await deleteIntroduction();

      // 프로필 정보 다시 조회해서 상태 업데이트
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

  // 프로필 이미지 업로드
  async uploadUserProfileImage({ commit, dispatch }, profileImage) {
    try {
      await uploadProfileImage(profileImage);

      // 프로필 정보 다시 조회해서 상태 업데이트
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

  // 프로필 이미지 수정
  async updateUserProfileImage({ commit, dispatch }, profileImage) {
    try {
      await updateProfileImage(profileImage);

      // 프로필 정보 다시 조회해서 상태 업데이트
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

  // 프로필 이미지 삭제
  async deleteUserProfileImage({ commit, dispatch }) {
    try {
      await deleteProfileImage();

      // 프로필 정보 다시 조회해서 상태 업데이트
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

  // 전체 프로필 수정
  async updateUserProfile({ commit, dispatch }, { userProfile, profileImage }) {
    try {
      await updateProfile(userProfile, profileImage);

      // 프로필 정보 다시 조회해서 상태 업데이트
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

  // 프로필 에러 초기화
  clearProfileError({ commit }) {
    commit("SET_PROFILE_ERROR", null);
  },
};

const mutations = {
  // =============== 기존 mutations ===============

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
    // 🔥 로그아웃 시 프로필 정보도 초기화
    state.userProfile = null;
    state.profileError = null;
  },

  // =============== 새로 추가된 프로필 관련 mutations ===============

  SET_USER_PROFILE(state, profileData) {
    state.userProfile = profileData;
  },

  SET_PROFILE_LOADING(state, loading) {
    state.profileLoading = loading;
  },

  SET_PROFILE_ERROR(state, error) {
    state.profileError = error;
  },

  // 개별 필드 업데이트용 (필요시 사용)
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
