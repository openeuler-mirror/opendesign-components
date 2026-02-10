<docs lang="md">
<!-- zh-CN -->

### 自定义图标

<!-- en-US -->

### Custom icons
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OStep, OStepItem, StepItemPropsT, OIconFile } from '@opensig/opendesign';

const list: Array<Partial<StepItemPropsT>> = [
  { title: '步骤一', description: '这一步的描述' },
  { title: '步骤二', description: '这一步的描述' },
  { title: '步骤三', description: '这一步的描述' },
];
const activeIndex = ref(0);
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
      :class="{ active: activeIndex === idx }"
      class="demo-step-item"
      @click="
        () => {
          activeIndex = idx;
        }
      "
    >
      <template #icon>
        <OIconFile class="o-step-item-icon" />
      </template>
    </OStepItem>
  </OStep>
</template>

<style lang="scss" scoped>
.demo-step-item {
  --step-item-head-color: var(--o-color-info3);
  cursor: pointer;
}
.active {
  --step-item-head-color: var(--o-color-primary1);
  --step-item-title-color: var(--o-color-primary1);
}
</style>
