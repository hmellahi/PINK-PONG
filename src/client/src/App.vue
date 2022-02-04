<template>
  <div id="app">
    <router-view v-if="isLoginPage"></router-view>
    <span v-else>
      <!-- <SideBar></SideBar> -->
      <Title></Title>
      <div class="col-md-9 m-auto main">
        <div class="row">
          <div class="col-md-3">
            <SideBar></SideBar>
          </div>
          <div class="col-md-9 dashboard_main text-center">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SideBar from "@/common/components/Layout/SideBar.vue";
import { Route, RawLocation } from "vue-router";
import Title from "@/common/components/Layout/Title.vue";
// console.log("----------------------------------------------------------------", Vue.prototype)
@Component<App>({
  components: { Title, SideBar },
  watch: {
    $route(to, from) {
      // this.show =   false;
      // console.log("beforeRouteLeave");
      this.updateIsLoginPage();
    },
  },
})
export default class App extends Vue {
  isLoginPage: boolean = false;

  mounted() {
    this.updateIsLoginPage();
    // console.log(process.env);
    // if (process.env.A == "true") {
    //   console.log("yayks");
    // }
    // this.$http
    //   .get("https://api.github.com/users/mapbox")
    //   .then((response) => console.log({ response }));
  }

  updateIsLoginPage() {
    let paths = ["/login", "/verification_code", "/auth/callback"];
    this.isLoginPage = paths.includes(this.$route.path);
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "Merienda";
  src: local("Merienda"),
    url(../public/assets/fonts/BeatWorddemo.ttf) format("truetype");
}

* {
  // font-family: "Merienda";
}
.main {
  height: 30em;
  // overflow: hidden;
}
</style>
