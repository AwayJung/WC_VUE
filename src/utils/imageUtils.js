/**
 * 이미지 URL을 절대 경로로 변환하는 유틸리티 함수
 */

/**
 * 아이템 객체에서 이미지 URL 추출 및 변환
 * @param {Object} item - 아이템 객체
 * @returns {string} - 절대 이미지 URL
 */
export const getItemImageUrl = (item) => {
  if (!item) {
    return getPlaceholderImage();
  }

  // 이미지 우선순위: images[0] > image > imageUrl > thumbnail
  let imagePath = null;

  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    imagePath = item.images[0];
  } else if (item.image) {
    imagePath = item.image;
  } else if (item.imageUrl) {
    imagePath = item.imageUrl;
  } else if (item.data) {
    // data 객체에서도 확인
    if (
      item.data.images &&
      Array.isArray(item.data.images) &&
      item.data.images.length > 0
    ) {
      imagePath = item.data.images[0];
    } else if (item.data.image) {
      imagePath = item.data.image;
    } else if (item.data.imageUrl) {
      imagePath = item.data.imageUrl;
    }
  }

  return imagePath ? getImageUrl(imagePath) : getPlaceholderImage();
};

/**
 * 상대 이미지 경로를 절대 경로로 변환
 * @param {string} imagePath - 이미지 경로
 * @returns {string} - 절대 이미지 URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return getPlaceholderImage();
  }

  // 이미 절대 경로인 경우 그대로 반환
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = process.env.VUE_APP_API_BASE_URL || "http://localhost:8080";

  // 이미지 경로 정규화
  let normalizedPath = imagePath;

  if (normalizedPath.startsWith("/")) {
    return `${baseUrl}${normalizedPath}`;
  } else {
    return `${baseUrl}/${normalizedPath}`;
  }
};

/**
 * 플레이스홀더 이미지 URL 반환 (로컬 이미지만 사용)
 * @returns {string} - 플레이스홀더 이미지 URL
 */
export const getPlaceholderImage = () => {
  return require("@/assets/images/default-placeholder.png");
};

/**
 * 이미지 로드 에러 처리 핸들러 (로컬 이미지만 사용)
 * @param {Event} event - 이미지 로드 에러 이벤트
 */
export const handleImageError = (event) => {
  const img = event.target;

  // 이미 로컬 placeholder로 변경된 경우 무한 루프 방지
  if (img.src.includes("default-placeholder.png")) {
    return;
  }

  console.warn("이미지 로드 실패:", img.src);

  // 로컬 placeholder 이미지로 변경
  img.src = require("@/assets/images/default-placeholder.png");
  img.alt = "이미지 없음";
};
