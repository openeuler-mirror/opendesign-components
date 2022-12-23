<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { PopupPosition, OPopup } from '../index';

const content = 'this is popup content';
const btn1 = ref(null);
const btn2 = ref(null);
const btn3 = ref(null);
const btn4 = ref(null);
const btn5 = ref(null);
const btn6 = ref(null);
const btn7 = ref(null);
const btn8 = ref(null);
const btn9 = ref(null);
const btn10 = ref(null);
const btn11 = ref(null);
const btn12 = ref(null);
</script>
<template>
  <h4>popup position</h4>
  <div class="position-wrap">
    <div class="top">
      <OButton ref="btn1"> TL </OButton>
      <OPopup :position="PopupPosition.TL" :target="btn1">TL {{ content }} </OPopup>
      <OButton ref="btn2"> TOP </OButton>
      <OPopup :position="PopupPosition.TOP" :target="btn2">T {{ content }} </OPopup>
      <OButton ref="btn3">TR</OButton>
      <OPopup :position="PopupPosition.TR" :target="btn3">TR {{ content }} </OPopup>
    </div>
    <div class="middle">
      <div class="left">
        <OButton ref="btn4"> LT </OButton>
        <OPopup :position="PopupPosition.LT" :target="btn4">LT {{ content }} </OPopup>
        <OButton ref="btn5"> LEFT </OButton>
        <OPopup :position="PopupPosition.LEFT" :target="btn5">L {{ content }} </OPopup>
        <OButton ref="btn6"> LB </OButton>
        <OPopup :position="PopupPosition.LB" :target="btn6">LB {{ content }} </OPopup>
      </div>
      <div class="right">
        <OButton ref="btn7"> RT </OButton>
        <OPopup :position="PopupPosition.RT" :target="btn7">R {{ content }} </OPopup>
        <OButton ref="btn8"> RIGHT </OButton>
        <OPopup :position="PopupPosition.RIGHT" :target="btn8">R {{ content }} </OPopup>
        <OButton ref="btn9"> RB </OButton>
        <OPopup :position="PopupPosition.RB" :target="btn9">RB {{ content }} </OPopup>
      </div>
    </div>
    <div class="bottom">
      <OButton ref="btn10"> BL </OButton>
      <OPopup :position="PopupPosition.BL" :target="btn10">BL {{ content }} </OPopup>
      <OButton ref="btn11"> BOTTOM </OButton>
      <OPopup :position="PopupPosition.BOTTOM" :target="btn11">B {{ content }} </OPopup>
      <OButton ref="btn12"> BR </OButton>
      <OPopup :position="PopupPosition.BR" :target="btn12">BR {{ content }} </OPopup>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.position-wrap {
  padding: 100px;
  height: 50vh;
  overflow: auto;
  border: 1px solid #333;
}
.top {
  display: flex;
  justify-content: space-between;
}
.left > * {
  display: block;
  margin: 100px;
}
.middle {
  display: flex;
  justify-content: space-between;
}
.right > * {
  display: block;
  margin: 100px;
}
.bottom {
  display: flex;
  justify-content: space-between;
}
</style>
