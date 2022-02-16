import { User, UserState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({
  isAuthenticated: false, //false
  // user: null,
  // user: {
  //   avatarUrl: "/assets/img/avatars/Avatar.png",
  //   username: "mohammed",
  //   wins: 45,
  //   loses: 45,
  //   isAuthenticated: true,
  //   matches: [
  //     { duration: "09:10", map: "classic", date: "17/04/2019", result: "11-6" },
  //     { duration: "09:10", map: "classic", date: "17/04/2019", result: "11-6" },
  //     { duration: "09:10", map: "classic", date: "17/04/2019", result: "11-6" },
  //     { duration: "09:10", map: "classic", date: "17/04/2019", result: "11-6" },
  //   ],
  // },
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
