<template>
  <div class="a">
    <div class="friends_buttons mb-4 row">
      <Button link="/friends" class="col">Friends ({{ friendsCount }})</Button>
      <Button link="/friends/requests" class="col"
        >Requests ({{ requestCount }})</Button
      >
      <Button link="/friends/blocked" class="col">Blocked</Button>
      <Button link="/friends/add" class="col">Add Friends</Button>
    </div>
    <Overlay class="py-3">
      <router-view></router-view>
      <!-- <div class="spiner">

      </div> -->
    </Overlay>
  </div>
  <!--  </section>-->
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ListFriends from "@/pages/User/Friends/listFriends.vue";
import Button from "@/common/components/UI/Button.vue";
import { catchAction } from "../../../store/Modules/Friends/actions";
@Component({
  components: { Button, ListFriends },
})
export default class Friends extends Vue {
  get friendsCount(): Number {
    return this.$store.getters["Friends/friendsCount"];
  }

  get requestCount(): Number {
    return this.$store.getters["Friends/requestsCount"];
  }

  async mounted() {
    // await console.log(this.$store.state.Friends)
    // console.log("Wtf")
    await catchAction(this.$store, "Friends/fetchBlockedUsers");
    await catchAction(this.$store, "Friends/fetchFriends");
    await catchAction(this.$store, "Friends/fetchRequests");
    // await this.$store.dispatch("Friends/fetchFriends");
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  max-height: 25rem;
  overflow-y: scroll;
}
.a {
  height: 100%;
}
</style>
