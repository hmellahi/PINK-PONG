<template>
  <div>
    <div class="row mb-4">
      <div class="friends_buttons">
        <Button class="px-5" :onClick="goBackward">Back</Button>
      </div>
      <!-- <div class="ml-auto"></div> -->
    </div>
    <Overlay>
      <div class="row">
        <form class="text-center col-12">
          <!-- <InputField
            name="name"
            placeholder="Enter Name"
            v-model="channel.name"
            class="input-text p-3 col-md-6 my-4"
          ></InputField> -->
          <!-- <InputField
            name="password"
            type="password"
            placeholder="Enter Old Password"
            class="center p-3 col-md-6 my-4"
            v-model="channel.oldPassword"
          ></InputField> -->
          <h2>{{ channel.name }}</h2>
          <InputField
            name="password"
            type="password"
            placeholder="Enter New Password"
            class="input-text p-3 col-md-6 my-4"
            autocomplete="true"
            v-model="channel.password"
          ></InputField>
          <h4>{{ errors }}</h4>
          <Button :onClick="editChannel" class="mt-4 px-4">Save</Button>
          <Button :onClick="deleteChannel" class="mt-4 px-4">Delete</Button>
        </form>
      </div>
    </Overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import InputField from "@/common/components/UI/InputField.vue";
import Button from "@/common/components/UI/Button.vue";
import { Channel } from "@/types/Channel";
import { isValidInput } from "@/common/helpers/Validations";

@Component({
  components: { InputField, Button },
})
export default class editChannel extends Vue {
  channel: Channel = { name: "WHOS 1v1", type: "", isLocked: false };
  oldPassword = "";
  newPassword = "";
  errors = "";
  mounted() {
    // TODO fetch the channel
    // console.log(this.$route.params.name);
    // show channel data
    // this.channel = { name: "WHOS FOR 1V1" };
  }
  editChannel() {
    // console.log(this.channel.name);
    // console.log(this.channel.password);
    // let { name, password } = this.channel;
    // TODO CHECK IF CHANNEL NAME IS UNIQUE??
    // if (!isValidInput(name) || !isValidInput(password)) {
    //   this.errors = "name and password must be more then 8 characters";
    //   return;
    // }
    this.$router.push("/chat");
  }
  goBackward() {
    this.$router.go(-1);
  }
  deleteChannel() {
    this.$router.push("/chat");
  }
  updateFormDate() {
    let { newPassword, oldPassword } = this;
    // console.log({ name: this.  channel.name, oldPassword, newPassword });
  }
}
</script>

<style scoped></style>
