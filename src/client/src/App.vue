<template>
  <div id="app">
    <notifications class="my-style">
      <template slot="body" slot-scope="props">
        <div>
          <a class="title">
            {{ props.item.title }}
          </a>
          <a class="close" @click="props.close">
            <i class="fa fa-fw fa-close"></i>
          </a>
          <div v-if="!props.item.text" @click="props.close">
            <button
              class="btn btn-primary"
              @click="
                AcceptRequest(props.item.data)
              "
            >
              Accept
            </button>
            |
            <button
              class="btn btn-danger"
              style="background: #f44336"
              @click="declineRequest"
            >
              Decline
            </button>
          </div>
          <div v-else>
            <span v-html="props.item.text"></span>
          </div>
        </div>
      </template>
    </notifications>
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
import { io } from "socket.io-client";
import { mapActions, mapGetters } from "vuex";

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
  socket: any = null;

  listenToGameChannelEvents() {
    // count to 10
  }

  async mounted() {
    this.updateIsLoginPage();
    await this.$store.dispatch("User/connectToGameSocket", this.$cookies);
    this.listenToGameChannelEvents();
  }

  updateIsLoginPage() {
    /******  Check if the route one of this path if yes then lets update the bool val ********/
    let paths = ["/login", "/verification_code", "/auth/callback"];
    this.isLoginPage = paths.includes(this.$route.path);
  }
  AcceptRequest(data:any) {
    // console.log("im here");
    // this.$notify({
    //   type: "success",
    //   title: "Nice you accept the request",
    //   text: "Lets plaaaay !!",
    // });
    // console.table(this.$props.item);
    let { senderSocketId, senderId}  = data;
    console.log({ senderSocketId, senderId });
    this.$store.dispatch("User/acceptInvitation", {
      senderSocketId,
      senderId,
    });
  }
  declineRequest() {}
}
</script>

<style lang="scss">
.my-style {
  .vue-notification-wrapper {
    padding: 10px;
    margin: 0 5px 5px;

    font-size: 12px;

    color: #ffffff;
    background: #44a4fc;
    border-left: 5px solid #187fe7;

    .warn {
      background: #ffb648;
      border-left-color: #f48a06;
    }

    .error {
      background: #e54d42;
      border-left-color: #b82e24;
    }

    .success {
      background: #68cd86;
      border-left-color: #42a85f;
    }
  }
}
</style>
