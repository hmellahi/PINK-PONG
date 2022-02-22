import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import store from "@/store";
import { io, Socket } from "socket.io-client";
import { ActionContext } from "vuex";
import { Channel, Message } from "@/types/Channel";
import Vue from "vue";
import moment from "moment";

const { VUE_APP_API_URL: API_URL, VUE_APP_SERVER_URL: SERVER_URL } =
  process.env;

const listenToChannelEvents = (commit: any, connection: Socket) => {
  connection.on("connection", (channels) => {
    commit("ADD_CHANNELS", channels);
  });

  connection.on("message", async (msg: Message) => {
    console.log({ msg });
    let currentUser = await store.getters["User/getCurrentUser"];
    commit("ADD_MSG", {
      msg,
      showTooltip: false,
      owner: currentUser,
      create_date: moment().format("mm:ss"),
    });
  });
};

const actions = {
  async connectToChatSocket(
    { commit }: ActionContext<UserState, any>,
    cookies: any
  ) {
    const Authentication = cookies.get("Authentication");
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
    // for (let i = 0; i < 10; i++)
    //   commit("ADD_PUBLIC_CHANNEL", {
    //     name: "WHO FOR 1V1",
    //     membersCount: i * 3,
    //     isLocked: i % 2 == 0,
    //   });
    // console.log({ publicChannels: store.state.User.publicChannels });
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
      // let data = await api.get("chat/myChannels");
      // console.log({ private: data });
      // commit("CLEAR_PUBLIC_CHANNELS", "private");
      // data.data.map((channel: Channel) => {
      //   if (!channel) return;
      //   commit("ADD_PRIVATE_CHANNEL", channel);
      // });
      state.chatSocket.emit("allMessages", data, ({ err, msg }: any) => {
        if (err) {
          Vue.notify({
            duration: 1000,
            type: "danger",
            title: msg,
          });
          router.go(-1);
        }
        commit("ADD_MESSAGES", msg);
      });
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
      create_date: moment().format("mm:ss"), // TODO CHANGE?
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
