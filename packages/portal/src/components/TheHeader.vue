<script setup lang="ts">
import { initLoadingIcon, initSize } from '@opensig/opendesign/src/components';
import { IconAdd } from '@opensig/opendesign/src/components/icons';

const title = 'opendesign';

const globalSetting = () => {
  initLoadingIcon(IconAdd);
  initSize('large');
};
</script>
<template>
  <div class="the-header">
    {{ title }}
    <div class="tools">
      <div class="tool-item" @click="globalSetting">全局设置</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.the-header {
  color: var(--o-color-text1);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--o-color-bg3);
  box-shadow: 0px 2px 8px rgba($color: #000000, $alpha: 0.1);
}
.tools {
  position: absolute;
  right: 24px;
  .tool-item {
    cursor: pointer;
  }
}
</style>
