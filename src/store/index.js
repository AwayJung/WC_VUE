import Vue from "vue";
import Vuex from "vuex";
import chat from "./chat";
import item from "./item";
import itemLike from "./itemLike";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    chat,
    item,
    itemLike,
  },
});
