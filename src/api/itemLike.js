import axios from "axios";
import store from "@/store";

// 서버 URL 설정
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

// 요청 인터셉터 추가 - 모든 요청에 자동으로 헤더 추가
apiClient.interceptors.request.use(
  (config) => {
    // auth 모듈에서 사용자 정보 가져오기
    const user = store.getters["auth/currentUser"];
    const accessToken = store.state.auth.accessToken;

    if (user && user.userId) {
      config.headers.userId = user.userId;
    }

    // 인증 토큰이 있으면 Authorization 헤더 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 - 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        await store.dispatch("auth/refreshToken");

        // 갱신된 토큰으로 원래 요청 재시도
        const newAccessToken = store.state.auth.accessToken;
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        store.dispatch("auth/logout");
      }
    }

    return Promise.reject(error);
  }
);

export default {
  // 찜하기 토글 요청
  toggleLike(itemId) {
    return apiClient.post(`/api/items/${itemId}/like`);
  },

  // 내 찜 목록 조회
  getMyLikes() {
    return apiClient.get("/api/items/my-likes");
  },

  // 아이템 좋아요 상태 확인
  getItemLikeStatus(itemId) {
    return apiClient.get(`/api/items/${itemId}/like-status`);
  },
};
