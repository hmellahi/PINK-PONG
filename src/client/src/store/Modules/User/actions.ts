import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import { ActionContext } from "vuex";

const { VUE_APP_API_URL: API_URL } = process.env;

const actions = {
  async login({ commit }: ActionContext<UserState, any>) {
    // window.location.href = `${API_URL}/auth/login`
    try {
      let data = await api.post("auth/testLogin", {
        first_name: "karima",
        last_name: "zin",
        email: "karima@zin.com",
        login: "karima",
      });
      console.log(data);
    } catch (error) {}
    router.push("/");
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
