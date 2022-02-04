import Vue from "vue";
import Vuex from "vuex";
import User from "@/store/Modules/User/index";
import Channel from "@/store/Modules/Channel/index";
import Friends from "@/store/Modules/Friends/index";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";
export default new Vuex.Store({
  // mutations: {
  //   // RESET_STATE(state: any, defaultstate: any): void {
  //   //   // this.state = defaultstate;
  //   //   // this.replaceState(defaultstate)
  //   // },
  // },
  modules: {
    Friends,
    User,
    Channel,
  },
  strict: debug,
});
