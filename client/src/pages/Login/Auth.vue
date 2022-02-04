<template>
  <section class="main_welcome">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-12 welcpme_main_text text-white">
              <i class="fa fa-table-tennis"></i>
              <h3>Ping Pong</h3>
              <!--                  class="btn btn-lg btn-primary main_button btn-block"-->
              <Button :onClick="login">Sign In with 42</Button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: {Button}

  // components: {Title, SideBar },
})
export default class Auth extends Vue {
  async login() {
    await this.$store.dispatch('User/login')
    // this.$router.push({path: '/verification_code'})
    // this.$router.push('/')
  }
}
</script>

<style lang="scss"></style>
