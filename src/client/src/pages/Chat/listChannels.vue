<template>
  <div>
    <div class="row" v-for="channel in channels">
      <div class="leader_box px-5 col-md-9">
        <div class="Channel_content">
          <h3 class="d-inline">{{ channel.name }}</h3>
          <span>({{ channel.membersCount }} Members)</span>
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
        ></InputField>
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
  watch: {
    $route(to, from) {
      // this.updateIsLoginPage();
      this.routeName = to.path;
      // console.log(to.path)
    },
  },
})
export default class listChannels extends Vue {
  // channels: Channel[];
  currentChannel: Channel;
  password = "";
  show = false;
  routeName: String;
  created() {
    // console.log(this.routeName)
    // for (let i = 0; i < 10; i++)
    //   this.channels.push({
    //     name: "WHO FOR 1V1",
    //     membersCount: i * 3,
    //     isLocked: i % 2 == 0,
    //   });
    this.currentChannel = {
      name: "",
      membersCount: 0,
      isLocked: false,
      type: "public",
    };
  }
  // get currentChannel() {
  //   return this.channels[0]
  //     ? this.channels[0]
  //     : { name: "", membersCount: 0, isLocked: false };
  // }
  // set currentChannel(value) {
  //   this.currentChannel = value;
  // }
  // closePopup() {
  //   this.showPopup = false;
  // }
  get channels() {
    console.log(this.$store.state.Chat.publicChannels);
    if (this.routeName == "/chat") return this.$store.state.Chat.publicChannels;
    return this.$store.state.Chat.privateChannels;
  }
  joinChannel(): void {
    // console.log("pass", this.currentChannel);
    // TODO VERIVY
    this.$router.push("/chat/channel/" + this.currentChannel.name).catch();
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
