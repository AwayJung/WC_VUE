import axios from "axios";

const categoryApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Content-Type": "application/json",
  },
});

export default {
  getCategories() {
    return categoryApi.get("/api/categories/");
  },
};
