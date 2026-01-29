<docs lang="md">
<!-- zh-CN -->

### 自定义图标

<!-- en-US -->

### Custom icons
</docs>
<script setup lang="ts">
import { OStep, OStepItem, StepItemPropsT, OIconSkill } from '@opensig/opendesign';

const list: Array<Partial<StepItemPropsT>> = [
  { title: '步骤一', description: '这一步的描述' },
  { title: '步骤二', description: '这一步的描述' },
  { title: '步骤三', description: '这一步的描述' },
];
</script>
<template>
  <OStep direction="h">
    <OStepItem
      v-for="(item, idx) in list"
      :key="idx"
      :step-index="idx"
      :title="item.title"
      :description="item.description"
      :status="item.status"
      :icon="item.icon"
    >
      <template #icon>
        <OIconSkill class="o-step-item-icon" />
      </template>
    </OStepItem>
  </OStep>
</template>
