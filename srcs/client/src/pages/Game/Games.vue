<template>
  <div>
    <h3>Lives Games</h3>
    <Overlay class="history">
      <div v-if="matches && matches.length">
        <div v-for="match in matches" class="leader_box match_box">
          <div class="left match_history">
            <img :src="match.user1.image_url" alt="" />
            <div class="match_content">
              <!-- <h4 class="victory">VICTORY</h4> -->
              <h3>{{ match.score1 }} - {{ match.score2 }}</h3>
            </div>
            <img class="img_right" :src="match.user2.image_url" alt="" />
          </div>
          <div class="match_right">
            <img :src="`/assets/img/map${match.map}.jpg`" alt="" />
            <div class="content_play">
              <!-- <h6>{{ match.map }}</h6> -->
              <div class="play_time">
                <span> {{ showCount(match.created_at) }} </span>
                <!--  duration => now - match.created_at (count up)
                -->
              </div>
            </div>
          </div>
          <div class="match_btn">
            <Button :link="'game?id=' + match.roomId">Watch</Button>
          </div>
        </div>
      </div>
      <h3 v-else>no matches right now</h3>
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
import moment from "moment";

let gameEvents = ["getLiveGames"];
@Component<MatchHistory>({
  components: { Button, Overlay },
  async beforeRouteLeave(to, from, next) {
    gameEvents.map((event) => {
      this.socket.removeListener(event);
    });
    next();
  },
})
export default class MatchHistory extends Vue {
  matches: any = [];
  count = { seconds: 0, minutes: 0 };

  get socket() {
    return this.$store.state.User.gameSocket;
  }
  showCount(date: Date) {
    return moment(date).fromNow();
  }
  async fetchUser(id: Number) {
    try {
      const player1 = await this.$http.get(`users?id=${id}`);
      return player1;
    } catch (error) {
      return;
    }
  }
  async created() {
    this.socket.on("connect_failed", function (err: any) {
      // console.log("Connection Failed");
    });
    this.socket.emit("getLiveGames", (data: any) => {
      const newData = data.map(async (object: any) => {
        const user1 = (await this.fetchUser(object.player1)) as any | undefined;
        const user2 = (await this.fetchUser(object.player2)) as any | undefined;
        // console.log({ game: object });
        // console.log({ user1 });
        this.matches.push({ ...object, user1: user1.data, user2: user2.data });
      });
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
  // background-color: red  !important;;
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
