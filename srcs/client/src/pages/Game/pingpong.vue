<template>
  <Game :roomId="$route.params ? $route.params.id : ''" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Game from "@/common/components/Game/Game.vue";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button, Game },
  watch: {
    $route(to, from) {
      //console.log("route switched");
      // this.leaveGame();
    },
  },
  beforeRouteLeave(to, from, next) {
   //("beforeRouteLeave", to.path, from.path);
    // await this.leaveGame();
    next();
  },
})
export default class Auth extends Vue {
  // socket:any = null
  created() {
    // console.log(this.$route.params)
    //console.log("The room id is: " + this.$route.query.id);
  }
  beforeUnmount() {
    //console.log("am leaving...");
  }
}
</script>

<style scoped></style>
