<template>
  <div class="msg position-relative">
    <span class="date">[{{ message.createdAt }}]</span>
    <span v-if="!isDM">
      <img src="/assets/svg/medal.svg" v-if="message.isAdmin" alt="" />
    </span>
    <PopperVue
      :show="message.showTooltip"
      class="d-inline"
      id="my-tooltip"
      :options="{
        placement: 'top',
      }"
    >
      <template #popper>
        <div
          id="tooltip"
          @mouseleave="message.showTooltip = false"
          class="col-md-5 p-3"
          :style="tooltipStyles(message)"
        >
          <div id="arrow" data-popper-arrow></div>
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
          <div class="row p-0">
            <div class="col-md-4">
              <Button class="m-0" :link="'/profile/' + message.sender"
                >Profile</Button
              >
            </div>
            <div class="col-md-7 pr-0">
              <Button class="m-0" :onClick="InviteToPlay"
                >Invite To Play
              </Button>
            </div>
            <div class="col-md-4 mt-2">
              <Button class="m-0" :link="'/profile/' + message.sender"
                >Ban</Button
              >
            </div>
            <div class="col-md-8 mt-2 row p-0">
              <div class="col-md-6 w-100">
                <Button class="m-0" :link="'/profile/' + message.sender"
                  >Mute</Button
                >
              </div>
              <!-- <Button class="m-0 d-inline" :link="'/profile/' + message.sender"
                >15s</Button
              > -->
              <div class="col-md-4 p-0">
                <InputField
                  placeholder=""
                  v-model="muteDuration"
                  class="m-0 ml-3 px-2"
                />
              </div>
            </div>
            <!-- <Button class="col-md-6" :link="'/profile/' + message.sender"
              >Ban</Button
            > -->
          </div>
        </div>
      </template>
    </PopperVue>
    <span class="content"> {{ message.message }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import Checkbox from "@/common/components/UI/Checkbox.vue";
import InputField from "@/common/components/UI/InputField.vue";
import { Message } from "@/types/Channel";
import PopperVue from "@soldeplata/popper-vue";

@Component({
  props: {
    isDM: Boolean,
    message: {
      // type: Message, //wtf why?
      required: true,
    },
    openHandler: Function,
  },
  components: { PopperVue, Button, Checkbox, InputField },
})
export default class MessageBox extends Vue {
  muteDuration = "45s";
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
  showMsgTooltip(message: Message) {
    let prevState = message.showTooltip;
    this.$props.openHandler();
    message.showTooltip = !prevState;
  }

  tooltipStyles(message: Message) {
    return {
      marginLeft: !message.isAdmin ? "5%" : "9%",
    };
  }

  InviteToPlay() {
    this.$notify({
      duration: -1,
      // closeOnClick: true,
      type: "info",
      title: "Someone want to play with you !",
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
// .right-div {
//   position: absolute;
//   right: -2%;
//   top: 40%;
// }
/* e8b7ff */
/*b183cd  */
/* ffb5fd */
// wc -l *.ts */*.ts */*/*.ts */*/*/*.ts *.vue */*.vue */*/*.vue */*/*/*.vue
// #arrow,
// #arrow::before {
//   position: absolute;
//   width: 1.5rem;
//   height: 1.5rem;
//   background: inherit;
//   left: 1rem !important;
//   bottom: -0.5rem;
// }

// #arrow {
//   visibility: hidden;
//   //   z-index:;
// }

// #arrow::before {
//   visibility: visible;
//   content: "";
//   transform: rotate(45deg);
//   border-right: 1px solid white;
//   border-bottom: 1px solid white;
// }

#my-tooltip > span {
  z-index: 99999999;
}
// #my-tooltip span[data-popper-placement="top"] #arrow {
//   bottom: -0.3rem;
//   // background: red;
// }

// #my-tooltip span[data-popper-placement="bottom"] {
//   #arrow {
//     top: -1.3rem;
//     // background: red;
//     bottom: 0;
//   }
//   #tooltip {
//     margin-top: 1.3rem;
//   }
// }
// #my-tooltip span[data-popper-placement="bottom"] #arrow::before {
//   border: 0;
//   border-left: 1px solid white;
//   border-top: 1px solid white;
// }

// #my-tooltip[data-popper-placement^="left"] > #arrow {
//   right: -4px;
// }

// #my-tooltip[data-popper-placement^="right"] > #arrow {
//   left: -4px;
// }
</style>
