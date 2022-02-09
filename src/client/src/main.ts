import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAxios from 'vue-axios';
import axios from './api';
import _Vue from "vue";
// import Swal from 'sweetalert2'

import Overlay from "@/common/components/UI/Overlay.vue";

/************* import files  **************/
import "../public/assets/css/bootstrap.min.css";
import "../public/assets/css/style.css";
// import "../public/assets/css/circle.css";
import "../public/assets/css/skins/blue.css";
/************* import files  **************/

/************* Register components as global  **************/
Vue.component("Overlay", Overlay);
/************* Register components as global  **************/

/************* Register Axios as global (now we can access to with this.$http) **************/
export function AxiosPlugin<AxiosPlugOptions>(
  Vue: typeof _Vue,
  options?: AxiosPluginOptions
): void {
  // do stuff with options
  Vue.prototype.$http = axios;
}
export class AxiosPluginOptions {}
import { AxiosStatic } from "axios";
declare module "vue/types/vue" {
  interface Vue {
    $http: AxiosStatic;
  }
}
/************* Register Axios as global  **************/

Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
