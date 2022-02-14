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
  if (
    !to.matched.some(
      (record) =>
        record.meta.requiresAuth || !record.meta.hasOwnProperty("requiresAuth")
    )
  )
    return next();
  let authLog = await isAuthenticated();
  if (authLog) return next();
  return next("/login");
};

export default checkAuth;
