<template>
  <div class="friends_lists">
    <div v-if="friends.length">
      <div class="friend_list" v-for="friend of friends">
        <!-- <Friend/> -->
        <div class="friend-info">
          <img :src="friend.user.avatar_url" />
          <!-- <img src="/assets/img/2.jpg" alt="" /> -->
          <div class="content">
            <h6>{{ friend.user.login }}</h6>
            <span>{{ friend }}</span>
          </div>
        </div>
        <div class="friend_actions">
          <div @click="sendMessage(friend)" class="friend_action">
            <!-- <DMSSVG /> -->
            <img src="/assets/svg/dms.svg" />
            <span>DM</span>
            <!-- </div> -->
          </div>
          <div @click="unFriend(friend)" class="friend_action">
            <img src="/assets/svg/unfriend.svg" />
            <span>Unfriend</span>
          </div>
          <!-- <Button :onClick=blockFriend"> -->
          <div @click="blockUser(friend)" class="friend_action">
            <img src="/assets/svg/close.svg" />
            <!-- <CloseSVG /> -->
            <span> Block</span>
            <!-- </Button> -->
          </div>
        </div>
      </div>
    </div>
    <h3 v-else>There is no friends Yet</h3>
    <!-- <PulseLoader /> -->
    <!-- <div class="spiner">

      </div> -->
  </div>
</template>

<script lang="ts">
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { Component, Vue } from "vue-property-decorator";
import CloseSVG from "../../../../public/assets/svg/close.svg";
import DMSSVG from "../../../../public/assets/svg/dms.svg";
import UNFRINEDSVG from "../../../../public/assets/svg/unfriend.svg";
import Button from "@/common/components/UI/Button.vue";
import Friend from "@/common/components/Friends/Friend.vue";

@Component({
  components: { Button, CloseSVG, DMSSVG, UNFRINEDSVG, PulseLoader, Friend },
})
export default class listFriends extends Vue {
  status: string = "";
  async blockUser(friend: any) {
    await this.$store.dispatch("Friends/blockUser", friend);
    this.$store.dispatch("Friends/fetchBlockedUsers");
  }

  async unFriend(friend: any) {
    await this.$store.dispatch("Friends/unFriend", friend);
  }
  sendMessage(friend: any) {
    this.$router.push("/chat/channel/" + friend.id);
  }
  get friends(): any[] {
    let friendsList: any[] = this.$store.state.Friends.friends;
    // friendsList = friendsList.map((friend, index): any => {
    //   return {
    //     ...friend,
    //     status_user: this.getUserStatus(friend.user.id, index),
    //   };
    // });
    return friendsList;
  }
  set friends(value: any[]) {
    this.$store.state.Friends.friends = value;
  }
  async getUserStatus(id: number, index: number) {
    await this.$store.state.User.gameSocket.emit(
      "getUserStatus",
      id,
      (status: string) => {
        console.log({ index }, { status });
        // this.status = status;
        this.friends[index].status_user = status;
        console.table(this.friends[index]);
      }
    );
  }
  async mounted() {
    await this.$store.dispatch("Friends/fetchFriends");
    this.friends.map((friend: any, index: number) => {
      this.getUserStatus(friend.user.id, index);
    });
    this.$store.state.User.gameSocket.on(
      "userStatus",
      ({ userId, status }: any) => {
        console.log(userId, status);
        // this.friends.map((friend, i) => {
        //   if (friend.user.id == userId) {
        //     this.friends[i].status_user = status;
        //   }
        // });
      }
    );
  }
}
</script>
<style>
.spiner {
  width: 40px;
  height: 40px;
  background-color: red;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translate(-50% -50%);
}
</style>
