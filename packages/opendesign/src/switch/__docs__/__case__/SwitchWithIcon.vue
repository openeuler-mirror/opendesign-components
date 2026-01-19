<docs lang="md">
<!-- zh-CN -->

### 带图标开关

<!-- en-US -->

### Iconic switch
</docs>
<script setup lang="ts">
import { OSwitch } from '@opensig/opendesign';
</script>
<template>
  <OSwitch>
    <template #off><DocIconLight /></template>
    <template #on><DocIconDark /></template>
  </OSwitch>
</template>
