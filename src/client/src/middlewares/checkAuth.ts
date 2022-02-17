import store from "@/store";
import { NavigationGuardNext, Route } from "vue-router";
import axios from "axios";
import api from "@/api";

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
  return true;
};
const checkAuth = async (to: Route, from: Route, next: NavigationGuardNext) => {
  if (to.path == "/login" || to.path == "/verification_code") return next("/");
  if (to.path.startsWith("/chat/channel/")) return next(); // TODO WTF????
  if (
    to.meta &&
    to.meta.hasOwnProperty("requiresAuth") &&
    !to.meta.requiresAuth
  ) {
    console.log("111");
    return next();
  }
  let authLog = await isAuthenticated();
  // console.log("OK");
  if (authLog) {
    console.log("OKK");
    return next();
  } else {
    console.log("DOKK");
    return next("/login");
  }
  console.log("OKDK");
};

export default checkAuth;
