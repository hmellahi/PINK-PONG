import { Logger } from "@/common/helpers/Logger";
import { FriendsState } from "@/types/user";
import Vue from "vue";
import { ActionContext } from "vuex";
import api from "@/api";
// actions
const { VUE_APP_API_URL: API_URL } = process.env;

const actions = {
  async unFriend(
    { commit, state }: ActionContext<FriendsState, any>,
    friend: any
  ) {
    let friendsListBackup = [...state.friends];
    commit("REMOVE_FROM", ["friends", friend]);
    try {
      //(friend.id);
      const data = await api.post("friendship/removeFriendship", {
        friendshipId: friend.id,
      });
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
      const data = await api.get("friendship/friendships");
      commit("SET_ENTITY", ["friends", data.data]);
    } catch (e) {}
  },
  async fetchRequests({ commit }: ActionContext<FriendsState, any>) {
    try {
      const data = await api.get("friendship/friendshipRequests");
      commit("SET_ENTITY", ["requests", data.data]);
    } catch (e) {}
  },
  async fetchBlockedUsers({ commit }: any) {
    try {
      // let blockedUsers = [{ username: "john", lastSeen: "10m ago" }];
      const data = await api.get("users/blockedList");
     // console.log(data.data);
      commit("SET_ENTITY", ["blockedUsers", data.data]);
    } catch (e) {}
  },
  async blockUser({ commit, state }: any, userToBlock: any) {
    let friendsBackup = [...state.friends];
    let blockedUsersBackup = [...state.blockedUsers];
    commit("REMOVE_FROM", ["friends", userToBlock]);
    commit("ADD_TO_ENTITY", ["blockedUsers", userToBlock]);
    try {
      // console.log(userToBlock)
      const data = await api.post("users/blockUser", {
        userId: userToBlock.user.id,
      });
     // console.log("from block user", data);
    } catch (e) {
      commit("SET_ENTITY", ["friends", friendsBackup]);
      commit("SET_ENTITY", ["blockedUsers", blockedUsersBackup]);
      //console.log(e);
    }
  },
  async unBlockUser({ state, commit }: any, userToUnblock: any) {
    let blockedUsersBackup = [...state.blockedUsers];
    let friendsBackup = [...state.friends];
    commit("REMOVE_FROM", ["blockedUsers", userToUnblock]);
    // commit("ADD_TO_ENTITY", ["friends", userToUnblock]);
    try {
      const data = await api.post("users/unblockUser", {
        blockId: userToUnblock.id,
      });
    } catch (e) {
      // commit("SET_ENTITY", ["friends", friendsBackup]);
      commit("SET_ENTITY", ["blockedUsers", blockedUsersBackup]);
    }
  },
  async acceptRequest({ commit, state }: any, request: any) {
    let savedRequests = [...state.requests];
    let savedFriends = [...state.friends];
   // console.log(request);
   // console.log(savedFriends);
    let newFriend = {
      id: request.id,
      status: request.status,
      user: request.sender,
      create_date: request.create_date,
    };
    commit("ADD_TO_ENTITY", ["friends", newFriend]);
    commit("REMOVE_FROM", ["requests", request]);
    try {
      const requestData = await api.post("friendship/acceptFriendRequest", {
        friendshipRequestId: request.id,
      });
    //  console.log(requestData);
    } catch (e) {
      commit("SET_ENTITY", ["friends", savedFriends]);
      commit("SET_ENTITY", ["requests", savedRequests]);
    }
  },
  async declineRequest({ commit, state }: any, request: any) {
    let savedRequests = [...state.requests];
    commit("REMOVE_FROM", ["requests", request]);
    try {
      const requestData = await api.post("friendship/declineFriendRequest", {
        friendshipRequestId: request.id,
      });
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
  // console.log({prevstate});
  try {
    await store.dispatch(action);
  } catch (err) {
   // console.log(err);
  }
  // console.log({ store.state})
  store.commit("Friends/RESET_STATE", prevstate);
}
export default actions;
