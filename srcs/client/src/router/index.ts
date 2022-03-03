import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../pages/Home.vue";
import notFound from "../pages/notFound.vue";
import Settings from "@/pages/User/Settings.vue";
import LeaderBoard from "@/pages/Game/LeaderBoard.vue";
import Profile from "@/pages/User/Profile.vue";
import Friends from "@/pages/User/Friends/index.vue";
import Play from "@/pages/Game/Play.vue";
import MatchHistory from "@/pages/Game/MatchHistory.vue";
import VerificationCode from "@/pages/Login/VerificationCode.vue";
import Auth from "@/pages/Login/Auth.vue";
import FindMatch from "@/pages/Game/FindMatch.vue";
import blockedUsers from "@/pages/User/Friends/blockedUsers.vue";
import AddFriends from "@/pages/User/Friends/add.vue";
import requests from "@/pages/User/Friends/Requests.vue";
import store from "@/store";
import listFriends from "@/pages/User/Friends/listFriends.vue";

import Chat from "@/pages/Chat/index.vue";
import listChannels from "@/pages/Chat/listChannels.vue";
import createChannel from "@/pages/Chat/CreateChannel.vue";
import EditChannel from "@/pages/Chat/editChannel.vue";
import checkAuth from "@/middlewares/checkAuth";
import conversations from "@/pages/Chat/dms.vue";
import directMessage from "@/pages/Chat/directMessage.vue";
import Game from "@/common/components/Game/Game.vue";
import Games from "@/pages/Game/Games.vue";
import channelRoom from "@/pages/Chat/channelRoom.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Play,
  },
  {
    path: "/verification_code",
    name: "verification_code",
    component: VerificationCode,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/leaderBoard",
    name: "LeaderBoard",
    component: LeaderBoard,
  },
  {
    path: "/game",
    name: "game",
    component: Game,
  },
  {
    path: "/games",
    name: "games",
    component: Games,
  },
  {
    path: "/profile/mine",
    name: "profile/mine",
    component: Profile,
  },
  {
    path: "/profile/:login",
    name: "profile",
    component: Profile,
  },
  {
    path: "/friends",
    component: Friends,
    children: [
      {
        path: "add",
        component: AddFriends,
      },
      {
        path: "",
        component: listFriends,
      },
      {
        path: "blocked",
        component: blockedUsers,
      },
      {
        path: "requests",
        component: requests,
      },
    ],
  },
  {
    path: "/chat",
    component: Chat,
    children: [
      {
        path: "create",
        component: createChannel,
      },
      {
        path: "DirectMessages",
        component: conversations,
      },
      {
        path: "",
        component: listChannels,
      },
      {
        path: "private",
        component: listChannels,
      },
    ],
  },
  {
    path: "/chat/edit/:name",
    component: EditChannel,
  },
  {
    path: "/chat/channel/:name",
    component: channelRoom,
    name: "createChannel",
  },
  {
    path: "/chat/dms/:id",
    component: directMessage,
  },
  {
    path: "/find_match",
    name: "find_match",
    component: FindMatch,
  },
  {
    path: "/login",
    name: "auth",
    component: Auth,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "*",
    component: notFound,
    name: "not found",
    meta: {
      requiresAuth: false,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkExactActiveClass: "active",
});

router.beforeEach(async (to, from, next) => {
  return await checkAuth(to, from, next);
});

export default router;
