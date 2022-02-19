<template>
  <Overlay class="center col-md-6 queue">
    <h3 class="mb-4">FINDING MATCH...</h3>
    <div class="time_finding_match">{{ showCount() }}</div>
    <div class="mt-4">
      <Button link="/">
        <div class="btn_title">CANCEL</div>
      </Button>
    </div>
  </Overlay>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import { io } from "socket.io-client";

@Component<FindMatch>({
  components: { Button },
  async beforeRouteLeave(to, from, next) {
    console.log("sheesh", to.path, from.path);
    // incase if you want to access `this`
    await this.leaveQueue();
    // const self = this as any;
    next();
  },
})
export default class FindMatch extends Vue {
  count = { seconds: 0, minutes: 0 };
  // socket: any = null;

  get socket() {
    return this.$store.state.User.gameSocket;
  }
  mounted() {
    this.countUpTimer();
    let map = this.$route.query.map == undefined ? "1" : this.$route.query.map;
    this.socket.on("matchFound", (roomId: any) => {
      this.$router.push("/game?id=" + roomId).catch((err) => {});
    });
    this.socket.on("connect_failed", function (err: any) {
      console.log("Connection Failed");
    });
    this.socket.on("hehe", () => {
      this.socket.emit(
        "joinQueue",
        { userId: this.currentUser.id, map },
        (data: any) => {
          console.log({ data });
        }
      );
    });
  }

  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
  }

  // beforeUnmount() {
  //   console.log("am leaving...");
  //   this.socket.emit("leaveQueue", { userId: 2 });
  // }

  leaveQueue() {
    this.socket.emit("leaveQueue", { userId: this.currentUser.id });
  }

  pad(num: number, len: number) {
    return Array(len + 1 - num.toString().length).join("0") + num;
  }

  showCount() {
    let { seconds, minutes } = this.count;
    return `${this.pad(minutes, 2)}:${this.pad(seconds, 2)}`;
  }

  countUpTimer() {
    setInterval(() => {
      let { seconds } = this.count;
      if (seconds < 60) this.count.seconds++;
      else {
        this.count.minutes++;
        this.count.seconds = 0;
      }
    }, 1000);
  }

  // beforeRouteEnter(to: any, from: any, next: any) {
  //   console.log("beforeRouteEnter");
  //   next();
  // }

  // beforeRouteUpdate(to: any, from: any, next: any) {
  //   console.log("beforeRouteUpdate");
  //   next();
  // }

  // beforeRouteLeave(to: any, from: any, next: any) {
  //   console.log("beforeRouteLeave", to.path, from.path);
  //   this.leaveQueue();
  //   next();
  // }
}
</script>

<style scoped>
.queue {
  height: 20rem !important;
}
</style>
