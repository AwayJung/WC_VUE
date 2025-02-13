import Vue from "vue";
import VueRouter from "vue-router";
import ChatRoom from "@/views/ChatRoom.vue";
import MainPage from "@/views/MainPage.vue";
import ChatList from "@/views/ChatList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainPage,
  },
  {
    path: "/chat/room/:roomId/:itemId",
    name: "ChatRoom",
    component: ChatRoom,
    props: true,
  },
  {
    path: "/chat/:userId",
    name: "ChatRoomList",
    component: ChatList,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
