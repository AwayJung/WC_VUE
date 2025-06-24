import axios from "axios";
import store from "@/store";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

apiClient.interceptors.request.use(
  (config) => {
    const user = store.getters["auth/currentUser"];
    const accessToken = store.state.auth.accessToken;

    if (user?.userId) {
      config.headers.userId = user.userId;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await store.dispatch("auth/refreshToken");

        const newAccessToken = store.state.auth.accessToken;
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch("auth/logout");
      }
    }

    return Promise.reject(error);
  }
);

export default {
  toggleLike(itemId) {
    return apiClient.post(`/api/items/${itemId}/like`);
  },

  getMyLikes() {
    return apiClient.get("/api/items/my-likes");
  },

  getItemLikeStatus(itemId) {
    return apiClient.get(`/api/items/${itemId}/like-status`);
  },
};
