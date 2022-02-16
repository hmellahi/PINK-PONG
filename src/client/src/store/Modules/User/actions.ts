import api from "@/api";
import { Logger } from "@/common/helpers/Logger";
import router from "@/router";
import { FriendsState, UserState } from "@/types/user";
import { ActionContext } from "vuex";

const { VUE_APP_API_URL: API_URL } = process.env;
const generateRandomString = ()=>{
  var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var string = '';
  for(var ii=0; ii<15; ii++){
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string;
}
const actions = {
  async login({ commit }: ActionContext<UserState, any>) {
    // window.location.href = `${API_URL}/auth/login`
    try {
      let data = await api.post("auth/testLogin", {
        first_name: generateRandomString(),
        last_name: generateRandomString(),
        email: generateRandomString()+"@zin.com",
        login: generateRandomString(),
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
