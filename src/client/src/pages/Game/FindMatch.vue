<template>
  <Overlay class="center col-md-6">
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

@Component({
  components: { Button },
})
export default class FindMatch extends Vue {
  count = { seconds: 0, minutes: 0 };

  created() {
    this.countUpTimer();
    let mapName = this.$route.query.map;
    let mapname = mapName == undefined ? "map1" : mapName;
    console.log(mapname)
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
}
</script>

<style scoped>
/* .btn_title {
  font-size: 2rem;
} */
</style>
