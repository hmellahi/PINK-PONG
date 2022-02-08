<template>
  <div class="text-left h-100 overflow-hidde profile">
    <Button
      class="text-left px-5 m-0 mb-2 mb-3"
      v-if="this.$route.path != '/profile/mine'"
      :onClick="goBackward"
      >Back</Button
    >
    <div class="infos infos_profile px-5 text-center mb-4">
          <div class="avatar_profile">
            <img class="mx-3" :src="user.avatarUrl" alt="" />
            <p class="user-name p-0 text-center my-auto">{{
              user.username
            }}</p>
          </div>
          <!-- <Button class="w-100 m-0 mb-0 f1" :onClick="sendFriendReq"
            >Send Friend Request</Button
          > -->
          <div class="row mt-2 states">
            <div class="col-md-6">
              <div class="col-md-12">Games</div>
            </div>
            <div class="col-md-6">
              <div class="col-md-12 ml-0">{{ user.wins + user.loses }}</div>
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
              <div class="col-md-12 ml-0">{{ user.loses }}</div>
            </div>
          </div>
        </div>
    <Overlay class="px-3 pt-3">
      <!-- // col-md-10"> -->
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

@Component({
  components: { MatchHistory, Button },
})
export default class Profile extends Vue {
  created() {}
  get user() {
    return this.$store.getters["User/getCurrentUser"];
  }
  goBackward() {
    this.$router.go(-1);
  }
  sendFriendReq() {}
}
</script>

<style lang="scss" scoped>
.states div div {
    background-color: #53137e !important;
    padding: 0rem;
    font-size: 1.2rem;
    border: 1px solid black;
    // border-radius: 25px;
  // margin-left:2rem
}

.user-name {
  font-size: 1.5rem;
}
.leader_box{
  justify-content: space-evenly!important;
}
// .infos {
//   // border-right: 1px solid white;
//   overflow: hidden;
//   position: relative;
// }
// .infos:after {
//   content: ""; // todo read abt wt content is
//   height: 80%; //You can change this if you want smaller/bigger borders
//   width: 1px;

//   position: absolute;
//   right: 0;
//   top: 10%; // If you want to set a smaller height and center it, change this value

//   background-color: white; // The color of your border
// }
// .f1 {
//   font-size: 10rem !important;
// }
// .profile .overlay {
//   height: 90%; // tod00o
//   // height: 100%; // todo
// }
</style>
