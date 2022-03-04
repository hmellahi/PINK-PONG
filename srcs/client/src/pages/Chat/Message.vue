<template>
  <div>
    <Popup v-model="show_popup">
      <div v-if="!isDM">
        <div v-if="canAssignAdmin" class="mb-2">
          <span
            ><input
              class="checkbox_admin"
              type="checkbox"
              :value="isAdmin"
              @change="addAdmin"
            />
            Administrator</span
          >
        </div>
      </div>
      <div class="btn-messages">
        <div>
          <Button :link="'/profile/' + message.owner.login">Profile</Button>
        </div>
        <div v-if="!isDM">
          <Button :onClick="kick" v-if="isAdmin">Kick</Button>
          <Button :onClick="ban" v-if="isAdmin">Ban</Button>
          <div class="mute-message" v-if="isAdmin">
            <select
              v-model="muteDuration"
              class="m-2 ml-3 px-2"
              style="width: 5rem"
            >
              <option value="15">15 min</option>
              <option value="60">1 hr</option>
              <option value="180">3 hr</option>
              <option value="480">8 hr</option>
              <option value="1440">24 hr</option>
            </select>
            <Button :onClick="mute">Mute</Button>
          </div>
        </div>
      </div>
    </Popup>
    <div class="msg position-relative">
      <!-- <span class="date">[{{ message.create_date }}]</span> -->
      <img :src="message.owner.image_url" />
      <span v-if="true">
        <img src="/assets/svg/medal.svg" v-if="message.isAdmin" alt="" />
      </span>
      <span class="sender" @click="showMsgTooltip">
        {{ message.owner.login }}:</span
      >
      <span class="content"> {{ message.msg }}</span>
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
import { User } from "../../types/user";

@Component({
  props: {
    isDM: Boolean,
    message: {
      // type: Message, //wtf why?
      required: true,
    },
    myRole: String,
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
  get isAdmin() {
    let { myRole, message } = this.$props;
    let messageOwnerRole = message.owner.role;
    // console.log({})
    return (
      (myRole == "owner" && messageOwnerRole != "owner") ||
      (myRole == "admin" && messageOwnerRole == "member")
    );
  }
  get canAssignAdmin() {
    let { myRole, message } = this.$props;
    let messageOwnerRole = message.owner.role;
    return (
      myRole != "member" && messageOwnerRole == "member"
    );
  }
  async addAdmin() {
   // console.log(this.$props.message.user_id);
    try {
      await this.$store.dispatch("Chat/addAdmin", {
        userId: this.$props.message.owner.id,
        channelId: this.$route.params.name,
        callback: this.addAdminCallback,
      });
    } catch (e) {}
  }
  addAdminCallback() {
    this.$props.message.owner.role = "admin";
  }
  ban() {
    this.$store.dispatch("Chat/banFromChannel", {
      userId: this.$props.message.owner.id,
      channelId: this.$route.params.name,
      isPermanant: true,
    });
  }
  kick() {
    this.$store.dispatch("Chat/banFromChannel", {
      userId: this.$props.message.owner.id,
      channelId: this.$route.params.name,
      isPermanant: false,
    });
  }
  async mute() {
    var minutesToAdd = this.muteDuration;
    var currentDate = new Date();
    var expireDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    //console.log(expireDate);
    try {
      await this.$store.dispatch("Chat/muteFromChannel", {
        userId: this.$props.message.owner.id,
        channelId: Number(this.$route.params.name),
        expireDate,
      });
      this.$notify({
        duration: 1000,
        type: "success",
        title: "you have muted the user",
      });
    } catch (e) {
      this.$notify({
        duration: 1000,
        type: "danger",
        title: e.response.data.message,
      });
     // console.log({ e });
    }
  }
  mounted() {
    // let newDate = moment(this.$props.message.create_date).format("mm:ss");
    // if (newDate != "Invalid date") this.$props.message.create_date = newDate;
    // console.clear(); UNCOMENT
  }
  showMsgTooltip() {
    if (this.currentUser.id == this.$props.message.owner.id) {
      return;
    }
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
    let user: User = this.$props.message.owner;
    this.$store.state.User.gameSocket.emit(
      "inviteToPlay",
      {
        receiver: user.id,
        senderName: this.currentUser.login ? this.currentUser.login : "someone",
      },
      (data: any) => {
        if (data.err)
          this.$notify({
            duration: 1000,
            type: "danger",
            title: data.msg,
          });
      }
    );
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
    width: 2.6rem;
    border-radius: 50%;
    padding: 5px 5px;
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
