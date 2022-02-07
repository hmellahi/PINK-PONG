<template>
  <Overlay class="position-relative center">
    <!-- ><h1>Settings</h1> -->
    <div class="mb-5">
    <div class="mt-4 update_info">
      <div class="setting_user">
      <div class="avatar_setting">
        <img :src="image" class="avatar_change" />
        <input type="file" id="upload" ref="avatar" @change="onFileChange" class="d-none" />
        <label class="avatar_edit" for="upload">
          <img src="/assets/svg/add_photo_alternate.svg" alt=""
        /></label>
      </div>
      <div style="width:100%">
        <InputField
          name="username"
          placeholder="Change Your Name"
          class="text-left p-3 my-4"
          v-model="user.username"
        ></InputField>
        <p class="success_msg" v-if="success">{{ success }}</p>
        <!-- <Button class="text-left px-5 m-0 mb-2" :onClick="UpdateUsername">Update</Button> -->
      </div>
      </div>
    </div> 
      <div v-for="(setting, i) in settings" class="row">
        <h2 class="text-left col-8">{{ setting.name }}</h2>
        <SwitchBtn class="ml-0 col-4" v-model="setting.isActive"></SwitchBtn>
        <!-- :onClick="toggle(i)" -->
      </div>

      <div class="col-12 px-0 fa_factor" v-if="settings[2].isActive && !isVerified">
        <!-- {{process}} -->
        <img src='http://127.0.0.1:3000/api/auth/2fa/generate' />
        <div class="verify_factor">
          <InputField
            class="text-left"
            v-model="email"
            placeholder="Enter the pin code"
          ></InputField>
          {{error}}
          <Button class="text-left px-5 m-0 mb-2" :onClick="verify">Verify</Button>
        </div>
      </div>    
    </div>

    <div class="text-right">
      <Button :onClick="save" class="text-left mx-0 px-5">Update</Button>
      <!-- <Button :onClick="logout">Logout</Button> -->
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
  error="";
  avatar = {};
  isActive = false;
  isVerified = false;
  success = "";
  image = this.user.avatarUrl;
  onFileChange(e: any) {
    // var files = e.target.files || e.dataTransfer.files;
    // if (!files.length) return;
    // this.avatar = files[0];
    // console.log(this.avatar);
      let input = this.$refs.avatar
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload =   (e:Event) => {
          if (e)
            this.image = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      } 
  }
  async verify(){
     try {
       let data = await this.$http({
        method: 'post',
        url:'auth/2fa/enableTwoFactorAuth',
        data:{
          code:this.email
        },
        withCredentials: true,

        headers:{
          'Access-Control-Allow-Origin':'http://127.0.0.1:5000',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
      // http://159.223.102.35:3000/api/auth/2fa/generate
      console.log({data})
      this.isVerified = true;
    }catch(e){
      console.log({e})
      this.error = "verification code isnt valid"
      return;
    }
  }
  UpdateUsername(){
    this.success = "its Update Succefully";
  }
  get user() {
    // return this.$store.getters["User/getCurrentUser"];
    return Object.assign({},this.$store.getters["User/getCurrentUser"])
  }
  // logout!: () => any;
  mounted() {
    // this.logout();
  }
  created() {
    this.settings = [
      { name: "Music", isActive: true },
      { name: "Sound", isActive: true },
      { name: "2-Factor Authentication", isActive: this.user.two_factor_auth_enabled },
    ];
  }
  toggle(i: any) {}
  save() {}
}
</script>

<style lang="scss">
.br {
  position: absolute;
  right: 0rem;
  bottom: 1rem;
}
InputField {
  font-size: 1.4rdem;
}
.setting_user{
    display: flex;
}
.avatar_setting{
  text-align:left;
}
.avatar_setting .avatar_edit{
    position: relative;
    left: 4rem;
    background: #fff;
    border-radius: 50%;
    padding: 5px 6px;
    top: -2rem;
}
.avatar_edit img{
  width: 23px;
}
</style>
