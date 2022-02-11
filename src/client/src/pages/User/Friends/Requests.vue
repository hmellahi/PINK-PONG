<template>
  <div class="">
    <div class="friend_list" v-for="request of requests">
      <div class="friend-info">
        <img src="/assets/img/2.jpg" alt="" />
        <div class="content">
          <h6>{{ request.login }}</h6>
          <span>Online</span>
        </div>
      </div>
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
    // TODO change type
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
