<template>
  <div>
    <!-- <header class="header"> -->
    <!-- Fixed Navigation Starts -->
    <!-- <ul class="icon-menu d-none d-lg-block">
      <li v-for="link in links" :class="iconClass(link.path)">
        <i :class="link.icon"></i>
        <router-link :to="link.path">
          <h2>{{ link.name }}</h2>
        </router-link>
      </li>
    </ul> -->
    <div class="ml-2 side">
      <Button
        class="w-100 mb-3 ml-4 text-left px-3 position-relative"
        v-for="(link, i) in links"
        :link="link.path"
        :class="iconClass(link.path)"
        :key="i"
      >
        <span
          ><i :class="link.icon"></i>
          <h2 class="d-inline ml-2 title">
            {{ link.name.toUpperCase() }}
          </h2></span
        >
      </Button>
      <Button
        :onClick="logout"
        class="w-100 mb-3 ml-4 text-left px-3 position-relative"
      >
        <span
          ><i class="fas fa-sign-out-alt"></i>
          <h2 class="d-inline ml-2 title">LOGOUT</h2></span
        >
      </Button>
    </div>
    <!-- Fixed Navigation Ends -->
    <!-- Mobile Menu Starts -->
    <!-- <nav role="navigation" class="d-block d-lg-none">
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <ul class="list-unstyled" id="menu">
          <li v-for="link in links" :class="iconClass(link.path)">
            <router-link :to="link.path">
              <i :class="link.icon"></i><span>{{ link.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav> -->
  </div>
  <!-- Mobile Menu Ends -->
  <!-- </header>  -->
</template>

<script lang="ts">
import Button from "@/common/components/UI/Button.vue";
import { Component, Vue } from "vue-property-decorator";
import { Link } from "@/types/Link";
@Component<SideBar>({
  watch: {
    $route(to, from) {
      this.links = [...this.links];
    },
  },
  components: { Button },
})
export default class SideBar extends Vue {
  links: Link[] = [];

  mounted() {
    this.links = [
      { name: "Play", icon: "fa fa-table-tennis", path: "/" },
      { name: "Profile", icon: "fa fa-user", path: "/profile/mine" },
      { name: "Social", icon: "fa fa-user-friends", path: "/friends" },
      { name: "LeaderBoard", icon: "fa fa-trophy", path: "/leaderBoard" },
      { name: "Games", icon: "fa fa-trophy", path: "/games" },
      { name: "Chat", icon: "fa fa-comment", path: "/chat" },
      { name: "Settings", icon: "fa fa-cogs", path: "/settings" },
    ];
  }

  iconClass(path: string) {
    let currentRoute = this.$router.currentRoute.path;
    let className = "icon-box";
    className += currentRoute.includes(path) && path != "/" ? " active" : "";
    return className;
  }
  async logout() {
    try {
      let data = await this.$http({
        method: "get",
        url: "auth/logout",
      });
      this.$router.push("/login");
    } catch (e) {
      // console.log({e})
      return;
    }
  }
}
</script>
// ba
<style lang="scss">
.side {
  margin-right: 9%;
  span {
    position: absolute;
    top: 20%;
    color: #fff;
    //  vertical-align: middle
  }
  .title {
    font-size: 1.5rem;
  }
  a,
  button {
    border: 3px solid #2a467e8a;
    background-color: transparent !important;
    color: white;
    box-shadow: inset 0px 0px 5px 1px #2a467e8a;

    font-weight: bold;
    border-radius: 10px;
    height: 3.2rem;
    :hover {
      // background-color: white !important;
    }
  }
  h2 {
    font-family: "BeatWorddemo" !important;
    font-size: 1.6rem !important;
  }
}
.active {
  // border: 0 !important;
}
</style>
