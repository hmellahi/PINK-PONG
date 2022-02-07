import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Overlay from "@/common/components/UI/Overlay.vue";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import API from "./api";

// import 'dotenv/config'
// console.log(process.env)
import "../public/assets/css/bootstrap.min.css";
import "../public/assets/css/style.css";
import "../public/assets/css/circle.css";
import "../public/assets/css/skins/blue.css";

Vue.config.productionTip = false;
// register overlay component gloably
Vue.component("Overlay", Overlay);

// Vue.prototype.$http = API;
import VueAxios from 'vue-axios'
import axios from './api'
// import "./types/http.d.ts"
import _Vue from "vue";
// import Axios from "axios";
export function AxiosPlugin<AxiosPlugOptions>(
  Vue: typeof _Vue,
  options?: AxiosPluginOptions
): void {
  // do stuff with options
  Vue.prototype.$http = axios;
}
export class AxiosPluginOptions {
  // add stuff
}
import { AxiosStatic } from "axios";
declare module "vue/types/vue" {
  interface Vue {
    $http: AxiosStatic;
  }
}

Vue.use(VueAxios, axios, BootstrapVue, IconsPlugin)

new Vue({
  router,
  store,
  
  render: (h) => h(App),
}).$mount("#app");
