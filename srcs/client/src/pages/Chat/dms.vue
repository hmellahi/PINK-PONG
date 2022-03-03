<template>
  <div>
    <div v-if="dms && dms.length">
      <div class="row" v-for="conversation in dms">
        <router-link
          :to="'/chat/dms/' + getFriend(conversation).id"
          class="leader_box px-5 col-md-11 mx-4"
        >
          <div class="col-md-3 avatar-box">
            <img
              :src="getFriend(conversation).image_url"
              alt=""
              class="my-auto"
            />
          </div>
          <div class="col-md-9">
            <div class="Channel_content">
              <div class="conv-name">{{ getFriend(conversation).login }}</div>
              <span class="conv-msg"> {{ conversation.status_user }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <h4 v-else>There is no conversation yet</h4>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BinSVG from "../../../public/assets/svg/bin.svg";
import Button from "@/common/components/UI/Button.vue";
import { directMessage } from "@/types/Channel";
import { Channel } from "../../types/Channel";
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
  dms: any[] = [];
  async mounted() {
    try {
      let data: any = await this.$http.get("chat/getAllDms");
      let DmsList = data.data;
      this.dms = [];
      DmsList.map(async (object: any) => {
        this.$store.state.User.gameSocket.emit(
          "getUserStatus",
          object.user.id,
          (status: string) => {
            this.dms.push({ ...object, status_user: status });
            return status;
          }
        );
      });
      this.$store.state.User.gameSocket.on(
        "userStatus",
        ({ userId, status }: any) => {
          this.dms.map((object: any, i: any) => {
            if (object.user.id == userId) {
              this.dms[i].status_user = status;
            }
          });
        }
      );
      //console.log(this.dms);
      // this.dms = [...this.dms, ...data.data];
    } catch (e) {}
  }
  getFriend(dm: any) {
    return dm.user;
  }
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
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
  background-color: #2a467e8a !important;
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
.enter {
  font-size: 4rem;
}
.overlay {
  height: 21rem;
  overflow: scroll;
}
</style>
