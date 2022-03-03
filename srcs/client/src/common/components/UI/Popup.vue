<template>
  <div class="overlay-popup popup" v-show="value">
    <div class="text-center p-4 inner col-md-4 mx-auto my-auto col-md-5">
      <Button class="close-icon bg-transparent" :onClick="onClose">
        <img src="/assets/svg/close_mark.svg" /> </Button
      ><slot></slot>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button },
  props: {
    value: {
      required: true,
    },
  },
})
export default class Popup extends Vue {
  // visible = true;
  created() {
    // console.log("visible", this.visible);
    // this.visible = true;
    // this.Show = show;
  }
  onClose() {
    this.$emit("input", !this.value);
    // this.visible = false;
    //console.log("show", this.show);
  }
}
</script>

<style scoped>
.overlay-popup {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgb(16 22 54 / 70%);
  z-index: 9999;
  overflow: hidden;
}
.inner {
  background: #2a467e8a;
  position: relative;
  border: white 3px solid;
  transform: translate(0%, 50%);
  border-radius: 15px;
  margin-top: 30px;
}
.close-icon {
  position: absolute;
  top: -10%;
  right: -3rem;
  background: transparent !important;
}
.btn-friends {
  margin: 0.3rem 0.5rem;
}
</style>
