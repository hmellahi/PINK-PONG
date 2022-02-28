import { FriendsState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({
  friends: [],
  blockedUsers: [],
  requests: [],
});

// getters
const getters = {
  friendsCount(state: FriendsState): Number {
    return state.friends.length;
  },
  requestsCount(state: FriendsState): Number {
    return state.requests.length;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
