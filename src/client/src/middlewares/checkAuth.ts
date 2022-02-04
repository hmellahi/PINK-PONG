import store from "@/store";
import { NavigationGuardNext, Route } from "vue-router";

const checkAuth = (to: Route, from: Route, next: NavigationGuardNext) => {
  if (
    !to.matched.some(
      (record) =>
        record.meta.requiresAuth || !record.meta.hasOwnProperty("requiresAuth")
    )
  )
    return next();
  if (store.state.User.isAuthenticated) return next();
  return next("/login");
};

export default checkAuth;
