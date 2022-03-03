import Vue from "vue";
import Vuex from "vuex";
import User from "@/store/Modules/User/index";
import Channel from "@/store/Modules/Channel/index";
import Friends from "@/store/Modules/Friends/index";
import Chat from "@/store/Modules/Chat/index";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    Friends,
    User,
    Channel,
    Chat
  },
  strict: false,
});
