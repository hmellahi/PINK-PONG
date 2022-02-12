<template>
  <div class="history">
      <h3>Lives Games</h3>
    <div v-for="match in matches" class="leader_box match_box">
      <div class="left match_history">
        <img src="/assets/img/2.jpg" alt="" />
        <div class="match_content">
          <!-- <h4 class="victory">VICTORY</h4> -->
          <h3>{{ match.user1_point }} - {{ match.user2_point }}</h3>
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
      <div class="match_btn">
       <Button :link="match.link">Watch</Button>
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
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button },
})
export default class MatchHistory extends Vue {
    matches = [
        {
            id: 1,
            user1_point: 5,
            user2_point: 9,
            map: "Classic",
            duration: "06:55",
            date: "2022/05/12",
            link: "/"
        },
        {
            id: 2,
            user1_point: 5,
            user2_point: 9,
            map: "Classic",
            duration: "06:55",
            date: "2022/05/12",
            link: "/"
        },
        {
            id: 3,
            user1_point: 5,
            user2_point: 9,
            map: "Classic",
            duration: "06:55",
            date: "2022/05/12",
            link: "/"
        },
        {
            id: 4,
            user1_point: 5,
            user2_point: 9,
            map: "Classic",
            duration: "06:55",
            date: "2022/05/12",
            link: "/"
        },
        {
            id: 5,
            user1_point: 5,
            user2_point: 9,
            map: "Classic",
            duration: "06:55",
            date: "2022/05/12",
            link: "/"
        }
    ]
  created() {}
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
.match_btn{
    display: flex!important;
    align-content: space-around;
    flex-wrap: wrap;
}
</style>
