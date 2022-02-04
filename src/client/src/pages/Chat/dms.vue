<template>
  <div>
    <div class="row" v-for="conversation in dms">
      <router-link
        :to="'channel/' + conversation.name"
        class="leader_box px-5 col-md-9 mx-4"
      >
        <div class="col-md-3 avatar-box">
          <img :src="conversation.avatar" alt="" class="my-auto" />
        </div>
        <div class="col-md-9">
          <div class="Channel_content">
            <div class="conv-name">{{ conversation.name }}</div>
            <span class="conv-msg"> {{ short(conversation.last_msg) }}</span>
          </div>
          <img
            v-if="conversation.isPrivate"
            src="assets/svg/lock.svg"
            alt=""
            class="icon"
          />
        </div>
      </router-link>
      <div
        class="btn col-md-2 mx-auto leader_box"
        @click="deleteConversation(conversation)"
      >
        <img src="/assets/svg/bin.svg" alt="" class="mx-auto" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BinSVG from "../../../public/assets/svg/bin.svg";
import Button from "@/common/components/UI/Button.vue";
import { directMessage } from "@/types/Channel";
// type Conversation = any;

@Component({
  components: { Button, BinSVG },
  props: {
    // onClick: Function,
    // link: {
    //   Type: String,
    //   default: null,
    // },
  },
})
export default class DMS extends Vue {
  dms: directMessage[] = [];
  mounted() {
    this.dms = [
      {
        avatar: "/assets/svg/Avatar.svg",
        name: "leona",
        last_msg:
          "Bdl l password la bghiti Ana makhdamch b tel ghi tl3atli notification bach ntabht ",
      },
    ];
    for (let i = 0; i < 10; i++) this.dms.push(this.dms[0]);
  }
  deleteConversation() {}
  short(msg: String) {
    if (msg.length < 81) return msg;
    return msg.substr(0, 81) + "...";
  }
}
</script>

<style scoped>
.btn_title {
  font-size: 2rem !important;
}
.avatar-box {
  width: 10px;
}
.leader_box {
  background-color: #53137e !important;
}
img {
  width: 4rem;
  height: 4rem;
}
.conv-name {
  font-size: 1.3rem;
}
.conv-msg {
  /* font-size: 1rem; */
}
a {
  text-decoration: none !important;
}
.overlay {
  height: 21rem;
  overflow: scroll;
}
</style>
