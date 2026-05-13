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
import { computed, reactive, ref } from 'vue';
import { OTab, OTabPane, OSwitch, OInputNumber } from '@opensig/opendesign';

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

const limit = ref(false);
const _maxShow = ref(6);
const maxShow = computed(() => {
  return limit.value ? _maxShow.value : undefined;
});
</script>
<template>
  <div class="demo-tab-control">
    <span>limit: </span>
    <OSwitch v-model="limit" />
    <OInputNumber v-model="_maxShow" :step="1" :min="1" />
  </div>
  <OTab addable @add="addTab" @delete="delTab" :max-show="maxShow">
    <OTabPane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value" closable>{{ tab.content }}</OTabPane>
  </OTab>
</template>

<style lang="scss" >
.demo-tab-control {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
