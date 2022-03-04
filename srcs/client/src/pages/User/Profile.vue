<template>
  <div class="text-left h-100 overflow-hidde profile">
    <Button
      class="text-left px-5 m-0 mb-2 mb-3"
      v-if="!isMyProfile"
      :onClick="goBackward"
      >Back</Button
    >
    <div class="profile_header">
      <div class="profile_cover"></div>
      <div class="profile_header_info">
        <div class="profile_description">
          <div class="user_avatar">
            <div>
              <div class="progress_user">
                <div class="precent"><img :src="user.image_url" /></div>
                <div class="circle"></div>
                <div class="range">
                  <input
                    type="hidden"
                    min="0"
                    max="100"
                    value="50"
                    id="range"
                  />
                  <div class="filled"></div>
                </div>
              </div>
            </div>
            <p class="user_name">{{ user.login }}</p>
            <div class="user_status" v-if="user.status && !isMyProfile">
              <p class="user_status_text">{{ user.status }}</p>
            </div>
            <div class="user_buttons">
              <Button
                v-if="!isMyProfile && !user.isFriend"
                :onClick="sendFriendReq"
                ><i class="fas fa-check"></i> Add Friend
              </Button>
              <!-- <Button
                v-if="!isMyProfile && user.isFriend"
                :onClick="sendUnFriend"
                ><i class="fas fa-check"></i> Unfriend
              </Button> -->
              <Button v-if="!isMyProfile" :onClick="inviteToPlay"
                ><i class="fa fa-table-tennis"></i> InviteToPlay</Button
              >
              <Button v-if="!isMyProfile && !isBlocked" :onClick="blockUser"
                ><i class="fa fa-ban"></i> Block
              </Button>
              <Button v-if="!isMyProfile" :link="`/chat/dms/${user.id}`"
                ><i class="fa fa-message"></i> Dm
              </Button>
            </div>
            <p v-if="message" class="success_msg">{{ message }}</p>
            <div class="user-stats user_stat_left">
              <div class="user-stat">
                <p class="user-stat-title">{{ user.wins + user.losses }}</p>
                <p class="user-stat-text">Games</p>
              </div>
              <div class="user-stat">
                <p class="user-stat-title">{{ achievmentsList.length }}</p>
                <p class="user-stat-text">Achievements</p>
              </div>
            </div>
            <div class="user-stats user_stat_right">
              <div class="user-stat">
                <p class="user-stat-title">{{ user.wins }}</p>
                <p class="user-stat-text">Victories</p>
              </div>
              <div class="user-stat">
                <p class="user-stat-title">{{ user.losses }}</p>
                <p class="user-stat-text">losses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="widget-box">
          <p class="widget-box-title widget_friends">Achievements</p>
          <div class="widget-box-content">
            <div
              class="badges"
              v-if="achievmentsList && achievmentsList.length"
            >
              <div
                class="badge achievment_badge"
                v-for="achievment of achievmentsList"
                :key="achievment.id"
              >
                <img :src="achievment.image" width="46px" alt="badge" />
                <div class="tooltip_achievment">
                  <span>{{ achievment.title }}</span>
                </div>
              </div>
            </div>
            <div class="badges" v-else>There is no Achievements yet</div>
          </div>
        </div>
      </div>
    </div>
    <Overlay class="px-3 pt-3">
      <div class="text-center">
        <div class="">
          <MatchHistory
            class="text-center pt-4"
            :matches="user.matches"
            :user="user"
          ></MatchHistory>
        </div>
      </div>
    </Overlay>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MatchHistory from "../Game/MatchHistory.vue";
import { User } from "../../types/user";
import Button from "@/common/components/UI/Button.vue";

@Component<Profile>({
  components: { MatchHistory, Button },
  watch: {
    $route(to, from) {
      this.updateUserRender();
    },
  },
})
export default class Profile extends Vue {
  user: any = [];
  message = "";
  isMyProfile: boolean = false;
  invited_count: Number = 0;
  achievmentsList: any = [];
  isBlocked: boolean = false;
  // async created() {
  // alert("hey");

  // await this.updateUserRender();
  // }
  async updateUserRender() {
    await this.checkUser();
    await this.fetchMatches();
    this.fetchAchievments();
    this.$store.state.User.gameSocket.on(
      "userStatus",
      ({ userId, status }: any) => {
        // console.log(userId, status);
        if (this.user.id == userId) {
          this.user.status = status;
        }
      }
    );
  }
  async fetchMatches() {
    try {
      //console.log(this.user);
      let data = await this.$http({
        method: "post",
        url: "game/games",
        data: {
          user: this.user,
        },
      });
      this.user.matches = data.data;
      // console.log(this.user.matches);
    } catch (e) {
      //console.log(e);
    }
  }
  get achievments() {
    return this.$store.getters["User/getAchievments"];
  }
  updated() {
    // const lastMsgClassName = `id-${this.messages.length - 1}`;
    const el = this.$el.getElementsByClassName(
      "profile_header"
    )[0] as HTMLElement;
    //console.log(el);
    // Use el.scrollIntoView() to instantly scroll to the element
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
  fetchAchievments() {
    this.achievmentsList = [];
    this.achievments.map((achievment: any) => {
      if (achievment.checker(this.user) == true)
        this.achievmentsList.push(achievment);
      // console.log(achievment)
    });
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
        // console.log(status);
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
    this.isMyProfile = false;
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
      this.$notify({
        duration: 2000,
        ignoreDuplicates: true,
        type: "success",
        title: "You send a request friend to this user",
      });
    } catch (e: any) {
      this.$notify({
        duration: 2000,
        ignoreDuplicates: true,
        type: "danger",
        title: e.response.data.message,
      });
    }
  }
  // async sendUnFriend() {
  //   try {
  //     console.log(this.user.id);
  //     let data = await this.$http.post("friendship/removeFriendship", {
  //       friendshipId: this.user.id,
  //     });
  //     this.$notify({
  //       duration: 2000,
  //       ignoreDuplicates: true,
  //       type: "success",
  //       title: "You remove this friend from your list",
  //     });
  //   } catch (e: any) {
  //     this.$notify({
  //       duration: 2000,
  //       ignoreDuplicates: true,
  //       type: "danger",
  //       title: e.response.data.message,
  //     });
  //   }
  // }
  inviteToPlay() {
    if (this.invited_count == 1)
      this.$notify({
        duration: 1000,
        ignoreDuplicates: true,
        type: "danger",
        title: "You Invite this player , Wch bghitih yl3eb bzz",
      });
    this.$store.state.User.gameSocket.emit(
      "inviteToPlay",
      {
        receiver: this.user.id,
        senderName: this.userCurrent.login ? this.userCurrent.login : "someone",
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
    this.invited_count = 1;
  }
  async blockUser() {
    try {
      let data = await this.$http.post("users/blockUser", {
        userId: this.user.id,
      });
      this.isBlocked = true;
    } catch (e) {
      //console.log(e);
    }
    this.$notify({
      duration: 3000,
      ignoreDuplicates: true,
      type: "info",
      title: "You blocked this user, you can't see their message any more",
    });
  }

  async created() {
    // console.log("im logged again in created");
    // alert("hello")
    await this.updateUserRender();
  }
}
</script>

<style lang="scss" scoped>
.states div div {
  background-color: #2a467e8a !important;
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
.overlay {
  height: 20rem !important;
}
.tooltip {
  background: #2a467e8a;
}
.precent {
  background: #2a467e8a;
}
.precent img {
  width: auto;
  height: auto;
}
.precent {
  background: transparent !important;
}
</style>
