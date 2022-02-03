import { Logger } from "@/common/helpers/Logger";
import { FriendsState, UserState } from "@/types/user";
import { ActionContext } from "vuex";

const actions = {
  login({ commit }: ActionContext<UserState, any>) {
    commit("login");
  },
  logout({ commit }: ActionContext<UserState, any>) {
    console.log("logged out");
  },
};

export default actions;
