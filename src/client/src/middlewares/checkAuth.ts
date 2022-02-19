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
  return true;
};
const checkAuth = async (to: Route, from: Route, next: NavigationGuardNext) => {
  // if (to.path == "/login" || to.path == "/verification_code") return next("/");
  if (
    to.meta &&
    to.meta.hasOwnProperty("requiresAuth") &&
    !to.meta.requiresAuth
  ) {
    return next();
  }
  let authLog = true;
  // console.log({ user: store.getters["User/getCurrentUser"] });
  // if (!store.state.User.isAuthenticated) {
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
