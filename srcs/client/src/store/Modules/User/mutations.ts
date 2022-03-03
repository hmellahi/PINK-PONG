// mutations

import { FriendsState, User, UserState } from "@/types/user";

const mutations = {
  login(state: UserState) {
    // state.isAuthenticated = true;
  },
  logout(state: UserState) {
    state.isAuthenticated = false;
  },
  setUser(state: UserState, user: User) {
    state.isAuthenticated = true;
    state.user = Object.assign({ matches: [], status_user: "Online" }, user);
  },
  setAvatar(state: UserState, avatar: string) {
    state.user.image_url = avatar;
  },

  setEnableFactor(state: UserState, enable: boolean) {
    state.user.two_factor_auth_enabled = enable;
  },
  setUsername(state: UserState, username: string) {
    state.user.login = username;
  },
  SET_GAMESOCKET(state: UserState, connection: any) {
    state.gameSocket = connection;
  },
};

export default mutations;
