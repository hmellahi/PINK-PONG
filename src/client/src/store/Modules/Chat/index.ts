import { Message } from "@/types/Channel";
import { User, UserState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({
  chatSocket: null,
  publicChannels: [],
  privateChannels: [],
  dms: [],
  allMessages: [],
  isAdmin: false,
});

// getters
const getters = {
  getChannelMsgs: (state: any) => (channelId: string) => {
    return state.allMessages.filter((msg: any) => msg.channelId == channelId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
