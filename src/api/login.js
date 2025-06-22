import axios from "axios";
import store from "@/store";
import router from "@/router";

const loginApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Content-Type": "application/json",
  },
});

// =============== 기존 인증 관련 API ===============
export const login = (loginData) => {
  return loginApi.post("/api/users/login", loginData);
};

export const signupUser = (signupData) => {
  return loginApi.post("/api/users/signup", signupData);
};

// =============== 새로 추가된 프로필 관련 API ===============

/**
 * 내 프로필 정보 조회 (프로필 이미지, 자기소개 포함)
 */
export const getUserProfile = () => {
  return loginApi.get("/api/users/profile");
};

/**
 * 프로필 이미지와 함께 회원가입
 * @param {Object} signupData - 회원가입 정보
 * @param {File} profileImage - 프로필 이미지 파일 (선택)
 */
export const signupWithProfileImage = (signupData, profileImage) => {
  const formData = new FormData();
  formData.append("user", JSON.stringify(signupData));
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return loginApi.post("/api/users/signup-with-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 프로필 이미지 업로드/수정
 * @param {File} profileImage - 업로드할 프로필 이미지 파일
 */
export const uploadProfileImage = (profileImage) => {
  const formData = new FormData();
  formData.append("profileImage", profileImage);

  return loginApi.post("/api/users/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 프로필 이미지 수정 (PUT 방식)
 * @param {File} profileImage - 새로운 프로필 이미지 파일
 */
export const updateProfileImage = (profileImage) => {
  const formData = new FormData();
  formData.append("profileImage", profileImage);

  return loginApi.put("/api/users/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * 프로필 이미지 삭제
 */
export const deleteProfileImage = () => {
  return loginApi.delete("/api/users/profile-image");
};

/**
 * 프로필 전체 정보 수정 (이미지 + 기본 정보 + 자기소개)
 * @param {Object} userProfile - 수정할 사용자 정보
 * @param {File} profileImage - 새로운 프로필 이미지 (선택)
 */
export const updateProfile = (userProfile, profileImage) => {
  const formData = new FormData();
  formData.append("user", JSON.stringify(userProfile));
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  return loginApi.put("/api/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =============== 🔥 자기소개 전용 API ===============

/**
 * 자기소개 수정
 * @param {string} introduction - 새로운 자기소개 텍스트
 */
export const updateIntroduction = (introduction) => {
  return loginApi.put("/api/users/introduction", {
    introduction: introduction,
  });
};

/**
 * 자기소개 삭제 (null로 설정)
 */
export const deleteIntroduction = () => {
  return loginApi.delete("/api/users/introduction");
};

// =============== 기존 인터셉터 (변경 없음) ===============

// 요청 인터셉터 - 모든 요청에 토큰 추가
loginApi.interceptors.request.use(
  (config) => {
    const token = store.state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
loginApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 오류이고, 토큰 만료이며, 재시도하지 않은 요청일 경우
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/login") &&
      !originalRequest.url.endsWith("/refresh") &&
      !originalRequest.url.endsWith("/logout")
    ) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        await store.dispatch("auth/refreshToken");

        // 토큰 갱신 성공 시 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${store.state.auth.accessToken}`;
        return loginApi(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        store.dispatch("auth/logout");

        // 현재 경로가 로그인 페이지가 아닐 때만 리디렉션
        if (router.currentRoute.path !== "/login") {
          router.push("/login").catch((err) => {
            if (err.name !== "NavigationDuplicated") {
              console.error(err);
            }
          });
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =============== 비밀번호 관련 API ===============

export const forgotPassword = (email) => {
  return loginApi.post("/api/users/forgot-password", {
    loginEmail: email,
  });
};

export const changePassword = (passwordData) => {
  return loginApi.put("/api/users/change-password", {
    password: passwordData.newPassword,
  });
};

export default loginApi;
