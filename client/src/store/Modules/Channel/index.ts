import { FriendsState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({});

// getters
const getters = {
  // friendsCount(state: FriendsState): Number {
  //   return state.friends.length;
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
