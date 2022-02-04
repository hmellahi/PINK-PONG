<template>
  <div class="history">
    <div v-for="match in matches" class="leader_box match_box">
      <div class="left match_history">
        <img src="/assets/img/2.jpg" alt="" />
        <div class="match_content">
          <h4 class="victory">VICTORY</h4>
          <h3>{{ match.result }}</h3>
        </div>
        <img class="img_right" src="/assets/img/2.jpg" alt="" />
      </div>
      <div class="match_right">
        <img src="/assets/img/map1.jpg" alt="" />
        <div class="content_play">
          <h6>{{ match.map }}</h6>
          <div class="play_time">
            <span>{{ match.duration }} </span>
            <span>{{ match.date }}</span>
          </div>
        </div>
      </div>
    </div>
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
