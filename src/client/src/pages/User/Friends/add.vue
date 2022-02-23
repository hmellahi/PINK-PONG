<template>
  <div class="search_friends">
    <h3 class="mb-4">Play with friend! Its more fun!</h3>
    <div class="code_verifation">
      <input
        type="text"
        class="form-control change_name_input"
        placeholder="Enter Name"
        v-model="login"
      />
      <p class="success_msg" v-if="message">{{ message }}</p>
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
  login = "";
  message = "";
  async sendFriendRequest() {
      try {
        let data = await this.$http.post("friendship/sendFriendRequest", {recieverLogin: this.login});
        this.message = "Added User succefuly";
        this.login = "";
      } catch (e) {
        this.message = e.response.data.message
      }
  }
}
</script>

<style scoped>
.overlay{
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: space-evenly;
}
</style>
