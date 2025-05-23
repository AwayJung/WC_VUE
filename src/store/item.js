import {
  createItem,
  getItem,
  getItemList,
  updateItem,
  deleteItem,
  getItemsByCategory,
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
  // 현재 아이템의 찜하기 상태 getter 수정
  getCurrentItemLikeStatus: (state) => {
    if (!state.currentItem || !state.currentItem.data) return false;
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
  // 찜하기 상태 업데이트 뮤테이션 개선
  UPDATE_ITEM_LIKE_STATUS(state, isLiked) {
    if (state.currentItem) {
      // data 프로퍼티가 있는 경우
      if (state.currentItem.data) {
        state.currentItem.data.isLiked = isLiked;
      }

      // 루트 레벨에도 isLiked 속성이 있을 수 있음
      state.currentItem.isLiked = isLiked;

      // 아이템 목록에서도 해당 아이템의 찜하기 상태 업데이트
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
      console.error(`${errorMessage}:`, error);
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
  deleteItem: async ({ commit }, itemId) => {
    commit("SET_LOADING", true);
    try {
      await deleteItem(itemId);
      commit("SET_CURRENT_ITEM", null); // 삭제 후 currentItem을 null로 설정
      return true;
    } catch (error) {
      commit("SET_ERROR", "아이템 삭제에 실패했습니다.");
      console.error("아이템 삭제에 실패했습니다:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // 찜하기 상태 업데이트 액션 개선
  updateItemLikeStatus({ commit, state }, isLiked) {
    console.log("item 모듈 updateItemLikeStatus 호출됨, 상태:", isLiked);

    // currentItem이 존재하는 경우에만 업데이트
    if (state.currentItem) {
      commit("UPDATE_ITEM_LIKE_STATUS", isLiked);

      // 좋아요 수 업데이트 (선택적)
      if (
        state.currentItem.data &&
        state.currentItem.data.likeCount !== undefined
      ) {
        const currentLikeCount = state.currentItem.data.likeCount || 0;
        // 찜하기 상태가 true로 변경되면 +1, false로 변경되면 -1
        const newLikeCount = isLiked
          ? currentLikeCount + 1
          : Math.max(0, currentLikeCount - 1);
        state.currentItem.data.likeCount = newLikeCount;
      }

      return true;
    }
    return false;
  },
  // 카테고리별 아이템 목록 조회 액션 추가
  fetchItemsByCategory: createActionHandler(
    (categoryId) => getItemsByCategory(categoryId),
    "카테고리별 아이템을 불러오는데 실패했습니다.",
    "SET_ITEMS"
  ),

  // 카테고리 설정 액션
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
