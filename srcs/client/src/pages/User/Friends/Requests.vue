<template>
  <div class="">
    <div v-if="requests && requests.length">
      <div class="friend_list" v-for="request of requests">
        <router-link class="friend-info link_profile" :to="`/profile/${request.sender.login}`" >
          <img :src="request.sender.image_url" alt="" />
          <div class="content">
            <h6>{{ request.sender.login }}</h6>
            <!-- <span>{{ request.sender.status }}</span> -->
          </div>
        </router-link>
        <div class="friend_actions">
          <!-- <Button :onClick=blockFriend"> -->
          <div @click="acceptRequest(request)" class="friend_action">
            <img src="/assets/svg/accept.svg" />
            <!-- <object data="/assets/svg/accept.svg" type="image/svg+xml"></object> -->
            <span> Accept</span>
          </div>
          <div @click="declineRequest(request)" class="friend_action">
            <img src="/assets/svg/close.svg" />
            <span> Decline</span>
          </div>
        </div>
      </div>
    </div>
    <h3 v-else>There is no requests yet</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CloseSVG from "../../../../public/assets/svg/close.svg";
import Button from "@/common/components/UI/Button.vue";
import AcceptSVG from "../../../../public/assets/svg/accept.svg";

@Component({
  components: { Button, AcceptSVG, CloseSVG },
})
export default class Requests extends Vue {
  get requests(): any[] {
    return this.$store.state.Friends.requests;
  }

  declineRequest(request: any) {
    this.$store.dispatch("Friends/declineRequest", request);
  }
  acceptRequest(request: any) {
    this.$store.dispatch("Friends/acceptRequest", request);
  }
}
</script>
<style scoped></style>
