// mutations

import { Channel, Message } from "@/types/Channel";
import { FriendsState, User, UserState } from "@/types/user";

const mutations = {
  SET_CHATSOCKET(state: any, connection: any) {
    state.chatSocket = connection;
  },
  SET_PUBLIC_CHANNELS(state: any, publicChannels: any) {
    state.publicChannels = publicChannels;
  },
  SET_PRIVATE_CHANNELS(state: any, privateChannels: any) {
    state.privateChannels = privateChannels;
  },
  SET_DMS(state: any, dms: any) {
    state.dms = dms;
  },
  ADD_PUBLIC_CHANNEL(state: any, channel: any) {
    state.publicChannels.push(channel);
  },
  ADD_PRIVATE_CHANNEL(state: any, channel: any) {
    state.privateChannels.push(channel);
  },
  ADD_DM(state: any, channel: any) {
    state.dms.push(channel);
  },
  ADD_CHANNELS(state: any, channels: any) {
    channels.map((channel: Channel) => {
      if (!channel) return;
      if (channel.type == "private") {
        state.privateChannels.push(channel);
        // commit("ADD_PRIVATE_CHANNEL", channel);
      } else if (channel.type == "public") {
        state.publicChannels.push(channel);
      } else {
        state.dms.push(channel);
        // commit("ADD_DM", channel);
      }
    });
  },
  ADD_MSG(state: any, msg: Message) {
    // let newMessagesList = state.get_channel_msgs(state, channelId).push(msg);
    // state.allMessages.set(channelId, newMessagesList);
    state.allMessages.push(msg);
  },
  REMOVE_CHANNEL(state: any, channelId: any) {
    state.publicChannels = state.publicChannels.filter(
      (channel: Channel) => channel.id != channelId
    );
    state.privateChannels = state.privateChannels.filter(
      (channel: Channel) => channel.id != channelId
    );
    state.dms = state.dms.filter((channel: Channel) => channel.id != channelId);
  },
  CLEAR_PUBLIC_CHANNELS(state: any, type: string) {
    // remove all channels depending on type
    if (type == "public") {
      state.publicChannels = [];
    } else if (type == "private") {
      state.privateChannels = [];
    }
  },
  ADD_DMS(state: any, msg: any) {
   // console.log({ dms: state.dms });
    state.dms.push(msg);
  },
  ADD_MESSAGES(state: any, messages: Message[]) {
    // if (!messages) return;
    // messages.map((msg: Message) => {
    //   state.allMessages.push(msg);
    // });
    state.allMessages = messages;
  },
  CLEAR_ALL_MEASSAGES(state: any) {
    state.allMessages = [];
  },
  SET_IS_ADMIN(state: any, newVal: boolean) {
    state.isAdmin = newVal;
  },
  SET_ROLE(state: any, newVal: boolean) {
    state.role = newVal;
  },
};

export default mutations;
