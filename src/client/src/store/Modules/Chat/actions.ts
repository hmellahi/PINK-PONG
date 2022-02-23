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

const { VUE_APP_API_URL: API_URL, VUE_APP_SERVER_URL: SERVER_URL } =
  process.env;

const listenToChannelEvents = (commit: any, connection: Socket) => {
  connection.on("message", async ({ msg, owner }: any) => {
    console.log("recieved a msg", { msg });
    let currentUser = await store.getters["User/getCurrentUser"];

    commit("ADD_MSG", {
      msg,
      showTooltip: false,
      owner,
      create_date: new Date(),
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
      this.fetchMessages(context, state.chatSocket);
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
  },

  async listenToChannelEvents({ commit, state }: ActionContext<any, any>) {
    listenToChannelEvents(commit, state.chatSocket);
  },

  async fetchChannels({ commit }: ActionContext<any, any>) {
    try {
      let data = await api.get("chat/channels");
      console.log({ a: data });
      commit("CLEAR_PUBLIC_CHANNELS", "public");
      commit("ADD_CHANNELS", data.data);
    } catch (error) {}
  },

  async joinChannel({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("chat/joinChannel", data);
      // commit("ADD_CHANNELS", data.data); TODO ADD TO MY CHANNELS LIST
    } catch (error) {
      throw error;
    }
  },

  async leaveChannel({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("chat/leaveChannel", data);
      // commit("ADD_CHANNELS", data.data); TODO REMOVE FROM MY CHANNELS LIST
      commit("REMOVE_CHANNEL", data.channelId);
      console.log({ data }, { resp });
    } catch (error) {
      throw error;
    }
  },

  async addMember({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("chat/addMember", data);
      // ex :{"login": "htagrour1","channelId": 5}
      // commit("ADD_CHANNELS", data.data);
      console.log({ data }, { resp });
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
        commit("SET_IS_ADMIN", msg.isAdmin);
      });
      // });
    } catch (error) {
      throw error;
    }
  },

  async fetchMyChannels({ commit }: ActionContext<any, any>) {
    try {
      let data = await api.get("chat/myChannels");
      console.log({ private: data });
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
    { msg, channelId }: any
  ) {
    let currentUser = await store.getters["User/getCurrentUser"];
    commit("ADD_MSG", {
      msg,
      showTooltip: false,
      owner: currentUser,
      create_date: moment(), // TODO CHANGE?
    });
    // console.log({
    //   msg,
    //   showTooltip: false,
    //   owner: currentUser,
    //   create_date: moment().format("mm:ss"),
    // });
    // console.log({ store: rootState.User.user });
    state.chatSocket.emit(
      "message",
      { msg, channelId },
      ({ err, msg }: any) => {
        if (err) {
          throw err;
        }
      }
    ); // TODO
  },

  async createChannel({ commit }: ActionContext<UserState, any>, channel: any) {
    try {
      console.log({ channel });
      let data = await api.post("chat/createChannel", channel);
      console.log({ a: data });
      if (channel.type == "public") commit("ADD_PUBLIC_CHANNEL", channel);
      commit("ADD_CHANNELS", [channel]);
    } catch (error) {
      throw error;
    }
  },

  async addAdmin({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("/chat/addAdmin", data);
      console.log({ data }, { resp });
    } catch (error) {
      throw error;
    }
  },

  async muteFromChannel({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("/chat/muteFromChannel", data);
      console.log({ data }, { resp });
    } catch (error) {
      throw error;
    }
  },
  async banFromChannel({ commit }: ActionContext<any, any>, data: any) {
    try {
      let resp = await api.post("/chat/banFromChannel", data);
      console.log({ data }, { resp });
    } catch (error) {
      throw error;
    }
  },
};

export default actions;
