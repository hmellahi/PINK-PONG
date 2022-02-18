// mutations

import { FriendsState,User,UserState } from "@/types/user";

const mutations = {
  login(state: UserState) {
    // state.isAuthenticated = true;
  },
  logout(state: UserState) {
    state.isAuthenticated = false;
  },
  setUser(state: UserState, user: User){
    state.isAuthenticated = true;
    let matches = [
      {
        id: 1,
        image: "/assets/img/2.jpg",
        score1: "5",
        score2: "6",
        map: "/assets/img/map1.jpg",
        map_name: "Classic",
        duration: "02:45",
        date: "2022-08-14",
        type: "victory",
        player1: {
          id: 4,
          login: "sefiwejof",
          avatar_url: "/assets/img/2.jpg",
        },
        player2: {
          id: 4,
          login: "werewrwr",
          avatar_url: "/assets/img/2.jpg",
        },
      },
      {
        id: 1,
        image: "/assets/img/2.jpg",
        score1: "4",
        score2: "3",
        map: "/assets/img/map1.jpg",
        map_name: "Classic",
        duration: "02:45",
        date: "2022-08-14",
        type: "defeat",
        player1: {
          id: 4,
          login: "sefiwejof",
          avatar_url: "/assets/img/2.jpg",
        },
        player2: {
          id: 4,
          login: "werewrwr",
          avatar_url: "/assets/img/2.jpg",
        },
      }
    ];
    state.user = Object.assign({matches: matches}, user);
  },
  setAvatar(state: UserState, avatar: string){
    state.user.avatar_url = avatar;
  },
  setEnableFactor(state: UserState, enable: boolean){
    state.user.two_factor_auth_enabled = enable;
  },
  setUsername(state: UserState, username: string){
    state.user.login = username;
  },
  SET_GAMESOCKET(state: UserState, connection: any){
    state.gameSocket = connection
  }
};

export default mutations;
