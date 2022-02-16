import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import { io } from "socket.io-client";
import { ActionContext } from "vuex";

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
const actions = {
  async login({ commit }: ActionContext<UserState, any>) {
    // window.location.href = `${API_URL}/auth/login`
    try {
      let data = await api.post("auth/testLogin", {
        first_name: generateRandomString(),
        last_name: generateRandomString(),
        email: generateRandomString() + "@zin.com",
        login: generateRandomString(),
      });
      console.log(data);
    } catch (error) {}
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

  acceptGameInvite(
    { commit, state }: ActionContext<UserState, any>,
    invitationSenderId: number
  ) {
    state.gameSocket.emit(
      "acceptInvitation",
      invitationSenderId,
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
    invitationSenderId: number
  ) {
    state.gameSocket.emit("declineInvitation", invitationSenderId);
  },

  connectToGameSocket({ commit }: ActionContext<UserState, any>, cookies: any) {
    const Authentication = cookies.get("Authentication");
    let connection = io("http://localhost:3000/game", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authentication,
          },
        },
      },
    });
    commit("SET_GAMESOCKET", connection);
  },

  async fetchUser(id: Number): Promise<any> {
    try {
      const player1 = await api.get(`users?id=${id}`);
      return player1;
    } catch (error) {
      return;
    }
  },
};

export default actions;
