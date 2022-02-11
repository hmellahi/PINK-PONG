<template>
  <div id="app">
    <router-view v-if="isLoginPage"></router-view>
    <span v-else>
      <div class="container">
        <div class="col-md-12 mx-auto main">
          <Title class="text-left"></Title>
          <div class="row">
            <div class="col-md-3">
              <SideBar></SideBar>
            </div>
            <div class="col-md-9 dashboard_main text-center">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SideBar from "./common/components/Layout/SideBar.vue";
import { Route, RawLocation } from "vue-router";
import Title from "./common/components/Layout/Title.vue";
import {mapActions, mapGetters} from 'vuex';


@Component<App>({
  components: { Title, SideBar },
  watch: {
    $route(to, from) {
      this.updateIsLoginPage();
    },
  },
})
export default class App extends Vue {
  isLoginPage: boolean = false;
  
  mounted() {
    this.updateIsLoginPage();
    this.FetchUser();
  }

  updateIsLoginPage() {
    /******  Check if the route one of this path if yes then lets update the bool val ********/
    let paths = ["/login", "/verification_code", "/auth/callback"];
    this.isLoginPage = paths.includes(this.$route.path);
  }
  async FetchUser() {
    try {
       let data = await this.$http({
        method: 'get',
        url:'users/me',
        withCredentials: true,
        headers:{
          'Access-Control-Allow-Origin':'http://localhost:5000/',
          'Access-Control-Allow-Credentials': 'true'
        }
      })
      console.log(data.data)
      this.$store.commit("User/setUser", data.data);
    }catch(e){
      console.log({e})
    }
  }
}
</script>
