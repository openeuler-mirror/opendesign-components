<docs lang="md">
<!-- zh-CN -->

### 自定义状态描述

可通过 `on` 和 `off` 插槽自定义打开或关闭状态时的描述。

<!-- en-US -->

### Custom State Description

Customize the description for on or off states via the `on` and `off` slots.
</docs>
<script setup lang="ts">
import { OSwitch, OIconDone, OIconClose } from '@opensig/opendesign';
</script>
<template>
  <div class="col">
    <OSwitch>
      <template #on><OIconDone /></template>
      <template #off><OIconClose /></template>
    </OSwitch>
    <OSwitch>
      <template #on>on</template>
      <template #off>off</template>
    </OSwitch>
    <OSwitch>
      <template #on>开</template>
      <template #off>关</template>
    </OSwitch>
  </div>
</template>
