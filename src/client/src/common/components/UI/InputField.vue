<template>
  <input
    type="text"
    class="form-control change_name_input"
    :value="value"
    @input="$emit('input', $event.target.value)"
    v-on:keyup.enter="handler"
  />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component({
  props: {
    handler: {
      type: Function,
      default: () => {},
    },
    value: {
      // type: Boolean,
      required: true,
    },
  },
})
export default class InputField extends Vue {
  mounted() {}
  // updateFormDate(event) {
  //   // console.log(id, value);
  //   // this.$set(this.channel, id, value);
  // }
  // get proxyValue() {
  //   return this.value;
  // }
  // set proxyValue(){ this.$emit('input', newValue); }
}
</script>

<style scoped>
input {
  background: #b183cd;
  /* text-align: center; */
}
input:focus {
  background: #b183cd !important;
  border: 0 !important;
  outline: 0 !important;
}
</style>
