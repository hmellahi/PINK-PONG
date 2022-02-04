<template>
  <Game />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Game from "@/common/components/Game/Game.vue";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button,Game },
  props: {},
})
export default class Auth extends Vue {
  mounted() {}
}
</script>

<style scoped></style>
