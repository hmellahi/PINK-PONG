import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import store from "@/store";
import { io, Socket } from "socket.io-client";
import { ActionContext } from "vuex";
import { Channel, Message } from "@/types/Channel";
import Vue from "vue";
import moment, { now } from "moment";
// import { stat } from "fs";

const { VUE_APP_API_URL: API_URL, VUE_APP_SERVER_URL: SERVER_URL } =
  process.env;

const listenToChannelEvents = (commit: any, connection: Socket) => {
  connection.on("message", async ({ msg, owner, channelId }: any) => {
   // console.log("recieved a msg", { channelId, msg, owner });
    commit("ADD_MSG", {
      msg,
      showTooltip: false,
      owner,
      create_date: new Date(),
      channelId,
    });
  });
};

const listenToDMEvents = (commit: any, connection: Socket) => {
  connection.on("messageDm", async ({ msg, owner, channelId }: any) => {
   // console.log("recieved a msg", { msg, owner });
    //let currentUser = await store.getters["User/getCurrentUser"];

    commit("ADD_DMS", {
      msg,
      showTooltip: false,
      owner,
      create_date: new Date(),
      channelId: -1,
    });
  });
};

const actions = {
  async connectToChatSocket(context: ActionContext<any, any>, cookies: any) {
    const { commit, state } = context;
    const Authentication = cookies.get("Authentication");
    // if (state.chatSocket != null) {
    //   state.chatSocket.removeAllListeners("message");
    //   state.chatSocket.disconnect();
    // }
    if (state.chatSocket != null) {
      // this.fetchMessages(context, state.chatSocket);
      return;
    }
    let connection = io(`${SERVER_URL}/chat`, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authentication,
          },
        },
      },
    });
    commit("SET_CHATSOCKET", connection);
    listenToChannelEvents(commit, connection);
    listenToDMEvents(commit, connection);
  },

  async listenToChatEvents(
    { commit, state }: ActionContext<any, any>,
    { channelId }: any
  ) {
    state.chatSocket.on("addAdmin", async ({ err, msg }: any) => {
      let currentUser = await store.getters["User/getCurrentUser"];
      if (currentUser.id != msg.userId || msg.channelId != channelId) return;
      commit("SET_ROLE", "admin");
    });
    state.chatSocket.on("banUser", async ({ err, msg }: any) => {
      let currentUser = await store.getters["User/getCurrentUser"];
      if (currentUser.id != msg.userId || msg.channelId != channelId) return;
      // if (msg.isPermanant)
      router.push({ path: "/chat" });
      Vue.notify({
        duration: 1000,
        type: "danger",
        title: msg.msg,
      });
    });
  },
  async leaveChannelSocket(
    { commit, state }: ActionContext<any, any>,
    data: any
  ) {
    state.chatRoom.emit("leaveChannel", data);
  },
  async listenToChannelEvents({ commit, state }: ActionContext<any, any>) {
    // listenToChannelEvents(commit, state.chatSocket);
  },

  async fetchChannels({ commit }: ActionContext<any, any>) {
    try {
      let data = await api.get("chat/channels");
      //console.log({ a: data });
      commit("CLEAR_PUBLIC_CHANNELS", "public");
      commit("ADD_CHANNELS", data.data);
    } catch (error) {}
  },

  async joinChannel({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("chat/joinChannel", data);
      router.push({
        path: "/chat/channel/" + data.channelId,
      });
    } catch (error) {
      throw error;
    }
  },

  async leaveChannel({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("chat/leaveChannel", data);
      commit("REMOVE_CHANNEL", data.channelId);
      //console.log({ data }, { resp });
    } catch (error) {
      throw error;
    }
  },

  async addMember({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("chat/addMember", data);
      // ex :{"login": "htagrour1","channelId": 5}
      // commit("ADD_CHANNELS", data.data);
     // console.log({ data }, { resp });
    } catch (error) {
      throw error;
    }
  },

  async fetchMessages({ state, commit }: ActionContext<any, any>, data: any) {
    try {
      commit("CLEAR_ALL_MEASSAGES");
      state.chatSocket.emit("allMessages", data, ({ err, msg }: any) => {
        if (err) {
          router.push({ path: "/chat" });
          Vue.notify({
            duration: 3000,
            type: "danger",
            title: "invalid room id or you arent a member of this room",
          });
          return;
        }
        // console.log({ allMessages : msg });
        commit("ADD_MESSAGES", msg.messages);
        commit("SET_ROLE", msg.role);
      });
      // });
    } catch (error) {
      throw error;
    }
  },

  async fetchDMS({ state, commit }: ActionContext<any, any>, data: any) {
    try {
      commit("CLEAR_ALL_MEASSAGES");
      state.chatSocket.emit("getDmsMessages", data, ({ err, msg }: any) => {
        if (err) {
          // router.push({ path: "/chat" });
          Vue.notify({
            duration: 3000,
            type: "danger",
            title: msg,
          });
          return;
        }
        //console.log({ msg });
        if (msg.messages) commit("SET_DMS", msg.messages);
        else commit("SET_DMS", []);
      });
      // });
    } catch (error) {
      throw error;
    }
  },

  async fetchMyChannels({ commit }: ActionContext<any, any>) {
    try {
      let data = await api.get("chat/myChannels");
      //console.log({ private: data });
      commit("CLEAR_PUBLIC_CHANNELS", "private");
      data.data.map((channel: Channel) => {
        if (!channel) return;
        commit("ADD_PRIVATE_CHANNEL", channel);
      });
    } catch (error) {}
  },

  // currentUser():any {
  //   return store.getters["User/getCurrentUser"];
  // },

  async sendMessage(
    { commit, state, rootState }: ActionContext<any, any>,
    { msg, channelId, userId, isDM, errorCallback }: any
  ) {
    let currentUser = await store.getters["User/getCurrentUser"];

    let msgsBackup: any;
    if (isDM) msgsBackup = state.dms.slice();
    else msgsBackup = state.allMessages.slice();
    let mutationName = isDM ? "ADD_DMS" : "ADD_MSG";
    commit(mutationName, {
      msg,
      showTooltip: false,
      owner: currentUser,
      create_date: moment(),
      channelId: channelId ? channelId : -1,
    });

    let eventName = isDM ? "messageDm" : "message";
    let mutation = isDM ? "SET_DMS" : "ADD_MESSAGES";
    state.chatSocket.emit(
      eventName,
      { msg, channelId, userId },
      ({ err, msg }: any) => {
        if (err && errorCallback) {
          errorCallback(msg);
          //console.log({ msgsBackup });
          commit(mutation, msgsBackup);
        }
      }
    );
  },

  async createChannel({ commit }: ActionContext<UserState, any>, channel: any) {
    try {
      let data = await api.post("chat/createChannel", channel);
      // commit("ADD_CHANNELS", [channel]);
    } catch (error) {
      throw error;
    }
  },

  async addAdmin({ commit, state }: ActionContext<any, any>, data: any) {
    try {
      // let resp = await api.post("/chat/addAdmin", data);
      // console.log({ data }, { resp });
      state.chatSocket.emit("addAdmin", data, ({ err, msg }: any) => {
        if (err) throw msg;
        Vue.notify({
          duration: 3000,
          type: err ? "danger" : "success",
          title: msg,
        });
       // console.log({ err, msg });
        data.callback();
      });
    } catch (error) {
      throw error;
    }
  },

  async muteFromChannel({ commit, state }: ActionContext<any, any>, data: any) {
    try {
      await api.post("chat/muteUser", data);
    } catch (error) {
      throw error;
    }
  },
  async banFromChannel({ commit, state }: ActionContext<any, any>, data: any) {
    try {
      state.chatSocket.emit("banUser", data, ({ err, msg }: any) => {
        Vue.notify({
          duration: 1000,
          type: err ? "danger" : "success",
          title: msg,
        });
      });
    } catch (error) {
      throw error;
    }
  },
};

export default actions;
