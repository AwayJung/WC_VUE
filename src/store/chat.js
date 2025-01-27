import axios from "axios";

// axios 인스턴스 생성
const chatApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Content-Type": "application/json",
  },
});

const state = {
  rooms: [],
  currentRoom: null,
  messages: [],
};

const mutations = {
  SET_ROOMS(state, rooms) {
    console.log("Setting rooms in state:", rooms);
    state.rooms = rooms || [];
  },
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
};

const actions = {
  async fetchUserRooms({ commit }, userId) {
    try {
      console.log("Fetching rooms for userId:", userId);
      const response = await chatApi.get(`/api/chat/user/${userId}`);
      console.log("API Response:", response);

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
      const response = await chatApi.get(`/api/chat/rooms/${roomId}`);
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
