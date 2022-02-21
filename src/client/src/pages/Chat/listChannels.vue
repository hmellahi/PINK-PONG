<template>
  <div>
    <div class="row" v-for="channel in channels">
      <div class="leader_box px-5 col-md-9">
        <div class="Channel_content">
          <h3 class="d-inline">{{ channel.name }}</h3>
          <span>({{ channel.members && channel.members.length }} Members)</span>
        </div>
        <img
          v-if="channel.isLocked"
          src="/assets/svg/lock.svg"
          alt=""
          class="icon"
        />
      </div>
      <div class="btn col-md-2 ml-auto leader_box">
        <h2 class="m-auto" role="button" @click="openPopup(channel)">Join</h2>
      </div>
    </div>
    <Popup v-model="show">
      <h2>{{ currentChannel.name }}</h2>
      <form>
        <InputField
          name="password"
          placeholder="Enter Password"
          type="password"
          v-model="password"
          class="text-left p-3 my-4"
          autocomplete="on"
        ></InputField>
        {{ errors }}
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
  currentChannel: Channel;
  password = "";
  show = false;
  errors = "";
  async created() {
    this.currentChannel = {
      name: "",
      membersCount: 0,
      isLocked: false,
      type: "public",
    };
    if (!this.currentRouteName || this.currentRouteName == "/chat")
      await this.$store.dispatch("Chat/fetchChannels");
    else await this.$store.dispatch("Chat/fetchMyChannels");
  }

  get currentRouteName() {
    // console.log(this.$route)
    return this.$route.path;
  }
  // get currentChannel() {
  //   return this.channels[0]
  //     ? this.channels[0]
  //     : { name: "", membersCount: 0, isLocked: false };
  // }Ï
  // set currentChannel(value) {
  //   this.currentChannel = value;
  // }
  // closePopup() {
  //   this.showPopup = false;
  // }
  get channels() {
    if (!this.currentRouteName || this.currentRouteName == "/chat")
      return this.$store.state.Chat.publicChannels;
    return this.$store.state.Chat.privateChannels;
  }
  joinChannel(): void {
    try {
      alert(this.currentChannel.id);
      this.$store.dispatch("Chat/joinChannel", {
        channelId: this.currentChannel.id,
        // password: this.password,
      });
    } catch (errors) {
      this.errors = errors;
      return;
    }
    this.$router.replace({
      path: "/chat/channel/" + this.currentChannel.name,
    });
  }
  openPopup(channel: Channel): void {
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
</style>
