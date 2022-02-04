<template>
  <div class="friends_lists">
    <div class="friend_list" v-for="friend of blockedFriends">
      <div class="friend-info">
        <img src="/assets/img/2.jpg" alt="" />
        <div class="content">
          <h6>{{ friend.username }}</h6>
          <span>Last online {{ friend.lastSeen }}</span>
        </div>
      </div>
      <div class="friend_actions">
        <!-- <Button :onClick=blockFriend"> -->
        <div @click="unBlockUser(friend)" class="friend_action">
          <CloseSVG />
          <span> UnBlock</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import CloseSVG from "../../../../public/assets/svg/close.svg";

@Component({
  components: { Button, CloseSVG },
})
export default class blockedUsers extends Vue {
  get blockedFriends(): any[] {
    // TODO change type
    return this.$store.state.Friends.blockedUsers;
  }

  unBlockUser(friend: any) {
    this.$store.dispatch("Friends/unBlockUser", friend);
  }
  // count from 0 to 100
  
}
</script>
<style scoped></style>
