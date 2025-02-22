import {
  createItem,
  getItem,
  getItemList,
  updateItem,
  deleteItem,
} from "../api/item";

const state = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

const getters = {
  getCurrentItem: (state) => state.currentItem,
  getLoading: (state) => state.loading,
  getError: (state) => state.error,
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
};

// 공통 action 핸들러
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
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  };

const actions = {
  // 아이템 생성
  createItem: createActionHandler(
    (itemData) => createItem(itemData),
    "아이템 생성에 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),

  // 단일 아이템 조회
  fetchItem: createActionHandler(
    (itemId) => getItem(itemId),
    "아이템을 불러오는데 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),

  // 아이템 목록 조회
  fetchItems: createActionHandler(
    () => getItemList(),
    "아이템 목록을 불러오는데 실패했습니다.",
    "SET_ITEMS"
  ),

  // 아이템 수정
  updateItem: createActionHandler(
    ({ itemId, itemData }) => updateItem(itemId, itemData),
    "아이템 수정에 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),

  // 아이템 삭제
  deleteItem: createActionHandler(
    (itemId) => deleteItem(itemId),
    "아이템 삭제에 실패했습니다.",
    "SET_CURRENT_ITEM"
  ),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
