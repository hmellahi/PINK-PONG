<template></template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";
import axios from "axios"
@Component({
  components: { Button },
})
export default class Auth extends Vue {
  beforeCreate(){
    // if ()
  }
  async mounted(){
    // this.$http.post("jhghjg")
  const { VUE_APP_API_URL: API_URL } = process.env;
    // console.log(this.$route.query)
  const token = this.$route.query.code
  try{
    let data = await axios({
        method: 'get',
        url:'http://159.223.102.35:3000/api/auth/callback?code='+token,
    })
    console.log({data})
  }catch(e){
    console.log({e})
  }
  }
  async login() {
    // await this.$store.dispatch("User/login");
  }
}
</script>

<style lang="scss"></style>
