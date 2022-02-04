<template>
  <div>
    <div class="row" v-for="channel in channels">
      <div class="leader_box px-5 col-md-9">
        <div class="Channel_content">
          <h3 class="d-inline">{{ channel.name }}</h3>
          <span>({{ channel.membersCount }} Members)</span>
        </div>
        <img
          v-if="channel.isPrivate"
          src="assets/svg/lock.svg"
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
      <InputField
        name="password"
        placeholder="Enter Password"
        type="password"
        v-model="password"
        class="text-left p-3 my-4"
      ></InputField>
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

@Component({
  components: { Button, LOCKSVG, Popup, InputField },
})
export default class listChannels extends Vue {
  channels: Channel[] = [];
  currentChannel: Channel;
  password = "";
  show = false;
  created() {
    // TODO MAKE AN API CALL to fetch channels
    for (let i = 0; i < 10; i++)
      this.channels.push({
        name: "WHO FOR 1V1",
        membersCount: i * 3,
        isPrivate: i % 2 == 0,
      });
    this.currentChannel = this.channels[0];
  }
  // closePopup() {
  //   this.showPopup = false;
  // }
  joinChannel(): void {
    console.log("pass", this.currentChannel);
    // TODO VERIVY
    this.$router.push("/chat/channel/" + this.currentChannel.name);
  }
  openPopup(channel: Channel): void {
    this.currentChannel = channel;
    if (!channel.isPrivate) return this.joinChannel();
    this.show = true;
    console.log(this.show);
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
