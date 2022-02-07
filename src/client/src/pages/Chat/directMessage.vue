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

@Component({
  components: { Button, InputField, MessageBox },
  props: {},
})
export default class channelRoom extends Vue {
  msg = "";
  messages: Message[] = [];

  mounted() {
    // for (let i = 0; i < 10; i++)
    //   this.messages.push({
    //     sender: "Leona",
    //     content: "wach a drari, daaamn",
    //     isAdmin: false,
    //     date: "20:40",
    //     showTooltip: false,
    //   });
    this.messages.push({
      sender: "karim",
      content: "wach a drari, daaamn",
      isAdmin: false,
      date: "20:40",
      showTooltip: false,
    });
    // for (var i = 0; i < this.messages.length; i++)
    //   this.messages[i].showTooltip = false;
  }
  resetTooltips() {
    for (var i = 0; i < this.messages.length; i++)
      this.messages[i].showTooltip = false;
  }
  sendMessage() {
    if (!this.msg) return;
    this.messages.push({
      sender: "leona",
      content: this.msg,
      isAdmin: true,
      date: "20:40",
      showTooltip: false,
    });
    this.msg = "";
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
  background-color: #53137e;
  border: 0;
}
input:hover {
  background-color: #53137e !important;
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
