// itemLike.js 스토어 모듈 수정본

import Vue from "vue";
import itemLikeApi from "../api/itemLike";

const state = {
  likedItems: [],
  currentItemLiked: false,
};

const mutations = {
  SET_LIKED_ITEMS(state, items) {
    // API에서 받은 각 아이템에 기본값 설정
    state.likedItems = items.map((item) => ({
      ...item,
      likeCount: item.likeCount || 0, // likeCount가 없으면 0으로 초기화
      isLiked: true, // 찜 목록에 있는 아이템은 기본적으로 isLiked = true
    }));
  },

  SET_CURRENT_ITEM_LIKED(state, isLiked) {
    state.currentItemLiked = isLiked;
  },

  UPDATE_ITEM_LIKE_STATUS(state, { itemId, isLiked }) {
    // likedItems 배열에서 해당 아이템 찾기
    const itemIndex = state.likedItems.findIndex(
      (item) => item.itemId === itemId
    );

    if (itemIndex !== -1) {
      // 기존 아이템 객체
      const item = state.likedItems[itemIndex];

      // 새 객체를 생성하여 반응성 보장
      const updatedItem = {
        ...item,
        isLiked: isLiked,
        likeCount: isLiked
          ? (item.likeCount || 0) + 1
          : Math.max((item.likeCount || 1) - 1, 0),
      };

      // Vue.set을 사용하여 배열 항목 교체 (반응성 보장)
      Vue.set(state.likedItems, itemIndex, updatedItem);
    }

    // 찜 취소된 경우 (isLiked가 false) 해당 아이템을 likedItems에서 제거
    if (!isLiked && itemIndex !== -1) {
      state.likedItems.splice(itemIndex, 1);
    }
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

        // 현재 아이템 좋아요 상태 업데이트
        commit("SET_CURRENT_ITEM_LIKED", isLiked);

        // 목록 내 해당 아이템의 좋아요 상태와 카운트 업데이트
        commit("UPDATE_ITEM_LIKE_STATUS", { itemId, isLiked });

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
      console.log("찜 목록 API 응답:", response.data);
      // 데이터 유효성 체크와 로깅 추가
      const likedItems = response.data.data || [];
      console.log("불러온 찜 목록:", likedItems);

      // 각 아이템의 필드 로깅
      likedItems.forEach((item, index) => {
        console.log(`아이템 ${index}:`, item);
        console.log(`  - itemId: ${item.itemId}`);
        console.log(`  - likeCount: ${item.likeCount}`);
        console.log(`  - isLiked: ${item.isLiked}`);
      });

      commit("SET_LIKED_ITEMS", likedItems);
      return likedItems;
    });
  },

  // 현재 아이템 찜 상태 확인
  checkItemLikeStatus({ commit, dispatch }, itemId) {
    return itemLikeApi.getItemLikeStatus(itemId).then((response) => {
      console.log("아이템 찜 상태 API 응답:", response.data);

      // data가 객체인지 boolean인지 확인하고 적절히 처리
      let isLiked;
      if (typeof response.data.data === "boolean") {
        isLiked = response.data.data;
      } else if (response.data.data && typeof response.data.data === "object") {
        isLiked = response.data.data.liked || false;
      } else {
        isLiked = false;
      }

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
