export const getItemImageUrl = (item) => {
  if (!item) {
    return getPlaceholderImage();
  }

  let imagePath = null;

  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    imagePath = item.images[0];
  } else if (item.image) {
    imagePath = item.image;
  } else if (item.imageUrl) {
    imagePath = item.imageUrl;
  } else if (item.data) {
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

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return getPlaceholderImage();
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = process.env.VUE_APP_API_BASE_URL || "http://localhost:8080";

  let normalizedPath = imagePath;

  if (normalizedPath.startsWith("/")) {
    return `${baseUrl}${normalizedPath}`;
  } else {
    return `${baseUrl}/${normalizedPath}`;
  }
};

export const getPlaceholderImage = () => {
  return require("@/assets/images/default-placeholder.png");
};

export const handleImageError = (event) => {
  const img = event.target;

  if (img.src.includes("default-placeholder.png")) {
    return;
  }

  console.warn("이미지 로드 실패:", img.src);

  img.src = require("@/assets/images/default-placeholder.png");
  img.alt = "이미지 없음";
};
