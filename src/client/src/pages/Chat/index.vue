<template>
  <div>
    <div class="row mb-4">
      <div class="friends_buttons">
        <Button link="/chat"> Channels</Button>
        <Button link="/chat/private">My Channels</Button>
        <Button link="/chat/DirectMessages">DMS</Button>
      </div>
      <div class="ml-auto">
        <Button link="/chat/create">Create Channel</Button>
      </div>
    </div>
    <Overlay> <router-view :channels="channels" /></Overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ListChannels from "@/pages/Chat/listChannels.vue";
import Button from "@/common/components/UI/Button.vue";
import { Channel } from "../../types/Channel";

@Component({
  components: { Button, ListChannels },
  watch: {
    $route(to, from) {
      // this.updateIsLoginPage();
    },
  },
})
export default class Chat extends Vue {
  async mounted() {
    await this.$store.dispatch("Chat/fetchChannels");
    await this.$store.dispatch("Chat/fetchMyChannels");
  }
  get channels(): any {
    return this.$store.state.Chat.publicChannels;
  }
}
</script>

<style scoped>
.overlay {
  height: 24rem!important;
  /* overflow: scroll; */
}
</style>
