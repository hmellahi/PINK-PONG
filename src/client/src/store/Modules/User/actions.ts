import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import store from "@/store";
import { io, Socket } from "socket.io-client";
import { ActionContext } from "vuex";
import Vue from "vue";
import Notifications from "vue-notification";

const { VUE_APP_API_URL: API_URL, VUE_APP_SERVER_URL: SERVER_URL } =
  process.env;

const generateRandomString = () => {
  var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  var string = "";
  for (var ii = 0; ii < 15; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string;
};

const listenToNotifications = (gameSocket: Socket) => {
  gameSocket.on("inviteToPlay", (data: any) => {
    console.log({ data });
    let { senderName, receiver, senderSocketId, senderId } = data;
    console.log({ rec: store.state.User.user.id }, { receiver });
    if (receiver != store.state.User.user.id) return;
    Vue.notify({
      duration: -1,
      type: "info",
      title: `${senderName} want to play with you !`,
      data: {
        senderSocketId: senderSocketId,
        senderId: senderId,
      },
    });
  });
  gameSocket.on("userStatus", ({ userId, status }: any) => {
    if (store.state.User.user.id == userId && status == "Offline") {
      console.log("wtf a zbi");
      gameSocket.emit("userStatus", "Online");
    }
  });
  gameSocket.on("customGameStarted", (roomId: string) => {
    console.log({ roomId });
    router.push(`/game?id=${roomId}`);
  });
};

const actions = {
  async login({ commit }: ActionContext<UserState, any>) {
    // window.location.href = `${API_URL}/auth/login`;
    // FOR TESTING ONLY UNCOMENT THIS
    let data: any;
    try {
      data = await api.post("auth/testLogin", {
        first_name: generateRandomString(),
        last_name: generateRandomString(),
        email: generateRandomString() + "@zin.com",
        login: generateRandomString(),
      });
      console.log(data);
    } catch (error) {}
    // store.commit("User/setUser", data.data);

    router.push("/");
  },
  logout({ commit }: ActionContext<UserState, any>) {
    console.log("logged out");
  },

  sendGameInvite(
    { commit, state }: ActionContext<UserState, any>,
    receiverId: number
  ) {
    state.gameSocket.emit(
      "inviteToGame",
      { receiverId },
      ({ err, msg }: any) => {
        if (err) {
          // show toast with error message (ila jat 3la khatrk)
          console.log(msg);
        }
      }
    );
  },

  acceptInvitation(
    { commit, state }: ActionContext<UserState, any>,
    { senderSocketId, senderId }: any
  ) {
    state.gameSocket.emit(
      "acceptInvitation",
      {
        senderSocketId,
        senderId,
      },
      ({ roomId, err, msg }: any) => {
        if (err) {
          // show toast with error message (ila jat 3la khatrk)
          console.log(msg);
        } else router.push(`/game?id=${roomId}`);
      }
    );
  },

  declineGameInvite(
    { commit, state }: ActionContext<UserState, any>,
    { senderSocketId, senderId }: any
  ) {
    state.gameSocket.emit("declineInvitation", { senderSocketId, senderId });
  },

  connectToGameSocket({ commit }: ActionContext<UserState, any>, cookies: any) {
    const Authentication = cookies.get("Authentication");
    let connection = io(`${SERVER_URL}/game`, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authentication,
          },
        },
      },
    });
    commit("SET_GAMESOCKET", connection);
    listenToNotifications(connection);
  },

  // async fetchUser(id: Number, callback: Function) {
  //   try {
  //     const player1 = await api.get(`users?id=${id}`);
  //     callback(player1);
  //   } catch (error) {
  //     return;
  //   }
  // },
};

export default actions;
