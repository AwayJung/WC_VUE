import Vue from "vue";
import VueRouter from "vue-router";
import Chat from "@/views/Chat.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import MainPage from "@/views/MainPage.vue";

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
    component: Chat,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
