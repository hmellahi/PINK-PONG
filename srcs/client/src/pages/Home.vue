<template>
  <Overlay class="center col-md-10">
    <div class="profile_setting">
      <div class="avatar">
        <img src="assets/svg/Avatar-2.svg" />
        <input type="file" id="upload" @change="onFileChange" class="d-none" />
        <label class="avatar_edit" for="upload">
          <img src="/assets/svg/add_photo_alternate.svg" alt=""
        /></label>
      </div>
      <div class="change_name">
        <h3>CHOOSE YOUR AVATAR AND NAME</h3>
        <InputField
          name="username"
          placeholder="Enter Your Name"
          class="text-left p-3 my-4"
          v-model="username"
        ></InputField>
        <div class="my-2">{{ errors }}</div>
      </div>
    </div>
    <div class="col-md-4 p-0 mx-auto">
      <Button :onClick="handleSubmit" class="d-block">
        <PlayButtonSVG />
        START
      </Button>
    </div>
    <!-- <div class="d-flex bd-highlight">
      <div class="p-2 flex-fill bg-light m-1">
        Flex item with a lot of content
      </div>
      <div class="p-2 flex-fill bg-light m-1">Flex item</div>
      <div class="p-2 flex-fill b g-light m-1">Flex item</div>
    </div> -->
  </Overlay>
  <!-- <MatchHistory class="text-center pt-4" :matches="user.matches"></MatchHistory> -->
</template>

<script lang="ts">
import MatchHistory from "./Game/MatchHistory.vue";
import { Component, Vue } from "vue-property-decorator";
import SideBar from "@/common/components/Layout/SideBar.vue";
import Title from "@/common/components/Layout/Title.vue";
import InputField from "@/common/components/UI/InputField.vue";
import Button from "@/common/components/UI/Button.vue";
import { isValidInput } from "@/common/helpers/Validations";
import PlayButtonSVG from "../../public/assets/svg/Play_Icon.svg";
import AVATARSVG from "../../public/assets/svg/Avatar.svg";
import Overlay from "@/common/components/UI/Overlay.vue";
import Game from "@/common/components/Game/Game.vue";

@Component({
  components: {
    Overlay,
    Title,
    SideBar,
    InputField,
    Button,
    PlayButtonSVG,
    AVATARSVG,
    MatchHistory,
  },
})
export default class App extends Vue {
  username = "";
  avatar = {};
  errors = "";

  onFileChange(e: any) {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.avatar = files[0];
    //console.log(this.avatar);
  }
  handleSubmit(): void {
    //console.log(this.username);
    if (!isValidInput(this.username)) {
      this.errors = "username must be atleast 8 characters";
      return;
    }
    // todo register the new user

    this.$router.push({ path: "/play" });
  }
}
</script>

<style>
.avatar {
  width: 195px;
  height: 195px;
  border-radius: 50%;
  padding: 5px;
  background: white;
  position: relative;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar_edit {
  cursor: pointer;
  background: #fff;
  color: #b183cd;
  width: 35px;
  height: 35px;
  position: relative;
  text-align: center;
  border-radius: 50%;
  padding: 5px;
  top: -3em;
  left: -4em;
}
</style>
