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
    console.log("===== itemLike/toggleItemLike 액션 시작 =====");

    return itemLikeApi
      .toggleLike(itemId)
      .then((response) => {
        const isLiked = response.data.data;
        console.log("찜하기 상태:", isLiked);

        // 현재 아이템 좋아요 상태 업데이트
        commit("SET_CURRENT_ITEM_LIKED", isLiked);

        // 목록 내 해당 아이템의 좋아요 상태와 카운트 업데이트
        commit("UPDATE_ITEM_LIKE_STATUS", { itemId, isLiked });

        // item 모듈의 currentItem.data.isLiked 업데이트
        dispatch("item/updateItemLikeStatus", isLiked, { root: true });

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

      const likedItems = response.data.data || [];
      console.log("불러온 찜 목록:", likedItems);

      commit("SET_LIKED_ITEMS", likedItems);
      return likedItems;
    });
  },

  // 특정 아이템 찜 상태 확인
  checkItemLikeStatus({ commit, dispatch }, itemId) {
    return itemLikeApi.getItemLikeStatus(itemId).then((response) => {
      console.log("아이템 찜 상태 API 응답:", response.data);

      // 응답 데이터 분석
      let isLiked = false;

      // 1. 직접 boolean으로 오는 경우
      if (typeof response.data === "boolean") {
        isLiked = response.data;
      }
      // 2. data 속성에 boolean으로 오는 경우
      else if (typeof response.data.data === "boolean") {
        isLiked = response.data.data;
      }
      // 3. data 속성에 숫자로 오는 경우 (1이면 true)
      else if (typeof response.data.data === "number") {
        isLiked = response.data.data === 1;
      }
      // 4. data 속성이 객체인 경우
      else if (
        typeof response.data.data === "object" &&
        response.data.data !== null
      ) {
        // isLiked 속성이 있는 경우
        if ("isLiked" in response.data.data) {
          isLiked = Boolean(response.data.data.isLiked);
        }
        // liked 속성이 있는 경우
        else if ("liked" in response.data.data) {
          isLiked = Boolean(response.data.data.liked);
        }
      }

      console.log("파싱된 isLiked 값:", isLiked);

      // 현재 아이템 좋아요 상태 업데이트
      commit("SET_CURRENT_ITEM_LIKED", isLiked);

      // item 모듈의 currentItem.data.isLiked 업데이트
      dispatch("item/updateItemLikeStatus", isLiked, { root: true });

      return isLiked;
    });
  },

  // checkItemLikeStatus({ commit, dispatch }, itemId) {
  //   return itemLikeApi.getItemLikeStatus(itemId).then((response) => {
  //     console.log("아이템 찜 상태 API 응답:", response.data);

  //     let isLiked;
  //     if (typeof response.data.data === "boolean") {
  //       isLiked = response.data.data;
  //     } else if (response.data.data && typeof response.data.data === "object") {
  //       isLiked = response.data.data.liked || false;
  //     } else {
  //       isLiked = false;
  //     }

  //     commit("SET_CURRENT_ITEM_LIKED", isLiked);

  //     // item 모듈의 currentItem.data.isLiked 업데이트 위해 추가
  //     dispatch("item/updateItemLikeStatus", isLiked, { root: true });

  //     return response.data.data;
  //   });
  // },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
