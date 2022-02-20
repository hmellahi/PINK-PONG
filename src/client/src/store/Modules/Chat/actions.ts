import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import store from "@/store";
import { io, Socket } from "socket.io-client";
import { ActionContext } from "vuex";
import { Channel, Message } from "@/types/Channel";
import moment from "moment";

const { VUE_APP_API_URL: API_URL, VUE_APP_SERVER_URL: SERVER_URL } =
  process.env;

const listenToChannelEvents = (commit: any, connection: Socket) => {
  connection.on("connection", (channels) => {
    channels.map((channel: Channel) => {
      if (channel.type == "private") {
        commit("ADD_PRIVATE_CHANNEL", channel);
      } else if (channel.type == "public") {
        commit("ADD_PUBLIC_CHANNEL", channel);
      } else if (channel.type == "dm") {
        commit("ADD_DM", channel);
      }
    });
  });

  connection.on("message", (msg: Message) => {
    commit("ADD_MSG", msg);
  });
};

const actions = {
  connectToChatSocket({ commit }: ActionContext<UserState, any>, cookies: any) {
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
    for (let i = 0; i < 10; i++)
      commit("ADD_PUBLIC_CHANNEL", {
        name: "WHO FOR 1V1",
        membersCount: i * 3,
        isLocked: i % 2 == 0,
      });
    console.log({ publicChannels: store.state.User.publicChannels });
  },

  // currentUser():any {
  //   return store.getters["User/getCurrentUser"];
  // },

  async sendMessage(
    { commit, state, rootState }: ActionContext<any, any>,
    { message, channelId }: any
  ) {
    let currentUser = await store.getters["User/getCurrentUser"];
    commit("ADD_MSG", {
      message,
      channelId,
      showTooltip: false,
      sender: "test", // tODO REMOVE
      // sender: rootState.User.user.login,
      // sender: currentUser.login,
      createdAt: moment().format("mm:ss"), // TODO CHANGE?
    });
    // console.log({ store: rootState.User.user });
    // state.chatSocket.emit("message", { msg, channelId }); // TODO
  },
  // JOIN/LEAVE/CREATE/EDIT
  // mute/ban/invite
  // join
};

export default actions;
