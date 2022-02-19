<template>
  <div class="history">
    <h3>Match History</h3>
    <div v-if="matches && matches.length">
      <div v-for="match in matches" class="leader_box match_box">
        <div class="left match_history">
          <img :src="match.player1.avatar_url" alt="" />
          <div class="match_content">
            <h4 :class="match.type">{{ match.type }}</h4>
            <h3>{{ match.score1 }} : {{ match.score2 }}</h3>
          </div>
          <img class="img_right" :src="match.player2.avatar_url" alt="" />
        </div>
        <div class="match_right">
          <img :src="match.map" alt="" />
          <div class="content_play">
            <h6>{{ match.map_name }}</h6>
            <div class="play_time">
              <span>{{ match.duration }} </span>
              <span>{{ match.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>There is no Match History Yet</div>
  </div>
  <!--  </section>-->
</template>
<script>
// fetch list of matches and store them
</script>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "../../types/user";
@Component({
  // components: {Title, SideBar },
  props: {
    matches: [],
  },
})
export default class MatchHistory extends Vue {
  created() {}
}
</script>

<style lang="scss">
.history {
  height: 21rem;
  overflow: scroll;
  .left,
  .match_right {
    // flex: 0 0 calc(30%);
  }
}
</style>
