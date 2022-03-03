<template>
  <div class="history">
    <h3>Match History</h3>
    <div v-if="matches && matches.length">
      <div v-for="match in matches" class="leader_box match_box">
        <div class="left match_history">
          <router-link :to="`/profile/${match.first_user.login}`">
            <img :src="match.first_user.image_url" alt="" />
          </router-link>
          <div class="match_content">
            <h4 :class="getResult(match)">{{ getResult(match) }}</h4>
            <h3>
              {{ match.first_user_score }} : {{ match.second_user_score }}
            </h3>
          </div>
          <router-link :to="`/profile/${match.second_user.login}`">
            <img class="img_right" :src="match.second_user.image_url" alt="" />
          </router-link>
        </div>
        <div class="match_right">
          <img :src="`/assets/img/map${match.map}.jpg`" alt="" />
          <div class="content_play">
            <h6>{{ showMapName(match.map) }}</h6>
            <div class="play_time">
              <!-- <span>{{ match.duration }} </span> -->
              <span>{{ show_date(match.create_date) }}</span>
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
import moment from "moment";

@Component({
  // components: {Title, SideBar },
  props: ["matches", "user"],
})
export default class MatchHistory extends Vue {
  created() {
    window.scrollTo(0, 0);
  }
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
  }
  show_date(date: any) {
    return moment(date).format("MMMM Do YYYY");
  }
  showMapName(map: Number) {
    if (map == 1) return "Vanilla";
    else if (map == 2) return "Speedy";
    else return "Classic";
  }
  scrollToElement() {
    window.scrollTo(0, 0);
  }
  getOpLogin(match: any) {
    // let isMe = match.first_user.id == this.currentUser.id ? 1 : 2;
    if (match.first_user.id == this.$props.user.id) {
      return match.second_user.login;
    } else return match.first_user.login;
  }
  getResult(match: any) {
    //console.log("user id", match.first_user.login);
    let isMe = match.first_user.id == this.$props.user.id ? 1 : 2;
    // console.log(
    //   match.flag,
    //   this.$props.user.id,
    //   match.first_user.id,
    //   match.second_user.id
    // );
    if ((isMe == 1 && match.flag == 2) || (isMe == 2 && match.flag == 1))
      return "Victory";
    else if (match.flag != 0) return "Defeat";
    if (
      (match.first_user_score > match.second_user_score && isMe == 1) ||
      (match.first_user_score < match.second_user_score && isMe == 2)
    )
      return "Victory";
    return "Defeat";
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
.active {
  background: transparent !important;
}
</style>
