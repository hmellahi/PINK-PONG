// mutations

import { FriendsState,UserState } from "@/types/user";

const mutations = {
  login(state: UserState) {
    // TODO make an api call
    state.isAuthenticated = true;
  },
  logout(state: UserState) {
    // TODO make an api call
    state.isAuthenticated = false;
  },
};

export default mutations;
