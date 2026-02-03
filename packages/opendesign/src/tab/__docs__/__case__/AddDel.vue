<docs lang="md">
<!-- zh-CN -->

### 增加删除

通过 `addable` 或 `closable` 属性分别开启增加或关闭功能，并通过 `add` 及 `delete` 事件实现增删逻辑。

<!-- en-US -->

### Adding and Deleting

Enable the adding or closing functionality via the `addable` or `closable` properties respectively,
and implement the addition and deletion logic through the `add` and `delete` events.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { OTab, OTabPane } from '@opensig/opendesign';

const tabs = reactive([
  { label: 'Tab 1', value: '1', content: 'Tab 1 Content' },
  { label: 'Tab 2', value: '2', content: 'Tab 2 Content' },
  { label: 'Tab 3', value: '3', content: 'Tab 3 Content' },
]);

let count = tabs.length;
const addTab = () => {
  count += 1;
  tabs.push({
    label: `Tab ${count}`,
    value: `${count}`,
    content: `Tab ${count} Content`,
  });
};

const delTab = (val: string | number) => {
  const index = tabs.findIndex((item) => item.value === val);
  tabs.splice(index, 1);
};
</script>
<template>
  <OTab addable @add="addTab" @delete="delTab">
    <OTabPane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value" closable>{{ tab.content }}</OTabPane>
  </OTab>
</template>
