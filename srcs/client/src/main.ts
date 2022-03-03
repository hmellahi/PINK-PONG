import Component from "vue-class-component";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAxios from 'vue-axios';
import axios from './api';
import _Vue from "vue";
import Overlay from "@/common/components/UI/Overlay.vue";
import moment from 'moment-timezone'
import VueSweetalert2 from 'vue-sweetalert2';
import Notifications from 'vue-notification'
import VueCookies from 'vue-cookies';



// for games page timer
moment.tz.setDefault('Africa/Casablanca')

/************* import files  **************/
import "../public/assets/css/bootstrap.min.css";
import "../public/assets/css/style.css";
// import "../public/assets/css/circle.css";
import "../public/assets/css/skins/blue.css";
import 'sweetalert2/dist/sweetalert2.min.css';

/************* import files  **************/

// Register the router hooks with their names
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate",
]);


/************* Register components as global  **************/
Vue.component("Overlay", Overlay);
/************* Register components as global  **************/

// Vue.prototype.$http = API;
// import Axios from "axios";
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

Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
Vue.use(Notifications);
Vue.use(VueCookies);


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
