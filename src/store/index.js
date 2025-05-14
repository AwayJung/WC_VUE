import Vue from "vue";
import Vuex from "vuex";
import chat from "./chat";
import item from "./item";
import itemLike from "./itemLike";
import auth from './auth';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chat,
    item,
    itemLike,
    auth
  },
  plugins: [
    createPersistedState({
      paths: ['auth.accessToken', 'auth.refreshToken', 'auth.user', 'auth.isAuthenticated']
    })
  ]
});
