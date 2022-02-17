import { Message } from "@/types/Channel";
import { User, UserState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({
  chatSocket: {},
  publicChannels: [],
  privateChannels: [],
  dms: [],
  allMessages: [],
});

// getters
const getters = {
  getChannelMsgs(state: any, channelId: string): Message[] {
    return state.allMessages.filter(
      (msg: Message) => msg.channelId === channelId
    );
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
