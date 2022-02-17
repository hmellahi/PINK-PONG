import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import store from "@/store";
import { io, Socket } from "socket.io-client";
import { ActionContext } from "vuex";
import { Channel, Message } from "@/types/Channel";

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
  },

  // sendMessage(
  //   { commit, state }: ActionContext<any, any>,
  //   { msg, channelId }: any
  // ) {
  //   commit("ADD_MSG", msg);
  //   state.chatSocket.emit("message", { msg, channelId });
  // },
  // mute/ban/invite/leave/edit
  // join
};

export default actions;
