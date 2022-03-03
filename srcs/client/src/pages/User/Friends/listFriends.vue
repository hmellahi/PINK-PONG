<template>
  <div class="friends_lists">
    <div v-if="friends && friends.length">
      <div class="friend_list" v-for="friend of friends">
        <!-- <Friend/> -->
        <router-link
          class="friend-info link_profile"
          :to="`/profile/${friend.user.login}`"
        >
          <img :src="friend.user.image_url" />
          <!-- <img src="/assets/img/2.jpg" alt="" /> -->
          <div class="content">
            <h6>{{ friend.user.login }}</h6>
            <span>{{ friend.status_user }}</span>
          </div>
        </router-link>
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
  friends: any = [];
  async blockUser(friend: any) {
    await this.$store.dispatch("Friends/blockUser", friend);
    this.$store.dispatch("Friends/fetchBlockedUsers");
    await this.fetchFriends();
  }

  async unFriend(friend: any) {
    await this.$store.dispatch("Friends/unFriend", friend);
    await this.fetchFriends();
  }
  sendMessage(friend: any) {
    this.$router.push(`/chat/dms/${friend.user.id}`);
  }
  get friendsList(): any[] {
    return this.$store.state.Friends.friends;
  }

  async getUserStatus(id: number) {
    let statuss = "Offline";
    await this.$store.state.User.gameSocket.emit(
      "getUserStatus",
      id,
      (status: string) => {
      //  console.log({ status });
        statuss = status;
        return status;
      }
    );
    return statuss;
  }

  async fetchFriends() {
    await this.$store.dispatch("Friends/fetchFriends");
    this.friends = [];
    const newData = this.friendsList.map(async (object: any) => {
      this.$store.state.User.gameSocket.emit(
        "getUserStatus",
        object.user.id,
        (status: string) => {
          this.friends.push({ ...object, status_user: status });
          return status;
        }
      );
    });
    this.$store.state.User.gameSocket.on(
      "userStatus",
      ({ userId, status }: any) => {
        this.friends.map((friend: any, i: any) => {
          if (friend.user.id == userId) {
            this.friends[i].status_user = status;
          }
        });
      }
    );
  }
  async mounted() {
    await this.fetchFriends();
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
