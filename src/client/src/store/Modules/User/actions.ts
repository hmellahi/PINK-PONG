import { Logger } from "@/common/helpers/Logger";
import { FriendsState, UserState } from "@/types/user";
import { ActionContext } from "vuex";

const { VUE_APP_API_URL: API_URL } = process.env;

const actions = {
  async login({ commit }: ActionContext<UserState, any>) {
    window.location.href = `${API_URL}/auth/login`
  },
  logout({ commit }: ActionContext<UserState, any>) {
    console.log("logged out");
  },
  // async fetchUser({ commit }: ActionContext<UserState, any>) {
  //   const data = await this.$http
  //     .get(`${API_URL}/users/me`)
  //     .then((response:any) => console.log({ response }));
  //   // commit("setUser", data)
  // }
};

export default actions;
