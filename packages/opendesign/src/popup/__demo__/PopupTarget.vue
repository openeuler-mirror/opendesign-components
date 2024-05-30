<script setup lang="ts">
import { ref } from 'vue';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content';
const elRef = ref(null);
</script>
<template>
  <h4>Popup Target</h4>
  <div class="btn" ref="elRef">click 123</div>

  <OPopup position="tl" trigger="click" :unmount-on-hide="false" :target="elRef">
    <div class="popup-box">click {{ content }}</div>
  </OPopup>
  <OPopup position="tl" trigger="hover" :unmount-on-hide="false">
    <div class="popup-box">hover {{ content }}</div>
    <template #target><div class="btn">hover 123</div></template>
  </OPopup>
  <OPopup position="tl" trigger="hover-outclick" :unmount-on-hide="false">
    <div class="popup-box">hover-outclick {{ content }}</div>
    <template #target><div class="btn">hover-outclick 123</div></template>
  </OPopup>
  <OPopup position="tl" trigger="hover" :auto-hide="false" :unmount-on-hide="false">
    <div class="popup-box">hover not autohide {{ content }}</div>
    <template #target><div class="btn">hover not autohide</div></template>
  </OPopup>
</template>
<style lang="scss" scoped>
#wrap {
  height: 50vh;
  width: 50vw;
  overflow: auto;
  border: 10px solid #333;
  position: relative;
  z-index: 10;
  background-color: #eee;
  // overflow: visible;
}
.btn {
  padding: 12px 24px;
  border: 1px solid #333;
  margin: 12px;
  display: inline-block;
}
</style>
