import Vue from "vue";
import VueRouter from "vue-router";
import ChatRoom from "@/views/ChatRoom.vue";
import MainPage from "@/views/MainPage.vue";
import ChatList from "@/views/ChatList.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignUp from "@/views/SignUp.vue";

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
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
