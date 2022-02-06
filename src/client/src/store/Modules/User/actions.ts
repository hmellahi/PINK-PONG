import { Logger } from "@/common/helpers/Logger";
import { FriendsState, UserState } from "@/types/user";
import { ActionContext } from "vuex";

const actions = {
  async login({ commit }: ActionContext<UserState, any>) {
    // commit("login");
    // await this.$http.get("https://api.intra.42.fr/oauth/authorize",)
    // await this.$http
    //   .get("https://api.intra.42.fr/oauth/authorize")
    //   .then((response:any) => console.log({ response }));
    // router.push("yourroutename")
    // window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=28fb3b308c5796f684aa7582bf9c49de8a078e0c684bc810e1339aff720f9e0c&redirect_uri=http://127.0.0.1:3000/api/auth/callback&response_type=code"
    window.location.href = "http://127.0.0.1:3000/api/auth/login"
  },
  logout({ commit }: ActionContext<UserState, any>) {
    console.log("logged out");
  },
};

export default actions;
