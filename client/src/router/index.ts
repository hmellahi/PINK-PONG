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
import Game from "@/pages/Game/pingpong.vue";
import channelRoom from "@/pages/Chat/channelRoom.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      // requiresAuth: false,
    },
  },
  {
    path: "/verification_code",
    name: "verification_code",
    component: VerificationCode,
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
    path: "/profile/:username",
    name: "profile",
    component: Profile,
  },
  {
    path: "/game",
    name: "game",
    component: Game,
  },
  {
    path: "/profile/mine",
    name: "profile/mine",
    component: Profile,
  },
  {
    path: "/friends",
    // name: "friends",
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
    path: "/play",
    name: "play",
    component: Play,
  },
  {
    path: "/chat",
    // name: "chat",
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
    ],
  },
  {
    path: "/chat/edit/:name",
    component: EditChannel,
  },
  {
    path: "/chat/channel/:name",
    component: channelRoom,
  },
  // {
  //   path: "/match_history",
  //   name: "match_history",
  //   component: MatchHistory,
  // },
  {
    path: "/find_match",
    name: "find_match",
    component: FindMatch,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "auth",
    component: Auth,
    meta: {
      requiresAuth: false,
    },
  },
  { path: "*", component: notFound, name: "not found" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("to", to, from);
  return checkAuth(to, from, next);
});

// router.beforeEach((to, from, next) => {
//   console.log("new", to, from);
//   return next();
// });

export default router;
