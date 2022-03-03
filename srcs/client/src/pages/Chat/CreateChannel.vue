<template>
  <div class="row">
    <div class="text-center col-12">
      <InputField
        name="name"
        placeholder="Enter Name (*)"
        v-model="channel.name"
        class="input-text p-3 col-md-6 my-4"
      ></InputField>
      <InputField
        name="password"
        placeholder="Enter Password"
        class="input-text p-3 col-md-6 my-4"
        v-model="channel.password"
        type="password"
        autocomplete="true"
        :disabled="channel.isLocked"
      ></InputField>
      <span>If you don't enter a password then its public</span>
      <div>
        <input type="checkbox" class="my_checkbox" v-model="channel.isLocked" />
        <span>Private channel</span>
      </div>
      <h4>{{ errors }}</h4>
      <Button :onClick="createChannel" class="mt-4">Create</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import InputField from "@/common/components/UI/InputField.vue";
import Button from "@/common/components/UI/Button.vue";
import { Channel } from "@/types/Channel";
import { isValidInput } from "@/common/helpers/Validations";
import Checkbox from "@/common/components/UI/Checkbox.vue";
@Component({
  components: { InputField, Button, Checkbox },
})
export default class createChannel extends Vue {
  channel: Channel = {
    name: "",
    type: "public",
    isLocked: false,
    password: "",
  };
  errors = "";
  async createChannel() {
    let { name, password } = this.channel;
    // if (!isValidInput(name) || !isValidInput(password)) {
    //   this.errors = "name and password must not be empty";
    //   return;
    // }
    if (this.channel.isLocked) this.channel.type = "private";
    else if (password != "") this.channel.isLocked = true;
    try {
      await this.$store.dispatch("Chat/createChannel", this.channel);
      // this.$router.go(-1);
      this.$notify({
        duration: 3000,
        type: "success",
        title: "Channel Created successfully",
      });
      this.$router.push("/chat/private");
    } catch (e) {
      // this.$notify({
      //   duration: 3000,
      //   type: "danger",
      //   title: e.message,
      // });
      this.errors = e.response.data.message;
    }
  }
  updateFormDate() {
    //console.log("sda");
    // console.log(id, value);
    // this.$set(this.channel, id, value);
  }
}
</script>

<style scoped></style>
