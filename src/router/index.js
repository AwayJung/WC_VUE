import Vue from "vue";
import VueRouter from "vue-router";
import Chat from "@/views/Chat.vue";
import ChatRoom from "@/views/ChatRoom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/chat/room/:roomId",
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
  base: process.env.BASE_URL,
  routes,
});

export default router;
