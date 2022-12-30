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
      <OPopup :position="PopupPosition.TL" :target="btn1">
        <div class="popup-box">TL {{ content }}</div>
      </OPopup>
      <OButton ref="btn2"> TOP </OButton>
      <OPopup :position="PopupPosition.TOP" :target="btn2" trigger="click">
        <div class="popup-box">T {{ content }}</div>
      </OPopup>
      <OButton ref="btn3">TR</OButton>
      <OPopup :position="PopupPosition.TR" :target="btn3">
        <div class="popup-box">TR {{ content }}</div>
      </OPopup>
    </div>
    <div class="middle">
      <div class="left">
        <OButton ref="btn4"> LT </OButton>
        <OPopup :position="PopupPosition.LT" :target="btn4">
          <div class="popup-box">LT {{ content }}</div>
        </OPopup>
        <OButton ref="btn5"> LEFT </OButton>
        <OPopup :position="PopupPosition.LEFT" :target="btn5">
          <div class="popup-box">L {{ content }}</div>
        </OPopup>
        <OButton ref="btn6"> LB </OButton>
        <OPopup :position="PopupPosition.LB" :target="btn6">
          <div class="popup-box">LB {{ content }}</div>
        </OPopup>
      </div>
      <div class="right">
        <OButton ref="btn7"> RT </OButton>
        <OPopup :position="PopupPosition.RT" :target="btn7">
          <div class="popup-box">R {{ content }}</div>
        </OPopup>
        <OButton ref="btn8"> RIGHT </OButton>
        <OPopup :position="PopupPosition.RIGHT" :target="btn8">
          <div class="popup-box">R {{ content }}</div>
        </OPopup>
        <OButton ref="btn9"> RB </OButton>
        <OPopup :position="PopupPosition.RB" :target="btn9">
          <div class="popup-box">RB {{ content }}</div>
        </OPopup>
      </div>
    </div>
    <div class="bottom">
      <OButton ref="btn10"> BL </OButton>
      <OPopup :position="PopupPosition.BL" :target="btn10">
        <div class="popup-box">BL {{ content }}</div>
      </OPopup>
      <OButton ref="btn11"> BOTTOM </OButton>
      <OPopup :position="PopupPosition.BOTTOM" :target="btn11" trigger="click">
        <div class="popup-box">B {{ content }}</div>
      </OPopup>
      <OButton ref="btn12"> BR </OButton>
      <OPopup :position="PopupPosition.BR" :target="btn12">
        <div class="popup-box">BR {{ content }}</div>
      </OPopup>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.popup-box {
  background-color: var(--popup-bg);
  box-shadow: var(--popup-shadow);
  padding: 4px 8px;
  border-radius: var(--popup-radius);
  border: 1px solid red;
}
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
