import itemLikeApi from "../api/itemLike";

const state = {
  likedItems: [],
  currentItemLiked: false,
};

const mutations = {
  SET_LIKED_ITEMS(state, items) {
    state.likedItems = items;
  },
  SET_CURRENT_ITEM_LIKED(state, isLiked) {
    state.currentItemLiked = isLiked;
  },
};

const actions = {
  toggleItemLike({ commit, dispatch }, itemId) {
    console.log("===== toggleItemLike 액션 시작 =====");
    console.log("아이템 ID:", itemId);

    return itemLikeApi
      .toggleLike(itemId)
      .then((response) => {
        console.log("API 응답:", response);
        console.log("response.data:", response.data);
        console.log("response.data.data:", response.data.data);

        const isLiked = response.data.data;
        console.log("찜하기 상태:", isLiked);

        commit("SET_CURRENT_ITEM_LIKED", isLiked);

        // item 모듈의 currentItem.data.isLiked 업데이트
        console.log("item 모듈에 dispatch 시작");
        dispatch("item/updateItemLikeStatus", isLiked, { root: true });
        console.log("item 모듈에 dispatch 완료");

        return isLiked;
      })
      .catch((error) => {
        console.error("toggleItemLike 액션 에러:", error);
        throw error;
      });
  },

  // 찜 목록 불러오기
  fetchMyLikes({ commit }) {
    return itemLikeApi.getMyLikes().then((response) => {
      commit("SET_LIKED_ITEMS", response.data.data);
      return response.data.data;
    });
  },

  // 현재 아이템 찜 상태 확인
  checkItemLikeStatus({ commit, dispatch }, itemId) {
    return itemLikeApi.getItemLikeStatus(itemId).then((response) => {
      const isLiked = response.data.data.liked || false;
      commit("SET_CURRENT_ITEM_LIKED", isLiked);

      // item 모듈의 currentItem.data.isLiked 업데이트 위해 추가
      dispatch("item/updateItemLikeStatus", isLiked, { root: true });

      return response.data.data;
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
