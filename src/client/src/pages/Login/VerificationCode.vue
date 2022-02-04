<template>
  <div class="text-center col-md-6 wrapper m-auto">
    <Overlay>
      <h2 class="mb-4">Verification Code</h2>
      <h4>Please enter the verification code sent to Test@test.ma</h4>
      <div class="code_verifation mt-4 px-0">
        <inputField
          type="text"
          class=" mx-auto"
          placeholder="verification code"
          v-model="verificationCode"
        />
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

  handleSubmit(): void {
    if (!this.isValid(this.verificationCode)) return;
    console.log(this.verificationCode);
    this.$router.push({ path: "/" });
  }

  isValid(code: string): boolean {
    // todo verify the code
    return true;
  }
}
</script>

<style lang="scss">
.wrapper {
  padding-top: 16em;
}
</style>
