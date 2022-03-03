<template>
  <div class="text-left">
    <Button
      class="ml-0 mb-3 col-md-2"
      v-if="this.$route.path != '/profile/mine'"
      :onClick="goBackward"
      >Back</Button
    >

    <Overlay class="p-3">
      <div class="mb-4 room px-4">
        <MessageBox
          :isDM="true"
          v-for="(message, i) in messages"
          :message="message"
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
        </div>
        <div class="col-md-3">
          <Button class="m-0 send-btn" :onClick="sendMessage">Send</Button>
        </div>
      </div>
    </Overlay>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import InputField from "@/common/components/UI/InputField.vue";
import { Message } from "@/types/Channel";
import MessageBox from "./Message.vue";

@Component<channelRoom>({
  components: { Button, InputField, MessageBox },
  props: {},
  async beforeRouteLeave(to, from, next) {
    // await this.leaveRoomSocket();
    // alert(this.$store.state.Chat.chatSocket.liste)
    // this.$store.state.Chat.chatSocket.removeListener("messageDm");
    next();
  },
})
export default class channelRoom extends Vue {
  msg = "";
  isLoading = true;

  async mounted() {
    await this.$store.dispatch("Chat/connectToChatSocket", this.$cookies);
    setTimeout(() => {
      this.fetchMessages();
      this.isLoading = false;
    }, 700);
  }

  get messages() {
    return this.$store.getters["Chat/getDMmsgs"](
      this.$route.params.id,
      this.currentUser.id
    );
  }

  resetTooltips() {
    for (var i = 0; i < this.messages.length; i++)
      this.messages[i].showTooltip = false;
  }

  async fetchMessages() {
    try {
      await this.$store.dispatch("Chat/fetchDMS", {
        userId: Number(this.$route.params.id),
      });
    } catch (e) {
      this.$notify({
        duration: 1000,
        type: "danger",
        title: e.message,
      });
    }
  }
  async sendMessage() {
    if (this.msg.trim().length <= 0) return;
    await this.$store.dispatch("Chat/sendMessage", {
      userId: Number(this.$route.params.id),
      msg: this.msg,
      isDM: true,
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
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
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
}
</script>

<style scoped lang="scss">
.btn_title {
  font-size: 1.3rem !important;
}
input {
  background-color: #e8b7ff87;
  border: 0;
}
input:hover {
  background-color: #b183cd8f !important;
  border: 0;
}
.overlay {
  //   vertical-align: bottom;
  //   // display: table-cell;
  position: relative;

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
.right-btn {
  position: absolute;
  right: 1%;
}
</style>
