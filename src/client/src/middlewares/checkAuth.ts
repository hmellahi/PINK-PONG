import store from "@/store";
import { NavigationGuardNext, Route } from "vue-router";
import axios from "axios";

const isAuthenticated = async () => {
  // store.state.User.isAuthenticated
  let data:any;
  try {
    data = await axios({
      method: "get",
      url: "http://127.0.0.1:3000/api/users/me",
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:5000/",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (err) {
    // console.log("erro happens");
    // return false;
  }
  // store.commit("User/setUser", data.data);
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
