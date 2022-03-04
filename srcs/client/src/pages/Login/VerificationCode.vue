<template>
  <div class="text-center col-md-6 wrapper m-auto">
    <Overlay>
      <h2 class="mb-4">Verification Code</h2>
      <!-- <h4>Please enter the verification code sent to google </h4> -->
      <div class="code_verifation mt-4 px-0">
        <inputField
          type="text"
          class="mx-auto"
          placeholder="verification code"
          v-model="verificationCode"
        />
        {{ error }}
      </div>
      <Button class="mt-4 px-4" :onClick="handleSubmit"
        ><i class="fas fa-check"></i> Sign In</Button
      >
    </Overlay>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import InputField from "@/common/components/UI/InputField.vue";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { InputField, Button },
})
export default class VerificationCode extends Vue {
  verificationCode: string = "";
  error = "";

  async handleSubmit() {
    if (!this.isValid(this.verificationCode))
      this.error = "verification code isnt valid";
    // console.log(this.verificationCode);
    try {
      let data = await this.$http({
        method: "post",
        url: "auth/2fa/login",
        data: {
          code: this.verificationCode,
        },
      });
      // console.log({data})
      this.$router.push({ path: "/" });
    } catch (e) {
      //console.log({e})
      this.error = "verification code isnt valid";
      return;
    }
  }

  isValid(code: string): boolean {
    // todo verify the code
    return code.length != 0;
  }
}
</script>

<style lang="scss">
.wrapper {
  padding-top: 16em;
}
</style>
