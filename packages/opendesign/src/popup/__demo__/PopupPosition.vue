<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

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
      <OPopup anchor-class="popup-arrow" position="tl" :target="btn1">
        <div class="popup-box">TL {{ content }}</div>
      </OPopup>
      <OButton ref="btn2"> TOP </OButton>
      <OPopup anchor-class="popup-arrow" position="top" :target="btn2" :trigger="['click', 'hover']">
        <div class="popup-box">T {{ content }}</div>
      </OPopup>
      <OButton ref="btn3">TR</OButton>
      <OPopup anchor-class="popup-arrow" position="tr" :target="btn3">
        <div class="popup-box">TR {{ content }}</div>
      </OPopup>
    </div>
    <div class="middle">
      <div class="left">
        <OButton ref="btn4"> LT </OButton>
        <OPopup anchor-class="popup-arrow" position="lt" :target="btn4">
          <div class="popup-box">LT {{ content }}</div>
        </OPopup>
        <OButton ref="btn5"> LEFT </OButton>
        <OPopup anchor-class="popup-arrow" position="left" :target="btn5">
          <div class="popup-box">L {{ content }}</div>
        </OPopup>
        <OButton ref="btn6"> LB </OButton>
        <OPopup anchor-class="popup-arrow" position="lb" :target="btn6">
          <div class="popup-box">LB {{ content }}</div>
        </OPopup>
      </div>
      <div class="right">
        <OButton ref="btn7"> RT </OButton>
        <OPopup position="rt" :target="btn7">
          <div class="popup-box">R {{ content }}</div>
          <template #anchor>
            <div class="popup-arrow"></div>
          </template>
        </OPopup>
        <OButton ref="btn8"> RIGHT </OButton>
        <OPopup position="right" :target="btn8">
          <div class="popup-box">R {{ content }}</div>
          <template #anchor>
            <div class="popup-arrow"></div>
          </template>
        </OPopup>
        <OButton ref="btn9"> RB </OButton>
        <OPopup position="rb" :target="btn9">
          <div class="popup-box">RB {{ content }}</div>
          <template #anchor>
            <div class="popup-arrow"></div>
          </template>
        </OPopup>
      </div>
    </div>
    <div class="bottom">
      <OButton ref="btn10"> BL </OButton>
      <OPopup position="bl" :target="btn10">
        <div class="popup-box">BL {{ content }}</div>
        <template #anchor>
          <div class="popup-arrow"></div>
        </template>
      </OPopup>
      <OButton ref="btn11"> BOTTOM </OButton>
      <OPopup position="bottom" :target="btn11">
        <div class="popup-box">B {{ content }}</div>
        <template #anchor>
          <div class="popup-arrow"></div>
        </template>
      </OPopup>
      <OButton ref="btn12"> BR </OButton>
      <OPopup position="br" :target="btn12">
        <div class="popup-box">BR {{ content }}</div>
        <template #anchor>
          <div class="popup-arrow"></div>
        </template>
      </OPopup>
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
<style lang="scss">
.popup-arrow {
  border: 1px solid red;
  border-radius: 50%;
  width: 8px;
  height: 8px;
}
</style>
