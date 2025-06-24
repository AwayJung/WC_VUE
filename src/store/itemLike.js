import Vue from "vue";
import itemLikeApi from "../api/itemLike";

const state = {
  likedItems: [],
  currentItemLiked: false,
};

const mutations = {
  SET_LIKED_ITEMS(state, items) {
    state.likedItems = items.map((item) => ({
      ...item,
      likeCount: item.likeCount || 0,
      isLiked: true,
    }));
  },

  SET_CURRENT_ITEM_LIKED(state, isLiked) {
    state.currentItemLiked = isLiked;
  },

  UPDATE_ITEM_LIKE_STATUS(state, { itemId, isLiked }) {
    const itemIndex = state.likedItems.findIndex(
      (item) => item.itemId === itemId
    );

    if (itemIndex !== -1) {
      const item = state.likedItems[itemIndex];

      const updatedItem = {
        ...item,
        isLiked: isLiked,
        likeCount: isLiked
          ? (item.likeCount || 0) + 1
          : Math.max((item.likeCount || 1) - 1, 0),
      };

      Vue.set(state.likedItems, itemIndex, updatedItem);
    }

    if (!isLiked && itemIndex !== -1) {
      state.likedItems.splice(itemIndex, 1);
    }
  },

  CLEAR_LIKED_ITEMS(state) {
    state.likedItems = [];
    state.currentItemLiked = false;
  },
};

const getters = {
  isUserAuthenticated: (state, getters, rootState) => {
    return rootState.auth.isAuthenticated;
  },

  currentUser: (state, getters, rootState) => {
    return rootState.auth.user;
  },

  likedItemsCount: (state) => {
    return state.likedItems.length;
  },

  isItemLiked: (state) => (itemId) => {
    return state.likedItems.some((item) => item.itemId === itemId);
  },
};

const actions = {
  async checkAuthAndExecute({ getters, dispatch }, actionCallback) {
    if (!getters.isUserAuthenticated) {
      console.warn("사용자가 인증되지 않았습니다. 로그인이 필요합니다.");
      throw new Error("LOGIN_REQUIRED");
    }

    try {
      return await actionCallback();
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("인증이 만료되었습니다. 다시 로그인해주세요.");
        await dispatch("auth/logout", null, { root: true });
        throw new Error("AUTH_EXPIRED");
      }
      throw error;
    }
  },

  async toggleItemLike({ commit, dispatch }, itemId) {
    return dispatch("checkAuthAndExecute", async () => {
      const response = await itemLikeApi.toggleLike(itemId);
      const isLiked = response.data.data;

      commit("SET_CURRENT_ITEM_LIKED", isLiked);
      commit("UPDATE_ITEM_LIKE_STATUS", { itemId, isLiked });
      dispatch("item/updateItemLikeStatus", isLiked, { root: true });

      return isLiked;
    });
  },

  async fetchMyLikes({ commit, dispatch }) {
    return dispatch("checkAuthAndExecute", async () => {
      const response = await itemLikeApi.getMyLikes();
      const likedItems = response.data.data || [];
      commit("SET_LIKED_ITEMS", likedItems);
      return likedItems;
    });
  },

  async checkItemLikeStatus({ commit, dispatch, getters }, itemId) {
    if (!getters.isUserAuthenticated) {
      commit("SET_CURRENT_ITEM_LIKED", false);
      dispatch("item/updateItemLikeStatus", false, { root: true });
      return false;
    }

    return dispatch("checkAuthAndExecute", async () => {
      const response = await itemLikeApi.getItemLikeStatus(itemId);

      let isLiked = false;

      if (typeof response.data === "boolean") {
        isLiked = response.data;
      } else if (typeof response.data.data === "boolean") {
        isLiked = response.data.data;
      } else if (typeof response.data.data === "number") {
        isLiked = response.data.data === 1;
      } else if (
        typeof response.data.data === "object" &&
        response.data.data !== null
      ) {
        if ("isLiked" in response.data.data) {
          isLiked = Boolean(response.data.data.isLiked);
        } else if ("liked" in response.data.data) {
          isLiked = Boolean(response.data.data.liked);
        }
      }

      commit("SET_CURRENT_ITEM_LIKED", isLiked);
      dispatch("item/updateItemLikeStatus", isLiked, { root: true });

      return isLiked;
    });
  },

  clearLikedItems({ commit }) {
    commit("CLEAR_LIKED_ITEMS");
  },

  async refreshLikedItems({ dispatch, getters }) {
    if (getters.isUserAuthenticated) {
      try {
        await dispatch("fetchMyLikes");
      } catch (error) {
        console.error("찜 목록 새로고침 실패:", error);
      }
    } else {
      dispatch("clearLikedItems");
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
