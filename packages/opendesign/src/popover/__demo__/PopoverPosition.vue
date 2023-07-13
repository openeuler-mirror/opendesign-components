<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopover } from '../index';

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
      <OPopover position="tl" trigger="click-outclick">
        <template #target>
          <OButton ref="btn1"> TL </OButton>
        </template>
        <div class="box">TL {{ content }}</div>
      </OPopover>
      <OButton ref="btn2"> TOP </OButton>
      <OPopover position="top" :target="btn2">
        <div class="box">T {{ content }}</div>
        <div>{{ content }}</div>
      </OPopover>
      <OButton ref="btn3">TR</OButton>
      <OPopover position="tr" :target="btn3" trigger="click">
        <div class="box">TR {{ content }}</div>
      </OPopover>
    </div>
    <div class="middle">
      <div class="left">
        <OButton ref="btn4"> LT </OButton>
        <OPopover position="lt" :target="btn4" trigger="click">
          <div class="box">LT {{ content }}</div>
        </OPopover>
        <OButton ref="btn5"> LEFT </OButton>
        <OPopover position="left" :target="btn5">
          <div class="box">L {{ content }}</div>
        </OPopover>
        <OButton ref="btn6"> LB </OButton>
        <OPopover position="lb" :target="btn6">
          <div class="box">LB {{ content }}</div>
        </OPopover>
      </div>
      <div class="right">
        <OButton ref="btn7"> RT </OButton>
        <OPopover position="rt" :target="btn7" trigger="click">
          <div class="box">R {{ content }}</div>
        </OPopover>
        <OButton ref="btn8"> RIGHT </OButton>
        <OPopover position="right" :target="btn8">
          <div class="box">R {{ content }}</div>
        </OPopover>
        <OButton ref="btn9"> RB </OButton>
        <OPopover position="rb" :target="btn9">
          <div class="box">RB {{ content }}</div>
        </OPopover>
      </div>
    </div>
    <div class="bottom">
      <OButton ref="btn10"> BL </OButton>
      <OPopover position="bl" :target="btn10" trigger="click">
        <div class="box">BL {{ content }}</div>
      </OPopover>
      <OButton ref="btn11"> BOTTOM </OButton>
      <OPopover position="bottom" :target="btn11">
        <div class="box">B {{ content }}</div>
      </OPopover>
      <OButton ref="btn12"> BR </OButton>
      <OPopover position="br" :target="btn12">
        <div class="box">BR {{ content }}</div>
      </OPopover>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.position-wrap {
  padding: 200px;
  height: 50vh;
  overflow: auto;
  border: 1px solid #333;
}
.box {
  padding: 12px;
  height: 60px;
  display: flex;
  align-items: center;
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
