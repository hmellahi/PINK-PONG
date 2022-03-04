<template>
  <div>
    <Button
      class="ml-0 mb-3 col-md-2"
      v-if="this.$route.path != '/profile/mine'"
      :onClick="goBackward"
      >Back</Button
    >
    <Button
      v-if="isAdmin(currentUser.id)"
      class="mb-3 col-md-2 right-btn"
      :link="'/chat/edit/' + $route.params.name"
      >Edit</Button
    >
    <Button class="mb-3 col-md-2 right-btn" :onClick="leaveRoom">Leave</Button>
    <Button class="mb-3 col-md-2" :onClick="InviteToPrivate">Invite</Button>
    <Overlay class="text-left channel">
      <Popup v-model="show_popup">
        <h4>Invite your friend to this channel</h4>
        <InputField
          name="inviter"
          placeholder="Enter The login"
          type="text"
          v-model="inviter"
          class="text-left p-3 my-4"
        ></InputField>
        <Button :onClick="SendInvite" class="px-5">Invite</Button>
      </Popup>
      <div class="mb-2 room px-4">
        <!-- <b-alert show variant="primary">Primary Alert</b-alert> -->
        <div v-if="isLoading">loading</div>
        <MessageBox
          :isDM="false"
          v-else
          v-for="(message, i) in messages"
          :message="message"
          :myRole="myRole"
          :class="'id-' + i"
          :key="i"
          :openHandler="resetTooltips"
        />
      </div>
      <div class="row">
        <div class="col-md-9">
          <InputField
            v-model="msg"
            placeholder="type a message"
            :handler="sendMessage"
            style="font-size: 1.2rem"
          />
          <!-- <span class="error-ms" style="font-size: 1.3rem">errors</span> -->
        </div>
        <div class="col-md-3">
          <Button class="m-0 send-btn" :onClick="sendMessage">Send</Button>
        </div>
      </div>
      <!-- </Overlay> -->
    </Overlay>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import InputField from "@/common/components/UI/InputField.vue";
import { Message } from "@/types/Channel";
import Popup from "@/common/components/UI/Popup.vue";
import MessageBox from "./Message.vue";
@Component<channelRoom>({
  components: { Button, InputField, MessageBox, Popup },
  props: {},
  async beforeRouteLeave(to, from, next) {
    // await this.leaveRoomSocket();
    // alert(this.$store.state.Chat.chatSocket.liste)
    this.$store.state.Chat.chatSocket.removeListener("addAdmin");
    this.$store.state.Chat.chatSocket.removeListener("banUser");
    next();
  },
})
export default class channelRoom extends Vue {
  msg = "";
  // messages: Message[] = [];
  show_popup = false;
  currentChannel: any;
  isLoading = true;
  inviter = "";
  get messages(): Message[] {
    // console.table(this.$store);
    let messages = this.$store.getters["Chat/getChannelMsgs"](
      this.$route.params.name
    );
    // console.log({messages: messages[0].owner});
    return messages;
  }

  get currentChannelId() {
    return this.$route.params.name;
  }

  async fetchMessages(channelId: Number) {
    try {
      await this.$store.dispatch("Chat/fetchMessages", { channelId });
    } catch (e) {
      this.$notify({
        duration: 1000,
        type: "danger",
        title: e.message,
      });
    }
  }

  isAdmin() {
    return this.myRole != "member";
  }

  get myRole() {
    return this.$store.state.Chat.role;
  }
  async leaveRoom() {
    try {
      this.$store.dispatch("Chat/leaveChannel", {
        channelId: Number(this.currentChannelId),
      });
      
    } catch (e) {
      //console.log(e);    
    }
    console.clear();
    this.goBackward();
  }
  async mounted() {
    await this.$store.dispatch("Chat/connectToChatSocket", this.$cookies);
    setTimeout(() => {
      this.$store.dispatch("Chat/fetchMessages", {
        channelId: Number(this.currentChannelId),
      });
      this.$store.dispatch("Chat/listenToChatEvents", {
        channelId: Number(this.currentChannelId),
      });
      this.isLoading = false;
    }, 400);
  }
  resetTooltips() {
    for (var i = 0; i < this.messages.length; i++)
      this.messages[i].showTooltip = false;
  }
  async sendMessage() {
    if (this.msg.trim().length <= 0) return;
    // try {
    await this.$store.dispatch("Chat/sendMessage", {
      channelId: Number(this.$route.params.name),
      msg: this.msg,
      errorCallback: this.errorCallback,
    });
    this.msg = "";
  }
  errorCallback(err: any) {
    //console.log({ err });
    this.$notify({
      duration: 2000,
      type: "danger",
      title: err,
    });
  }
  leaveRoomSocket() {
    // this.$store.dispatch("Chat/leaveChannelSocket", {
    //   channelId: Number(this.$route.params.name),
    // });
  }
  goBackward() {
    this.$router.go(-1);
  }
  updated() {
    //scroll down logic here
    this.scrollToElement();
  }
  scrollToElement() {
    const lastMsgClassName = `id-${this.messages.length - 1}`;
    const el = this.$el.getElementsByClassName(
      lastMsgClassName
    )[0] as HTMLElement;
    if (el) {
      // Use el.scrollIntoView() to instantly scroll to the element
      el.scrollIntoView();
    }
  }
  InviteToPrivate() {
    this.show_popup = true;
  }
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
  }
  async SendInvite() {
    // console.log(this.$props.message.user_id);
    try {
      await this.$store.dispatch("Chat/addMember", {
        channelId: Number(this.$route.params.name),
        login: this.inviter,
      });
      this.show_popup = false;
      this.inviter = "";
    } catch (e) {
      this.$notify({
        duration: 2000,
        type: "danger",
        title: e.response.data.message,
      });
    }
  }
  unmount() {}
}
</script>

<style scoped lang="scss">
.btn_title {
  font-size: 1.3rem !important;
}
input {
  background-color: #2a467e8a;
  border: 0;
}
input:hover {
  background-color: #2a467e8a !important;
  border: 0;
}
.channel {
  overflow: hidden;
  padding: 1.4rem 1.6rem !important;
}
.overlay {
  //   vertical-align: bottom;
  //   // display: table-cell;
  position: relative;
  padding: 13px;
  height: 25rem;
  //   // height: 0px !important;
}

.wrapper {
  // position: absolute;
  // bottom: 0;
  // width: 100%;
}
.send-btn {
  width: 100%;
}
// .right-btn {
//   position: absolute;
//   right: 1%;
// }
.popup {
  position: absolute !important;
}
.inner {
  transform: translate(0%, 20%);
}
input {
  background: #b183cd;
  /* text-align: center; */
}
input:focus {
  background: #b183cd !important;
  border: 0 !important;
  outline: 0 !important;
}
.inner {
  background: #ffffff;
}
.error-msg {
  color: red;
}
</style>
