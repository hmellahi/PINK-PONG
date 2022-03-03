<template>
  <!-- <div><h2>switch</h2></div> -->
  <div>
    <span
      class="toggle-wrapper"
      role="checkbox"
      :aria-checked="value.toString()"
      tabindex="0"
      @click="toggle"
    >
      <span class="toggle-indicator" :style="indicatorStyles" />
      <span class="toggler-text" :style="textStyles">{{ toggleText }}</span>
    </span>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
})
export default class SwitchBtn extends Vue {
  get backgroundStyles() {
    return {
      "gold-mid": this.value,
      "gray-lighter": !this.value,
    };
  }
  get indicatorStyles() {
    return {
      transform: this.value ? "translateX(1.7rem)" : "translateX(0)",
      backgroundColor: this.value ? "#a64c8e" : "#76749f",
    };
  }
  get toggleText() {
    if (this.value) {
      return "ON";
    }
    return "OFF";
    // return {  this.value ? "ON" : "OFF" };
  }
  get textStyles() {
    return { marginLeft: this.value ? "-40%" : "50%" };
  }
  toggle() {
    // console.log("Toggling indicator");
    this.$emit("input", !this.value);
    this.onClick();
  }
}
</script>

<style scoped>
.toggler-text {
  margin-top: 40%;
  height: 100%;
  font-size: 1rem;
  color:black;
  /* position: absolute; */
  /* top:0%; */
  /* left:0% */
}
.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 4rem;
  height: 2rem;
  border-radius: 9999px;
  background-color:   #b076bd;
  border: 2px solid #002247;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  /* box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); */
  transition: background-color 0.4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 80%;
  width: 40%;
  left: 10%;
  top: 10%;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #002247;
  transition: transform 0.4s ease;
}
</style>
