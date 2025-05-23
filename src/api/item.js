import axios from "axios";

const itemApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Content-Type": "application/json",
  },
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
