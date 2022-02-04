<template>
  <Overlay class="position-relative center">
    <!-- ><h1>Settings</h1> -->
    <div class="mb-5">
      <div v-for="(setting, i) in settings" class="row">
        <h2 class="text-left col-8">{{ setting.name }}</h2>
        <SwitchBtn class="ml-0" v-model="setting.isActive"></SwitchBtn>
        <!-- :onClick="toggle(i)" -->
      </div>

      <div class="col-8 px-0" v-if="settings[2].isActive">
        <InputField
          class="text-left"
          v-model="email"
          placeholder="Enter your email"
        ></InputField>
      </div>
    </div>

    <div class="br px-5">
      <Button :onClick="save" class="text-left mx-0">Save</Button>
      <Button :onClick="logout">Logout</Button>
    </div>
  </Overlay>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SwitchBtn from "@/common/components/UI/SwitchBtn.vue";
import InputField from "@/common/components/UI/InputField.vue";
import Button from "@/common/components/UI/Button.vue";
import { mapActions } from "vuex";

@Component({
  components: { SwitchBtn, Button, InputField },
  computed: {
    // ...mapActions({
    //   logout: "User/logout",
    // }),
  },
})
export default class Settings extends Vue {
  settings: any[] = [];
  email = "";
  isActive = false;
  // logout!: () => any;
  logout() {}
  mounted() {
    // this.logout();
  }
  created() {
    this.settings = [
      { name: "Music", isActive: true },
      { name: "Sound", isActive: true },
      { name: "2-Factor Authentication", isActive: false },
    ];
  }
  toggle(i: any) {}
  save() {}
}
</script>

<style lang="scss">
.br {
  position: absolute;
  right: -6%;
  bottom: 5%;
}
InputField {
  font-size: 1.4rdem;
}
</style>
