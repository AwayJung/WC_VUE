import axios from "axios";

// 서버 URL 설정
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

export default {
  // 찜하기 토글 요청
  toggleLike(itemId) {
    return apiClient.post(
      `/api/items/${itemId}/like`,
      {},
      {
        headers: { userId: "3" },
      }
    );
  },

  // 내 찜 목록 조회
  getMyLikes() {
    return apiClient.get("/api/items/my-likes", {
      headers: { userId: "3" },
    });
  },

  // 아이템 좋아요 상태 확인
  getItemLikeStatus(itemId) {
    return apiClient.get(`/api/items/${itemId}/like-status`, {
      headers: { userId: "3" },
    });
  },
};
