import {
  fetchUserRooms,
  fetchMessages,
  createChatRoom,
  deleteChatRoom,
  fetchUserChatCount,
} from "../api/chat";

const state = {
  rooms: [],
  currentRoom: null,
  messages: [],
  chatCount: 0,
};

const mutations = {
  SET_ROOMS(state, rooms) {
    state.rooms = rooms || [];
  },

  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },

  SET_CHAT_COUNT(state, count) {
    state.chatCount = count;
  },

  REMOVE_ROOM(state, roomId) {
    state.rooms = state.rooms.filter((room) => room.roomId !== roomId);

    if (state.currentRoom && state.currentRoom.roomId === roomId) {
      state.currentRoom = null;
      state.messages = [];
    }

    if (state.chatCount > 0) {
      state.chatCount = state.chatCount - 1;
    }
  },
};

const actions = {
  async fetchUserRooms({ commit }, userId) {
    try {
      const response = await fetchUserRooms(userId);
      const rooms = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      commit("SET_ROOMS", rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      commit("SET_ROOMS", []);
      throw error;
    }
  },

  async fetchMessages({ commit }, roomId) {
    try {
      const response = await fetchMessages(roomId);
      commit("SET_MESSAGES", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      commit("SET_MESSAGES", []);
      throw error;
    }
  },

  async fetchUserChatCount({ commit }, userId) {
    try {
      const response = await fetchUserChatCount(userId);
      const count = response.data.data?.chatCount || 0;
      commit("SET_CHAT_COUNT", count);
      return count;
    } catch (error) {
      console.error("채팅방 개수 조회 실패:", error);
      commit("SET_CHAT_COUNT", 0);
      throw error;
    }
  },

  async createChatRoom({ dispatch }, { itemId, userId }) {
    try {
      const response = await createChatRoom(itemId, userId);
      await dispatch("fetchUserChatCount", userId);
      return response.data;
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      throw error;
    }
  },

  async deleteChatRoom({ commit }, roomId) {
    try {
      const response = await deleteChatRoom(roomId);

      if (response.data.code === 20000) {
        commit("REMOVE_ROOM", roomId);
      }

      return response.data;
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
      throw error;
    }
  },
};

const getters = {
  chatCount: (state) => state.chatCount,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
