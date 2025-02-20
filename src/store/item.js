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

const actions = {
  async createItem({ commit }, itemData) {
    commit("SET_LOADING", true);
    try {
      const response = await createItem(itemData);
      commit("SET_CURRENT_ITEM", response.data.data);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", "아이템 생성에 실패했습니다.");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchItem({ commit }, itemId) {
    commit("SET_LOADING", true);
    try {
      const response = await getItem(itemId);
      commit("SET_CURRENT_ITEM", response.data.data);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", "아이템을 불러오는데 실패했습니다.");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchItems({ commit }) {
    commit("SET_LOADING", true);
    try {
      const response = await getItemList();
      commit("SET_ITEMS", response.data.data);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", "아이템 목록을 불러오는데 실패했습니다.");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async updateItem({ commit }, { itemId, itemData }) {
    commit("SET_LOADING", true);
    try {
      const response = await updateItem(itemId, itemData);
      commit("SET_CURRENT_ITEM", response.data.data);
      return response.data.data;
    } catch (error) {
      commit("SET_ERROR", "아이템 수정에 실패했습니다.");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async deleteItem({ commit }, itemId) {
    commit("SET_LOADING", true);
    try {
      await deleteItem(itemId);
      commit("SET_CURRENT_ITEM", null);
    } catch (error) {
      commit("SET_ERROR", "아이템 삭제에 실패했습니다.");
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
