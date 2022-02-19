import { User, UserState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({
  isAuthenticated: false, //false
  user: {},
  gameSocket:{}
});

// getters
const getters = {
  getCurrentUser(state: UserState): User {
    return state.user;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
