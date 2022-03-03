<template>
  <div class="">
    <!-- <TROPHYLEFTSVG class="ml-auto"/> -->
    <div class="friends_buttons">
      <h2>Leader Board</h2>
      <img
        class="text-left icon icon-left"
        src="/assets/svg/trophy_left.svg"
        alt=""
      />
      <!-- <Button :onClick="showDaily" :class="isDaily ? 'active px-5' : 'px-5'"
        >Daily</Button
      >
      <Button
        :onClick="showLifetime"
        :cla00ss="!isDaily ? 'active px-5' : 'px-5'"
        >Lifetime</Button
      > -->
      <img
        class="text-left icon icon-right"
        src="/assets/svg/trophy_right.svg"
        alt=""
      />
    </div>
    <Overlay class=" mt-4 p-4">
      <div
        v-for="(user, i) in users"
        class="col-md-12 row leaderBoards"
        @click="showProfile(user.login)"
      >
        <div class="btn leader_box col-md-9">
          <div class="left">
            <h3>#{{ i + 1 }}</h3>
            <div class="content">
              <!-- <div class="left2"> -->
              <!-- <img src="/assets/img/2.jpg+" alt="" /> -->
              <!-- </div> -->
              <div class="right2 leader_board">
                <img :src="user.image_url" alt="" />
                <h4>{{ user.login }}</h4>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-2 ml-auto leader_box">
          <h6 class="m-auto">{{ user.wins }} wins</h6>
        </div>
      </div>
    </Overlay>
    <!-- Personal Info Ends -->
  </div>
  <!--  </section>-->
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import TROPHYLEFTSVG from "../../../public/assets/svg/trophy_left.svg";
import { User } from "../../types/user";

@Component({
  components: { Button, TROPHYLEFTSVG },

  // components: {Title, SideBar },
})
export default class LeaderBoard extends Vue {
  users: any = [];
  // dailyRankedUsers: any[] = [];
  // lifeTimeRankedUsers: any[] = [];
  isDaily: boolean = true;

  mounted() {
    this.fetchLeaderBoard();
  }
  async fetchLeaderBoard() {
    try {
      let data = await this.$http({
        method: "get",
        url: "users/usersByGames",
      });
      this.users = data.data;
    } catch (e) {
      console.log(e);
    }
  }
  // showDaily() {
  //   this.users = this.dailyRankedUsers;
  //   this.isDaily = true;
  //   console.log(this.dailyRankedUsers[0].username);
  // }

  // showLifetime() {
  //   this.users = this.lifeTimeRankedUsers;
  //   console.log(this.lifeTimeRankedUsers[0].username);
  //   this.isDaily = false;
  // }
  showProfile(login: String) {
    this.$router.push(`/profile/${login}`);
  }
}
</script>

<style scoped lang="scss">
.icon {
  width: 4rem;
  top: 3%;
  position: absolute;
}
.icon-left {
  left: 4%;
}
.icon-right {
  right: 4%;
}
.overlay {
  height: 21rem;
  overflow: scroll;
}
</style>
