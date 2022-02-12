// mutations

import { FriendsState,User,UserState } from "@/types/user";

const mutations = {
  login(state: UserState) {
    // TODO make an api call
    state.isAuthenticated = true;
  },
  logout(state: UserState) {
    // TODO make an api call
    state.isAuthenticated = false;
  },
  setUser(state: UserState, user: User){
    state.isAuthenticated = true;
    state.user = Object.assign({}, user);
  },
  setAvatar(state: UserState, avatar: string){
    state.user.avatar_url = avatar;
  },
  setEnableFactor(state: UserState, enable: boolean){
    state.user.two_factor_auth_enabled = enable;
  },
  setUsername(state: UserState, username: string){
    state.user.login = username;
  }
};

export default mutations;
