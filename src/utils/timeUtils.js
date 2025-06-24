export const timeUtilsMixin = {
  methods: {
    formatTimeAgo(date) {
      if (!date) return "시간 정보 없음";

      const now = new Date();
      const postDate = new Date(date);

      if (isNaN(postDate.getTime())) return "시간 정보 없음";

      const diffInSeconds = Math.floor((now - postDate) / 1000);

      if (diffInSeconds < 60) {
        return "방금 전";
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}일 전`;
      }

      return postDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    formatFullDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
