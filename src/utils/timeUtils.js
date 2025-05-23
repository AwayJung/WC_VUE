export const timeUtilsMixin = {
  methods: {
    formatTimeAgo(date) {
      if (!date) return "시간 정보 없음";

      const now = new Date();
      const postDate = new Date(date);

      // 유효하지 않은 날짜 체크
      if (isNaN(postDate.getTime())) return "시간 정보 없음";

      const diffInSeconds = Math.floor((now - postDate) / 1000);

      // 1분 미만
      if (diffInSeconds < 60) {
        return "방금 전";
      }

      // 1시간 미만 (분 단위)
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
      }

      // 1일 미만 (시간 단위)
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
      }

      // 1주일 미만 (일 단위)
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}일 전`;
      }

      // 1주일 이상은 날짜 형식으로
      return postDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    // 추가로 필요한 시간 관련 메서드들
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
