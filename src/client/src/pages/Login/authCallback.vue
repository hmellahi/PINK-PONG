<template></template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button },
})
export default class Auth extends Vue {
  beforeCreate(){
    // if ()
  }
  mounted(){
    // this.$http.post("jhghjg")
  }
  async login() {
    // await this.$store.dispatch("User/login");
  }
}
</script>

<style lang="scss"></style>
