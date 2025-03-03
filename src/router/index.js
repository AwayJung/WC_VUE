import Vue from "vue";
import VueRouter from "vue-router";
import ChatRoom from "@/views/Chat/ChatRoom.vue";
import MainPage from "@/views/MainPage.vue";
import ChatList from "@/views/Chat/ChatList.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignUp from "@/views/SignUp.vue";
import ItemCreatePage from "@/views/Item/ItemCreatePage.vue";
import ItemListPage from "@/views/Item/ItemListPage.vue";
import ItemDetailPage from "@/views/Item/ItemDetailPage.vue";
import ItemUpdatePage from "@/views/Item/ItemUpdatePage.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainPage,
  },
  {
    path: "/chat/room/:roomId",
    name: "ChatRoom",
    component: ChatRoom,
    props: (route) => ({
      roomId: route.params.roomId,
      itemId: route.query.itemId,
      userId: route.query.userId,
    }),
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
  {
    path: "/items/create",
    name: "ItemCreate",
    component: ItemCreatePage,
  },
  {
    path: "/items",
    name: "ItemListPage",
    component: ItemListPage,
  },
  {
    path: "/items/:id",
    name: "ItemDetail",
    component: ItemDetailPage,
    props: true,
  },
  {
    path: "/items/update/:id",
    name: "ItemUpdate",
    component: ItemUpdatePage,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
