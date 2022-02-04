<template>
  <div class="search_friends">
    <h3 class="mb-4">Play with friend! Its more fun!</h3>
    <div class="code_verifation">
      <input
        type="text"
        class="form-control change_name_input"
        placeholder="Enter Name"
      />
    </div>

    <Button class="mt-4" :onClick="sendFriendRequest"
      ><i class="fas fa-paper-plane"></i> Send</Button
    >
  </div>
</template>

<script>
import Button from "@/common/components/UI/Button.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: { Button },
})
export default class blockedUsers extends Vue {
  sendFriendRequest() {}
}
// TODO
// show a response shows if the request is send or not
</script>

<style scoped></style>
