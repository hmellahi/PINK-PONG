<template>
  <div class="friends_lists">
    <div v-if="blockedFriends && blockedFriends.length">
      <div class="friend_list" v-for="friend of blockedFriends">
        <router-link class="friend-info link_profile" :to="`/profile/${friend.user.login}`" >
          <img :src="friend.user.image_url" alt="" />
          <div class="content">
            <h6>{{ friend.user.login }}</h6>
            <span> online</span>
          </div>
        </router-link>
        <div class="friend_actions">
          <!-- <Button :onClick=blockFriend"> -->
          <div @click="unBlockUser(friend)" class="friend_action">
            <CloseSVG />
            <span> UnBlock</span>
          </div>
        </div>
      </div>
    </div>
    <h3 v-else>There is no Blocked User yet</h3>
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
    return this.$store.state.Friends.blockedUsers;
  }

  unBlockUser(friend: any) {
    this.$store.dispatch("Friends/unBlockUser", friend);
  }
  // count from 0 to 100
}
</script>
<style scoped></style>
