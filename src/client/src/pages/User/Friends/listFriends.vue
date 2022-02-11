<template>
  <div class="friends_lists">
    <div class="friend_list" v-for="friend of friends">
      <!-- <Friend/> -->
      <div class="friend-info">
        <img :src="friend.avatarUrl" />
        <!-- <img src="/assets/img/2.jpg" alt="" /> -->
        <div class="content">
          <h6>{{ friend.username }}</h6>
          <span>Last online {{ friend.lastSeen }}</span>
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
  blockUser(friend: any) {
    this.$store.dispatch("Friends/blockUser", friend);
  }

  unFriend(friend: any) {
    this.$store.dispatch("Friends/unFriend", friend);
  }
  sendMessage(friend: any) {
    this.$router.push("/chat/channel/" + friend.id);
  }
  get friends(): any[] {
    // TODO change type
    return this.$store.state.Friends.friends;
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
