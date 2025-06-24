import axios from "axios";

const itemApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Content-Type": "application/json",
  },
});

itemApi.interceptors.request.use((config) => {
  const vuexData = localStorage.getItem("vuex");
  let token = null;

  if (vuexData) {
    try {
      const parsedData = JSON.parse(vuexData);
      token = parsedData.auth?.accessToken;
    } catch (error) {
      console.error("vuex 데이터 파싱 오류:", error);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createItem = (itemData) => {
  return itemApi.post("/api/items/", itemData);
};

export const getItem = (itemId) => {
  return itemApi.get(`/api/items/${itemId}`);
};

export const getItemList = () => {
  return itemApi.get("/api/items/");
};

export const updateItem = (itemId, itemData) => {
  return itemApi.put(`/api/items/${itemId}`, itemData);
};

export const getItemsByCategory = (categoryId) => {
  return itemApi.get(`/api/items/category/${categoryId}`);
};

export const deleteItem = (itemId) => {
  return itemApi.delete(`/api/items/${itemId}`);
};

export const getItemsOrderByViewCount = () => {
  return itemApi.get("/api/items/popular");
};

export const changeItemStatus = (itemId, status) => {
  return itemApi.put(`/api/items/${itemId}/status`, { status });
};
