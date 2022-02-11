<template>
  <Game :roomId="$route.params ? $route.params.id : ''" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Game from "@/common/components/Game/Game.vue";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button, Game },
})
export default class Auth extends Vue {
  // socket:any = null
  created() {
    // console.log(this.$route.params)
    // console.log("The id is: " + this.$route.query.id);
  }
  //   this.socket = io("http://localhost:3000/game");
  //   this.socket.on("paddleMoves", (roomId: any) => {
  //     console.log({ roomId });
  //     this.$router.push("/game?id=" + roomId);
  //   });
  //   this.socket.emit("paddleMoves", { userId: 2 }, (data: any) => {
  //     console.log({ data });
  //   });
  // }
}
</script>

<style scoped></style>
