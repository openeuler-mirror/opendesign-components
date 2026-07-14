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

const randomCharArr = ['h', 'iQ', 'dPD', 'dYJm', 'PCnTJ', 'JnIUwj', 'kJXDlia', 'RIbUWqeg'];

const tabs = reactive(
  new Array(6).fill(null).map((_, i) => {
    return { label: `Tab ${i + 1} ${randomCharArr[i % randomCharArr.length]}`, value: i + 1, content: `Tab ${i + 1} Content` };
  }),
);

let count = tabs.length;
const addTab = () => {
  count += 1;
  tabs.push({
    label: `Tab ${count} ${randomCharArr[count % randomCharArr.length]}`,
    value: count,
    content: `Tab ${count} Content`,
  });
};

const delTab = (val: string | number) => {
  const index = tabs.findIndex((item) => item.value === val);
  tabs.splice(index, 1);
};

const limit = ref(false);
const _maxShow = ref(12);

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
  <OTab addable :max-show="maxShow" @add="addTab" @delete="delTab">
    <OTabPane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value" closable>
      {{ tab.content }}
    </OTabPane>
  </OTab>
</template>

<style lang="scss" scoped>
.demo-tab-control {
  display: flex;
  align-items: center;
  gap: 16px;
}
.o-tab {
  @include respond('<=pad_v') {
    --tab-nav-ellipsis-shadow-color: var(--o-grey-2);
  }
}
</style>
