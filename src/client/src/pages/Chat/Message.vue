<template>
  <div>
    <Popup v-model="show_popup">
      <div v-if="!isDM">
        <div v-if="true" class="mb-2">
          <span
            ><input
              class="checkbox_admin"
              type="checkbox"
              :value="message.isAdmin"
            />
            Administrator</span
          >
        </div>
      </div>
      <div class="btn-messages">
        <Button class="m-0" :link="'/profile/' + message.sender"
          >Profile</Button
        >
        <Button class="m-0" :onClick="InviteToPlay">Invite To Play</Button>
        <Button class="m-0" :link="'/profile/' + message.sender">Ban</Button>
        <div class="mute-message">
          <!-- <InputField
            placeholder=""
            v-model="muteDuration"
            class="m-2 ml-3 px-2"
            style="width: 5rem"
          /> -->
          <select v-model="muteDuration" class="m-2 ml-3 px-2" style="width: 5rem">
            <option value="15">15 min</option>
            <option value="60">1 hr</option>
            <option value="180">3 hr</option>
            <option value="480">8 hr</option>
            <option value="1440">24 hr</option>
          </select>
          <Button class="m-0" :link="'/profile/' + message.sender">Mute</Button>
        </div>
      </div>
    </Popup>
    <div class="msg position-relative">
      <span class="date">[{{ message.createdAt }}]</span>
      <span v-if="!isDM">
        <img src="/assets/svg/medal.svg" v-if="message.isAdmin" alt="" />
      </span>
      <span class="sender" @click="showMsgTooltip"> {{ message.sender }}:</span>
      <span class="content"> {{ message.message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import Checkbox from "@/common/components/UI/Checkbox.vue";
import InputField from "@/common/components/UI/InputField.vue";
import { Message } from "@/types/Channel";
import Popup from "@/common/components/UI/Popup.vue";

@Component({
  props: {
    isDM: Boolean,
    message: {
      // type: Message, //wtf why?
      required: true,
    },
    openHandler: Function,
  },
  components: { Popup, Button, Checkbox, InputField },
})
export default class MessageBox extends Vue {
  muteDuration = 15;
  show_popup = false;
  options = {
    placement: "top",
    // modifiers: [
    //   {
    //     offset: {
    //       offset: "-1,0",
    //     },
    //   },
    // ],
  };
  mounted() {}
  showMsgTooltip() {
    this.show_popup = !this.show_popup;
  }

  tooltipStyles(message: Message) {
    return {
      marginLeft: !message.isAdmin ? "5%" : "9%",
    };
  }
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
  }
  InviteToPlay() {
    this.$store.state.User.gameSocket.emit("inviteToPlay", {
      reciever: this.$props.message.user_id, //TODO CHANGE
      senderName: this.currentUser.login ? this.currentUser.login : "someone",
    });
  }
}
</script>

<style scoped lang="scss">
.msg {
  .sender {
    color: #e8b7ff;
    font-size: 1.3rem;
    cursor: pointer;
  }
  img {
    // font-size: 1rem;
    width: 1.3rem;
    // position:absolute;
    // top:20%
  }
  #tooltip {
    background: #b183cd;
    border: 1px solid white;
    border-radius: 10px;
    z-index: 999999;
    // background-color: red;
    // margin-left: 19%;
    margin-bottom: 0.6rem;
    span {
      font-size: 1.3rem;
      font-weight: bold;
    }
    a {
      font-size: 1rem !important;
      // width: 100%;
    }
  }
}
.popup {
  position: absolute !important;
}
.form-control {
  height: calc(1.5em + 0.75rem + 5px);
}
#my-tooltip > span {
  z-index: 99999999;
}
.dashboard_main .overlay {
  padding: 20px;
}
</style>
