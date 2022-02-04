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
    window.location.href = "https://api.intra.42.fr/oauth/authorize"
  },
  logout({ commit }: ActionContext<UserState, any>) {
    console.log("logged out");
  },
};

export default actions;
