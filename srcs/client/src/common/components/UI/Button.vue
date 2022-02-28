<template>
  <router-link v-if="link != null" :to="link" class="btn btn-friends btn_title">
    <slot></slot>
  </router-link>
  <button v-else class="btn btn-friends btn_title" @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button },
  props: {
    onClick: Function,
    link: {
      Type: String,
      default: null,
    },
  },
})

export default class Auth extends Vue {
  mounted() {}
}
</script>

<style scoped>
.btn_title {
  font-size: 1.3rem;
}
/* a{
} */
</style>
