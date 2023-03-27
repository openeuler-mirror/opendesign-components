<script setup lang="ts">
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content';
</script>
<template>
  <h4>Popup Target</h4>

  <OPopup position="tl" trigger="click" :unmount-on-hide="false">
    <div class="popup-box">click {{ content }}</div>
    <template #target><div class="btn">click 123</div></template>
  </OPopup>
  <OPopup position="tl" trigger="hover" :unmount-on-hide="false">
    <div class="popup-box">hover {{ content }}</div>
    <template #target><div class="btn">hover 123</div></template>
  </OPopup>
  <OPopup position="tl" trigger="hover-click" :unmount-on-hide="false">
    <div class="popup-box">hover-click {{ content }}</div>
    <template #target><div class="btn">hover-click 123</div></template>
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
