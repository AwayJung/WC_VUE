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

export const login = (loginData) => {
  return loginApi.post("/api/users/login", loginData);
};

export const signupUser = (signupData) => {
  return loginApi.post("/api/users/signup", signupData);
};

export const getUserProfile = () => {
  return loginApi.get("/api/users/profile");
};

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

export const uploadProfileImage = (profileImage) => {
  const formData = new FormData();
  formData.append("profileImage", profileImage);

  return loginApi.post("/api/users/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProfileImage = (profileImage) => {
  const formData = new FormData();
  formData.append("profileImage", profileImage);

  return loginApi.put("/api/users/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProfileImage = () => {
  return loginApi.delete("/api/users/profile-image");
};

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

export const updateIntroduction = (introduction) => {
  return loginApi.put("/api/users/introduction", {
    introduction: introduction,
  });
};

export const deleteIntroduction = () => {
  return loginApi.delete("/api/users/introduction");
};

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

loginApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/login") &&
      !originalRequest.url.endsWith("/refresh") &&
      !originalRequest.url.endsWith("/logout")
    ) {
      originalRequest._retry = true;

      try {
        await store.dispatch("auth/refreshToken");
        originalRequest.headers.Authorization = `Bearer ${store.state.auth.accessToken}`;
        return loginApi(originalRequest);
      } catch (refreshError) {
        store.dispatch("auth/logout");

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
