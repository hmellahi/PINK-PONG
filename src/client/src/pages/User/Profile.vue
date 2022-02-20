<template>
  <div class="text-left h-100 overflow-hidde profile">
    <Button
      class="text-left px-5 m-0 mb-2 mb-3"
      v-if="!isMyProfile"
      :onClick="goBackward"
      >Back</Button
    >
    <div class="infos infos_profile px-5 text-center mb-4">
      <div class="avatar_profile">
        <img class="mx-3" :src="user.avatar_url" alt="" />
        <p class="user-name p-0 text-center my-auto">{{ user.login }}</p>
        {{ user.status }}
        <Button
          class="w-100 m-0 mb-3 f1"
          v-if="!isMyProfile && !user.isFriend"
          :onClick="sendFriendReq"
          >Send Friend Request</Button
        >
        <Button
          class="w-100 m-0 mb-0 f1"
          v-if="!isMyProfile"
          :onClick="inviteToPlay"
          >InviteToPlay</Button
        >
        <p v-if="message" class="success_msg">{{ message }}</p>
      </div>
      <!-- <Button class="w-100 m-0 mb-0 f1" :onClick="sendFriendReq"
            >Send Friend Request</Button
          > -->
      <div class="row mt-2 states">
        <div class="col-md-6">
          <div class="col-md-12">Games</div>
        </div>
        <div class="col-md-6">
          <div class="col-md-12 ml-0">{{ user.wins + user.losses }}</div>
        </div>
        <div class="col-md-6 mt-2">
          <div class="col-md-12 ml-0">Win</div>
        </div>
        <div class="col-md-6 mt-2">
          <div class="col-md-12 ml-0">{{ user.wins }}</div>
        </div>
        <div class="col-md-6 mt-2">
          <div class="col-md-12 ml-0">Lost</div>
        </div>
        <div class="col-md-6 mt-2">
          <div class="col-md-12 ml-0">{{ user.losses }}</div>
        </div>
      </div>
    </div>
    <Overlay class="px-3 pt-3">
      <div class="text-center">
        <div class="">
          <MatchHistory
            class="text-center pt-4"
            :matches="user.matches"
          ></MatchHistory>
        </div>
      </div>
    </Overlay>
    <!-- <h1>{{user}}</h1> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MatchHistory from "../Game/MatchHistory.vue";
import { User } from "../../types/user";
import Button from "@/common/components/UI/Button.vue";

@Component<Profile>({
  components: { MatchHistory, Button },
})
export default class Profile extends Vue {
  user: any = [];
  message = "";
  isMyProfile: boolean = false;
  mounted() {
    this.checkUser();
    this.fetchMatches();
    console.log(this.user);
    this.$store.state.User.gameSocket.on(
      "userStatus",
      ({ userId, status }: any) => {
        console.log(userId, status);
        if (this.user.id == userId) {
          this.user.status = status;
        }
      }
    );
  }
  async fetchMatches() {
    try {
      let data = await this.$http({
        method: "get",
        url: "game/games",
        data: {
          user: this.user,
        },
      });
      this.user.matches = data.data;
      console.log(this.user.matches);
    } catch (e) {
      console.log(e);
    }
  }

  async getUserStatus(id: number) {
    let statuss = "Offline";
    // if (this.userCurrent.id === id) {
    //   return "Online";
    // }
    await this.$store.state.User.gameSocket.emit(
      "getUserStatus",
      id,
      (status: string) => {
        console.log(status);
        this.user.status = status;
        statuss = status;
        return status;
      }
    );
    // console.log("hey");
    return statuss;
  }
  get userCurrent() {
    return this.$store.getters["User/getCurrentUser"];
  }
  goBackward() {
    this.$router.go(-1);
  }
  async checkUser() {
    if (this.$route.path == "/profile/mine") {
      this.user = this.userCurrent;
      this.isMyProfile = true;
    } else {
      try {
        let data = await this.$http({
          method: "get",
          url: "users/profile/" + this.$route.params.login,
        });
        this.user = data.data;
        this.user = {
          ...this.user,
          status: await this.getUserStatus(this.user.id),
        };
        if (data.data.login == this.userCurrent.login) this.isMyProfile = true;
      } catch (e) {
        this.$router.push("/notFound");
      }
    }
  }
  async sendFriendReq() {
    try {
      let data = await this.$http.post("friendship/sendFriendRequest", {
        recieverLogin: this.$route.params.login,
      });
      this.message = "Added User succefuly";
    } catch (e) {
      this.message = e.response.data.message;
    }
  }

  inviteToPlay() {
    console.log({ u: this.user });
    this.$store.state.User.gameSocket.emit(
      "inviteToPlay",
      {
        receiver: this.user.id,
        senderName: this.userCurrent.login ? this.userCurrent.login : "someone",
      },
      (msg: any) => {
          this.$notify({
            duration: -1,
            type: "danger",
            title: msg.msg,
          });
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.states div div {
  background-color: #53137e !important;
  padding: 0rem;
  font-size: 1.2rem;
  border: 1px solid black;
}

.user-name {
  font-size: 1.5rem;
}
.leader_box {
  justify-content: space-evenly !important;
}
</style>
