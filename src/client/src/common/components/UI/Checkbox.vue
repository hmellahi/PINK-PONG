<template>
  <label class="my-container">
    <input
      type="checkbox"
      :value="value"
      class=""
      @input="$emit('input', $event.target.value)"
    />
    <!-- <input type="checkbox" v-model="value" /> -->
    <span class="checkmark"></span>
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
  },
  components: {
    InputField,
    
  },
})
export default class OBJECT extends Vue {
  mounted() {}
}
</script>

<style scoped>
.my-container {
  position: relative;
}
/* Hide the browser's default checkbox */
.my-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: -0.99rem;
  right: 0;
  height: 1.7rem;
  width: 1.7rem;
  background-color: #ffb5fd;
  cursor: pointer;
  border: 2px solid #0c284f;
  border-radius: 3px;
}

/* On mouse-over, add a grey background color */
.my-container:hover input ~ .checkmark {
  /* background-color: rgb(255, 181, 253); */
}

/* When the checkbox is checked, add a blue background */
.my-container input:checked ~ .checkmark {
  background-color: #2196f3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.my-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.my-container .checkmark:after {
  left: 9px;
  top: .2rem;
  width: .5rem;
  height: 1rem;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
