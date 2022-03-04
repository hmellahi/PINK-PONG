import store from "@/store";
import { NavigationGuardNext, Route } from "vue-router";
import axios from "axios";
import api from "@/api";
import VueCookies from "vue-cookies";

const isAuthenticated = async () => {
  // store.state.User.isAuthenticated
  let data: any;
  try {
    data = await api.get("users/me");
  } catch (err) {
    try {
      await api.get("auth/refresh");
      data = await api.get("users/me");
    } catch (err) {
      return false;
    }
  }
  store.commit("User/setUser", data.data);
  store.dispatch("User/connectToGameSocket", VueCookies);
  // store.dispatch("Chat/connectToChatSocket", VueCookies);
  return true;
};
const checkAuth = async (to: Route, from: Route, next: NavigationGuardNext) => {
  // if (to.path.startsWith("/chat")) {
  //   store.dispatch("User/connectToGameSocket", VueCookies);
  //   return next();
  // }
  let authLog = true;

  if (
    to.meta &&
    to.meta.hasOwnProperty("requiresAuth") &&
    !to.meta.requiresAuth
  ) {
    if (
      (authLog = await isAuthenticated()) &&
      (to.path == "/login" || to.path == "/verification_code")
    )
      return next("/");
    return next();
  }
  // console.log({ user: store.getters["User/getCurrentUser"] });
  // if (!store.state.User.isAuthenticated) {
  // if (to.path.startsWith("/chat")) return next();
  authLog = await isAuthenticated();
  // '
  // console.log("OK");
  if (authLog) {
    return next();
  } else {
    return next("/login");
  }
};

export default checkAuth;
