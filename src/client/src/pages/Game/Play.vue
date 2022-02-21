<template>
  <Overlay class="">
    <h3 class="mb-4">CHOOSE A MAP</h3>
    <div class="row mb-4">
      <div class="col-sm-12 col-md-4">
        <div :class="boxMapClass('1')">
          <a href="#" @click="updateMap('1')">
            <img src="/assets/img/map1.jpg"
          /></a>
          <h3>Vanilla</h3>
        </div>
      </div>
      <div class="col-sm-12 col-md-4">
        <div :class="boxMapClass('2')">
          <a href="#" @click="updateMap('2')">
            <img src="/assets/img/map2.jpg"
          /></a>
          <h3>Speedy</h3>
        </div>
      </div>
      <div class="col-sm-12 col-md-4">
        <div :class="boxMapClass('3')">
          <a href="#" @click="updateMap('3')">
            <img src="/assets/img/map3.jpg"
          /></a>
          <h3>Classic</h3>
        </div>
      </div>
    </div>
    <Button :link="'/find_match?map=' + selected">FIND MATCH</Button>
  </Overlay>
  <!--  </section>-->
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Button from "@/common/components/UI/Button.vue";

@Component({
  components: { Button },
})
export default class Play extends Vue {
  selected: String = "1";
  connection: any = null;
  updateMap(mapname: String) {
    this.selected = mapname;
  }
  boxMapClass(mapname: String) {
    return "box_map " + (mapname == this.selected ? "selected" : "");
  }
}
</script>

<style lang="scss" scoped>
h3 {
  color: #e8b7ff;
  font-weight: bold;
}
.selected img {
  border: 2px solid #4be0aa;
}
.selected h3 {
  color: #4be0aa;
  font-weight: bold;
}
</style>
