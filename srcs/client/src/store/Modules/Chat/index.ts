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
  role: "member",
});

// getters
const getters = {
  getChannelMsgs: (state: any) => (channelId: string) => {
    return state.allMessages.filter((msg: any) => msg.channelId == channelId);
  },
  getDMmsgs: (state: any) => (dmId: string, myId :string) => {
   // console.log({ ms: state.dms });
    if (!state.dms.length) return [];
    return state.dms.filter((msg: any) => msg.owner.id == dmId || msg.owner.id == myId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
