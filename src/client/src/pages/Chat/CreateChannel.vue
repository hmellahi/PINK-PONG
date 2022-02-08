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
      ></InputField>
      <span>If you don't enter a password then its public</span>
      <div>
        <input type="checkbox" class="my_checkbox" v-model="channel.isPrivate" /> <span>Private channel</span>
      </div>
      <h4>{{ errors }}</h4>
      <!-- <InputField :args="propsToPass"></InputField> -->
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
  channel: Channel = { name: "", password: "", isPrivate:false };
  errors = "";
  createChannel() {
    console.log(this.channel.name);
    console.log(this.channel.password);
    let { name, password } = this.channel;
    // TODO CHECK IF CHANNEL NAME IS UNIQUE??
    // if (!isValidInput(name) || !isValidInput(password)) {
    //   this.errors = "name and password must be more then 8 characters";
    //   return;
    // }
    this.$router.push("/chat");
  }
  updateFormDate() {
    console.log("sda");
    // console.log(id, value);
    // this.$set(this.channel, id, value);
  }
}
</script>

<style scoped>
</style>
