<docs lang="md">
<!-- zh-CN -->

### 切换主题开关

<!-- en-US -->

### Switch the topic toggle on/off.
</docs>
<script setup lang="ts">
import { OSwitch, OIconSun, OIconMoon } from '@opensig/opendesign';
</script>
<template>
  <OSwitch class="demo-switch-case-wrap" defaultChecked>
    <template #inactive><OIconMoon /> </template>
    <template #active><OIconSun /> </template>
    <template #off><OIconSun /></template>
    <template #on><OIconMoon /></template>
  </OSwitch>
</template>
<style scoped lang="scss">
.demo-switch-case-wrap {
  --switch-color: var(--o-color-info4);
}
</style>
