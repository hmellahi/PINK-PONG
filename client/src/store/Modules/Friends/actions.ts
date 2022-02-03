import { Logger } from "@/common/helpers/Logger";
import { FriendsState } from "@/types/user";
import Vue from "vue";
import { ActionContext } from "vuex";
// actions
const actions = {
  unFriend({ commit, state }: ActionContext<FriendsState, any>, friend: any) {
    let friendsListBackup = [...state.friends];
    commit("REMOVE_FROM", ["friends", friend]);
    try {
      // TODO make an api call
    } catch (e) {
      commit("SET_ENTITY", ["friends", friendsListBackup]);
    }
  },
  addFriend({ commit }: ActionContext<FriendsState, any>, username: any) {
    try {
      // let friend = { username: "hamza", lastSeen: "10m ago" };
      // commit("ADD_FRIEND", username);
    } catch (e) {
      // user doesnt exist
      // smtg wrong happened
    }
  },
  async fetchFriends({ commit }: ActionContext<FriendsState, any>) {
    try {
      // TODO make an api call
      const { VUE_APP_API_URL: API_URL } = process.env;
      // const friend = await axios.get(`${API_URL}/friends`, {
      //   headers: {
      //     "Access-Control-Allow-Origin": "*",
      //   },
      //   // crossDomain: true,
      // });

      // Vue.$http
      // .get("https://api.github.com/users/mapbox")
      // .then((response));
      // console.log(this._vm)
      // console.log({ friend });

      let friends = [
        {
          username: "hamid",
          lastSeen: "10m ago",
          avatarUrl: "/assets/svg/Avatar.svg",
        },
        {
          username: "hamid",
          lastSeen: "10m ago",
          avatarUrl: "/assets/svg/Avatar-2.svg",
        },
        {
          username: "hamid",
          lastSeen: "10m ago",
          avatarUrl: "/assets/svg/Avatar-1.svg",
        },
        {
          username: "hamid",
          lastSeen: "10m ago",
          avatarUrl: "/assets/svg/Avatar-3.svg",
        },
      ];
      commit("SET_ENTITY", ["friends", friends]);
    } catch (e) {}
  },
  fetchRequests({ commit }: ActionContext<FriendsState, any>) {
    try {
      // TODO make an api call
      let requests = [{ username: "bro", lastSeen: "10m ago" }];
      commit("SET_ENTITY", ["requests", requests]);
    } catch (e) {}
  },
  fetchBlockedUsers({ commit }: any) {
    try {
      // TODO make an api call
      let blockedUsers = [{ username: "john", lastSeen: "10m ago" }];
      commit("SET_ENTITY", ["blockedUsers", blockedUsers]);
    } catch (e) {}
  },
  blockUser({ commit, state }: any, userToBlock: any) {
    let friendsBackup = [...state.friends];
    let blockedUsersBackup = [...state.blockedUsers];
    commit("REMOVE_FROM", ["friends", userToBlock]);
    commit("ADD_TO_ENTITY", ["blockedUsers", userToBlock]);
    try {
      // TODO make an api call
    } catch (e) {
      commit("SET_ENTITY", ["friends", friendsBackup]);
      commit("SET_ENTITY", ["blockedUsers", blockedUsersBackup]);
    }
  },
  unBlockUser({ state, commit }: any, userToUnblock: any) {
    let blockedUsersBackup = [...state.blockedUsers];
    let friendsBackup = [...state.friends];
    commit("REMOVE_FROM", ["blockedUsers", userToUnblock]);
    commit("ADD_TO_ENTITY", ["friends", userToUnblock]);
    try {
      // TODO make an api call
    } catch (e) {
      commit("SET_ENTITY", ["friends", friendsBackup]);
      commit("SET_ENTITY", ["blockedUsers", blockedUsersBackup]);
    }
  },
  acceptRequest({ commit, state }: any, request: any) {
    let savedRequests = [...state.requests];
    let savedFriends = [...state.friends];
    commit("ADD_TO_ENTITY", ["friends", request]);
    commit("REMOVE_FROM", ["requests", request]);
    try {
      // TODO make an api call
    } catch (e) {
      commit("SET_ENTITY", ["friends", savedFriends]);
      commit("SET_ENTITY", ["requests", savedRequests]);
    }
  },
  declineRequest({ commit, state }: any, request: any) {
    let savedRequests = [...state.requests];
    commit("REMOVE_FROM", ["requests", request]);
    try {
      // TODO make an api call
    } catch (e) {
      commit("SET_ENTITY", ["requests", savedRequests]);
    }
  },
  sendFriendRequest({ commit, state }: any, user: any) {},
};

// const loggerDecorator = (logger: any) => {
//   return function (...args: any[]): any {
//     // console.log("args", args)
//     return logger.call(this,args);
//     console.log(args);
//     console.log("message logged at:", new Date().toLocaleString());
//   };
// };
// const decorateActions = function (actions: any) {
//   let newObject: any = {};
//   for (const key in actions) {
//     newObject[key] = loggerDecorator(actions[key]);
//     // console.log(actions[key])
//   }
//   return newObject;
// };
// decorateActions(actions);
// export default decorateActions(actions);

export async function catchAction(store: any, action: string) {
  let prevstate = store.state.Friends;
  console.log(prevstate);
  try {
    await store.dispatch(action);
  } catch (err) {
    console.log(err);
  }
  store.commit("Friends/RESET_STATE", prevstate);
}
export default actions;
