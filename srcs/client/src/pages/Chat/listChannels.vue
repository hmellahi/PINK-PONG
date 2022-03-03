<template>
  <div>
    <div v-if="channels && channels.length">
      <div class="row" v-for="channel in channels">
        <div class="leader_box px-5 col-md-9">
          <div class="Channel_content">
            <h3 class="d-inline">{{ channel.name }}</h3>
            <span> ({{ channel.membersCount }} Members)</span>
          </div>
          <img
            v-if="channel.isLocked && !isMyChannelPage"
            src="/assets/svg/lock.svg"
            alt=""
            class="icon"
          />
        </div>
        <div class="btn col-md-2 ml-auto leader_box" v-if="!isMyChannelPage">
          <h2 class="m-auto" role="button" @click="openPopup(channel)">Join</h2>
        </div>
        <div class="btn col-md-2 ml-auto leader_box" v-else>
          <h2 class="m-auto" role="button" @click="enter(channel)">Enter</h2>
        </div>
      </div>
    </div>
    <h4 v-else>There is no channels yet</h4>
    <Popup v-model="show" v-if="currentChannel">
      <h2>{{ currentChannel.name }}</h2>
      <form>
        <InputField
          name="password"
          placeholder="Enter Password"
          type="password"
          v-model="password"
          class="text-left p-3 my-3"
          autocomplete="on"
        ></InputField>
        <span class="mb-4 error-message">{{ errors }}</span>
      </form>
      <Button :onClick="joinChannel" class="px-5">Join</Button>
    </Popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import InputField from "@/common/components/UI/InputField.vue";
import Popup from "@/common/components/UI/Popup.vue";
import LOCKSVG from "../../../public/assets/svg/lock.svg";
import { Channel } from "../../types/Channel";

@Component<listChannels>({
  components: { Button, LOCKSVG, Popup, InputField },
  props: {
    // channels: {
    //   required: true,
    //   type: Array,
    // },
  },
})
export default class listChannels extends Vue {
  // channels: Channel[];
  currentChannel: any = {};
  password = "";
  show = false;
  errors = "";
  async mounted() {
    this.currentChannel = {
      name: "",
      membersCount: 0,
      isLocked: false,
      type: "public",
    };
    if (this.$route.path == "/chat")
      await this.$store.dispatch("Chat/fetchChannels");
    else await this.$store.dispatch("Chat/fetchMyChannels");
  }

  get currentRouteName() {
    // console.log(this.$route)
    return this.$route.path;
  }
  get isMyChannelPage() {
    if (!this.currentRouteName || this.currentRouteName == "/chat")
      return false;
    return true;
  }
  enter(channel: Channel) {
    this.$router.push({
      path: "/chat/channel/" + channel.id,
    });
  }
  get channels() {
    if (!this.isMyChannelPage) return this.$store.state.Chat.publicChannels;
    return this.$store.state.Chat.privateChannels;
  }
  async joinChannel() {
    try {
      await this.$store.dispatch("Chat/joinChannel", {
        channelId: this.currentChannel.id,
        password: this.password,
      });
      // this.$router.push({
      //   path: "/chat/channel/" + this.currentChannel.id,
      // });
    } catch (errors) {
      // this.errors = errors.response.data.message;
      this.$notify({
        duration: 1000,
        type: "danger",
        title:  errors.response.data.message  ,
      });
      return;
    }
  }
  openPopup(channel: Channel) {
    // console.log("isLocked : " + channel.isLocked);
    this.currentChannel = channel;
    if (!channel.isLocked) return this.joinChannel();
    this.show = true;
    // console.log(this.show);
  }
}
</script>

<style scoped>
.icon {
  width: 2rem;
  /* width: 100%; */
  height: 100%;
  position: relative;
}
.error-message {
  color: red;
  font-size: 1.2rem;
}
</style>
