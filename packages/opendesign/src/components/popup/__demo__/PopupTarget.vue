<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content';
</script>
<template>
  <h4>Popup Target</h4>

  <OPopup position="tl" trigger="click" :unmount-on-hide="false">
    <div class="popup-box">{{ content }}</div>
    <template #target><div>123</div></template>
  </OPopup>
</template>
<style lang="scss" scoped>
.popup-box {
  background-color: var(--popup-bg);
  box-shadow: var(--popup-shadow);
  padding: 4px 8px;
  border-radius: var(--popup-radius);
  border: 1px solid red;
}
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
</style>
