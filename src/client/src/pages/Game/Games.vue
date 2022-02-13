<template>
  <div>
    <h3>Lives Games</h3>
    <Overlay class="history">
      <div v-if="matches.length">
        <div v-for="match in matches" class="leader_box match_box">
          <div class="left match_history">
            <img src="/assets/img/2.jpg" alt="" />
            <div class="match_content">
              <!-- <h4 class="victory">VICTORY</h4> -->
              <h3>{{ match.score1 }} - {{ match.score2 }}</h3>
            </div>
            <img class="img_right" src="/assets/img/2.jpg" alt="" />
          </div>
          <div class="match_right">
            <img src="/assets/img/map1.jpg" alt="" />
            <div class="content_play">
              <!-- <h6>{{ match.map }}</h6> -->
              <div class="play_time">
                <!-- <span>{{ match.duration }} </span> 
                duration => now - match.created_at (count up)
                -->
              </div>
            </div>
          </div>
          <div class="match_btn">
            <Button :link="'games/' + match.roomId">Watch</Button>
          </div>
        </div>
      </div>
      <div v-else>no matches right now</div>
    </Overlay>
  </div>
  <!--  </section>-->
</template>
<script>
// fetch list of matches and store them
</script>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "../../types/user";
import Button from "@/common/components/UI/Button.vue";
import Overlay from "@/common/components/UI/Overlay.vue";
import { io } from "socket.io-client";

@Component({
  components: { Button, Overlay },
})
export default class MatchHistory extends Vue {
  matches = [
    // {
    //   id: 1,
    //   user1_point: 5,
    //   user2_point: 9,
    //   map: "Classic",
    //   duration: "06:55",
    //   date: "2022/05/12",
    //   link: "/",
    // },
    // {
    //   id: 2,
    //   user1_point: 5,
    //   user2_point: 9,
    //   map: "Classic",
    //   duration: "06:55",
    //   date: "2022/05/12",
    //   link: "/",
    // },
    // {
    //   id: 3,
    //   user1_point: 5,
    //   user2_point: 9,
    //   map: "Classic",
    //   duration: "06:55",
    //   date: "2022/05/12",
    //   link: "/",
    // },
    // {
    //   id: 4,
    //   user1_point: 5,
    //   user2_point: 9,
    //   map: "Classic",
    //   duration: "06:55",
    //   date: "2022/05/12",
    //   link: "/",
    // },
    // {
    //   id: 5,
    //   user1_point: 5,
    //   user2_point: 9,
    //   map: "Classic",
    //   duration: "06:55",
    //   date: "2022/05/12",
    //   link: "/",
    // },
  ];
  socket: any = null;

  created() {
    this.socket = io("http://localhost:3000/game");
    // this.socket.on("matchFound", (roomId: any) => {
    //   // console.log({ roomId });
    //   this.$router.push("/game?id=" + roomId).catch((err) => {});
    // });
    this.socket.on("connect_failed", function (err: any) {
      console.log("Connection Failed");
    });
    this.socket.emit("getLiveGames", (data: any) => {
      // console.log({ data });
      this.matches = data;
      console.log(this.matches);
    });
  }
}
</script>

<style lang="scss" scoped>
.history {
  height: 21rem;
  overflow: scroll;
  .left,
  .match_right {
    // flex: 0 0 calc(30%);
  }
}
.match_history img {
  width: 4rem;
  height: 4rem;
}
.match_history .match_content h3 {
  font-size: 1.2rem;
}
.match_btn {
  display: flex !important;
  align-content: space-around;
  flex-wrap: wrap;
}
</style>
