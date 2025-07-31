<docs lang="md">
<!-- zh-CN -->

### 受控组件

通过自定义处理 `onUpdate:modelValue` 事件，可以实现比手风琴更加复杂的交互效果，如：有且仅有一个面板打开。

<!-- en-US -->

### Controlled

By customizing the `onUpdate:modelValue` event, you can implement more complex interactions than accordions, such as: There is one and only one panel open.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OCollapse, OCollapseItem } from '@opensig/opendesign';

const collapseValue = ref<Array<string | number>>([1]);
const handleUpdate = (val: Array<string | number>) => {
  for (const item of val) {
    if (!collapseValue.value.includes(item)) {
      collapseValue.value = [item];
      return;
    }
  }
};
</script>
<template>
  <OCollapse :model-value="collapseValue" @update:modelValue="handleUpdate">
    <OCollapseItem title="title 1" :value="1">
      <div class="content1"></div>
    </OCollapseItem>
    <OCollapseItem title="title 2" :value="2">
      <div class="content2"></div>
    </OCollapseItem>
    <OCollapseItem title="title 3" :value="3">
      <div class="content3"></div>
    </OCollapseItem>
  </OCollapse>
</template>
<style lang="scss" scoped>
.content1 {
  background-color: yellowgreen;
  height: 160px;
}
.content2 {
  background-color: lightblue;
  height: 200px;
}
.content3 {
  background-color: pink;
  height: 240px;
}
</style>
