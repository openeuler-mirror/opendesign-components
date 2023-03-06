<script setup lang="ts">
import { initIconLoading, initSize } from '@opensig/opendesign/src/components';
import { IconAdd } from '@opensig/opendesign/src/components/icons';

const title = 'opendesign';

const globalSetting = () => {
  initIconLoading(IconAdd);
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
  color: var(--o-color-info1);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--o-color-fill2);
  box-shadow: 0px 1px 1px rgba(var(--o-gray-10), 0.1);
}
.tools {
  position: absolute;
  right: 24px;
  .tool-item {
    cursor: pointer;
  }
}
</style>
