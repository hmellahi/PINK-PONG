<template>
  <div class="overlay"><slot></slot></div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Overlay extends Vue {}
</script>

<style scoped>
.overlay {
  background: rgba(0, 0, 0, 0.3);
  padding: 40px;
  border-radius: 15px;
  overlay:scroll
  /* height: 100%; */
}
</style>
