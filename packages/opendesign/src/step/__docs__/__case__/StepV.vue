<docs lang="md">
<!-- zh-CN -->

### 垂直步骤条

<!-- en-US -->

### Vertical step bar
</docs>
<script setup lang="ts">
import { OStep, OStepItem, StepItemPropsT } from '@opensig/opendesign';

const list: Array<Partial<StepItemPropsT>> = [
  { title: '步骤一', description: '这一步的描述', status: 'finished', icon: true },
  { title: '步骤二', description: '这一步的描述', status: 'processing', icon: false },
  { title: '步骤三', description: '这一步的描述', status: 'waiting', icon: false },
  { title: '步骤四', description: '这一步的描述', status: 'failed', icon: true },
];
</script>
<template>
  <OStep direction="v">
    <OStepItem
      v-for="(item, idx) in list"
      :key="idx"
      :step-index="idx"
      :title="item.title"
      :description="item.description"
      :status="item.status"
      :icon="item.icon"
      style="height: 80px"
    />
  </OStep>
</template>
