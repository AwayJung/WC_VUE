import { fetchUserRooms, fetchMessages } from "../api/chat";

const state = {
  rooms: [],
  currentRoom: null,
  messages: [],
};

const mutations = {
  SET_ROOMS(state, rooms) {
    state.rooms = rooms || [];
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
