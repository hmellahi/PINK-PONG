<template>
  <div>
    <div class="row mb-4">
      <div class="friends_buttons">
        <Button link="/chat">Public Channels</Button>
        <Button link="/chat/private">Private Channels</Button>
        <Button link="/chat/DirectMessages">DMS</Button>
      </div>
      <div class="ml-auto">
        <Button link="/chat/create">Create Channel</Button>
      </div>
    </div>
    <Overlay> <router-view /></Overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ListChannels from "@/pages/Chat/listChannels.vue";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button, ListChannels },
})
export default class Chat extends Vue {}
</script>

<style scoped>
.overlay {
  height: 21rem;
  overflow: scroll;
}
</style>
