import Vue from "vue";

const state = {
  rooms: [],
  currentRoom: null,
  messages: {},
  users: {},
};

const mutations = {
  SET_ROOMS(state, rooms) {
    state.rooms = rooms;
  },
  SET_CURRENT_ROOM(state, roomId) {
    state.currentRoom = roomId;
  },
  ADD_MESSAGE(state, { roomId, message }) {
    if (!state.messages[roomId]) {
      Vue.set(state.messages, roomId, []);
    }
    state.messages[roomId].push(message);
  },
  SET_USERS(state, { roomId, users }) {
    Vue.set(state.users, roomId, users);
  },
};

const actions = {
  joinRoom({ commit }, roomId) {
    commit("SET_CURRENT_ROOM", roomId);
  },
  sendMessage({ commit }, { roomId, message }) {
    commit("ADD_MESSAGE", {
      roomId,
      message: {
        id: Date.now(),
        content: message,
        sender: "user",
        timestamp: new Date().toISOString(),
      },
    });
  },
  updateUsers({ commit }, { roomId, users }) {
    commit("SET_USERS", { roomId, users });
  },
};

const getters = {
  currentRoomMessages: (state) => {
    return state.currentRoom ? state.messages[state.currentRoom] || [] : [];
  },
  currentRoomUsers: (state) => {
    return state.currentRoom ? state.users[state.currentRoom] || [] : [];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
