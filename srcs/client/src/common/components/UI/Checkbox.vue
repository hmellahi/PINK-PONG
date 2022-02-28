<template>
  <label class="my-container">
    <input
      type="checkbox"
      :value="value"
      class=""
      @input="$emit('input', $event.target.value)"
    />
    <span> {{message}}</span>
  </label>
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
import InputField from "./InputField.vue";
@Component({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    message: String
  },
})
export default class OBJECT extends Vue {
  mounted() {}
}
</script>

<style scoped>

</style>