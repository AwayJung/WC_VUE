import {
  createItem,
  getItem,
  getItemList,
  updateItem,
  deleteItem,
  getItemsByCategory,
  getItemsOrderByViewCount,
  changeItemStatus,
} from "../api/item";

const state = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  selectedCategory: null,
};

const getters = {
  getCurrentItem: (state) => state.currentItem,
  getLoading: (state) => state.loading,
  getError: (state) => state.error,
  getCurrentItemLikeStatus: (state) => {
    if (!state.currentItem?.data) return false;
    return state.currentItem.data.isLiked || false;
  },
  getSelectedCategory: (state) => state.selectedCategory,
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },

  SET_CURRENT_ITEM(state, item) {
    state.currentItem = item;
  },

  SET_LOADING(state, status) {
    state.loading = status;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_SELECTED_CATEGORY(state, categoryId) {
    state.selectedCategory = categoryId;
  },

  UPDATE_ITEM_LIKE_STATUS(state, isLiked) {
    if (state.currentItem) {
      if (state.currentItem.data) {
        state.currentItem.data.isLiked = isLiked;
      }

      state.currentItem.isLiked = isLiked;

      const itemId = state.currentItem.data?.itemId || state.currentItem.id;
      if (itemId && state.items.length > 0) {
        const item = state.items.find(
          (item) => item.id === itemId || item.itemId === itemId
        );
        if (item) {
          item.isLiked = isLiked;
          if (item.data) {
            item.data.isLiked = isLiked;
          }
        }
      }
    }
  },

  UPDATE_ITEM_STATUS(state, { itemId, status }) {
    if (state.currentItem) {
      const currentItemId = state.currentItem.itemId;

      if (currentItemId === itemId) {
        if (state.currentItem.data) {
          state.currentItem.data.status = status;
        }
        state.currentItem.status = status;
      }
    }
  },
};

const createActionHandler =
  (actionFn, errorMessage, commitType = null) =>
  async ({ commit }, payload) => {
    commit("SET_LOADING", true);
    try {
      const response = await actionFn(payload);
      if (commitType) {
        commit(commitType, response.data);
      }
      return response.data;
    } catch (error) {
      commit("SET_ERROR", errorMessage);
      console.error(`${errorMessage}:`, error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  };

const actions = {
  createItem: createActionHandler(
    (itemData) => createItem(itemData),
    "아이템 생성에 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),

  fetchItem: createActionHandler(
    (itemId) => getItem(itemId),
    "아이템을 불러오는데 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),

  fetchItems: createActionHandler(
    () => getItemList(),
    "아이템 목록을 불러오는데 실패했습니다.",
    "SET_ITEMS"
  ),

  async fetchPopularItems({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    try {
      const response = await getItemsOrderByViewCount();
      commit("SET_ITEMS", response.data);
    } catch (error) {
      commit("SET_ERROR", error.message);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  updateItem: createActionHandler(
    ({ itemId, itemData }) => updateItem(itemId, itemData),
    "아이템 수정에 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),

  async deleteItem({ commit }, itemId) {
    commit("SET_LOADING", true);
    try {
      await deleteItem(itemId);
      commit("SET_CURRENT_ITEM", null);
      return true;
    } catch (error) {
      commit("SET_ERROR", "아이템 삭제에 실패했습니다.");
      console.error("아이템 삭제에 실패했습니다:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  updateItemLikeStatus({ commit, state }, isLiked) {
    if (state.currentItem) {
      commit("UPDATE_ITEM_LIKE_STATUS", isLiked);

      if (state.currentItem.data?.likeCount !== undefined) {
        const currentLikeCount = state.currentItem.data.likeCount || 0;
        const newLikeCount = isLiked
          ? currentLikeCount + 1
          : Math.max(0, currentLikeCount - 1);
        state.currentItem.data.likeCount = newLikeCount;
      }

      return true;
    }
    return false;
  },

  async changeItemStatus({ commit }, { itemId, status }) {
    commit("SET_LOADING", true);
    try {
      const response = await changeItemStatus(itemId, status);
      commit("UPDATE_ITEM_STATUS", { itemId, status });
      return response.data;
    } catch (error) {
      console.error("아이템 상태 변경 실패:", error);
      commit("SET_ERROR", "아이템 상태 변경에 실패했습니다.");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  fetchItemsByCategory: createActionHandler(
    (categoryId) => getItemsByCategory(categoryId),
    "카테고리별 아이템을 불러오는데 실패했습니다.",
    "SET_ITEMS"
  ),

  setSelectedCategory({ commit }, categoryId) {
    commit("SET_SELECTED_CATEGORY", categoryId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
