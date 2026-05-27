<docs lang="md">
<!-- zh-CN -->

### 选择前回调

通过 `beforeSelect` 在选中落地前进行拦截、确认或改写:

- 返回 `true` — 放行
- 返回 `false` — 阻止本次选中
- 返回 `string | number` — 改写选中值,以返回值作为新的选中项
- 返回 `Promise<上述任一类型>` — 异步场景(如先请求后端确认)

<!-- en-US -->

### Before Select

`beforeSelect` intercepts, confirms or rewrites a selection before it lands:

- `true` — allow
- `false` — block
- `string | number` — replace the selected value with the returned one
- `Promise<...>` — supports async confirmation (e.g. backend check)
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OCascaderV2, OForm, OFormItem, type CascaderV2NodeValueT } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const options = [
  {
    label: 'Plan A',
    value: 'a',
    children: [
      { label: 'A-1', value: 'a-1' },
      { label: 'A-2 (拦截)', value: 'a-2' },
      { label: 'A-3 (改写为 a-1)', value: 'a-3' },
    ],
  },
  {
    label: 'Plan B',
    value: 'b',
    children: [
      { label: 'B-1 (异步确认)', value: 'b-1' },
      { label: 'B-2', value: 'b-2' },
    ],
  },
];

const val1 = ref<CascaderV2NodeValueT>();
const val2 = ref<CascaderV2NodeValueT>();
const log = ref<string[]>([]);

const beforeSelectSync = (value: CascaderV2NodeValueT) => {
  if (value === 'a-2') {
    log.value.unshift(`拦截选中: ${value}`);
    return false;
  }
  if (value === 'a-3') {
    log.value.unshift(`改写选中: ${value} -> a-1`);
    return 'a-1';
  }
  return true;
};

const beforeSelectAsync = async (value: CascaderV2NodeValueT): Promise<boolean> => {
  if (value !== 'b-1') return true;
  log.value.unshift(`异步确认: ${value}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const ok = window.confirm('确认选中 B-1?');
      log.value.unshift(`异步结果: ${ok}`);
      resolve(ok);
    }, 200);
  });
};
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="同步拦截/改写">
      <OCascaderV2 v-model="val1" :options="options" :before-select="beforeSelectSync" clearable class="demo-cascader-v2" />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="异步确认 (Promise)">
      <OCascaderV2 v-model="val2" :options="options" :before-select="beforeSelectAsync" clearable class="demo-cascader-v2" />
      <template #extra>{{ val2 }}</template>
    </OFormItem>
  </OForm>

  <template v-if="log.length">
    <p style="margin-top: 12px; font-size: 13px">日志:</p>
    <ul style="margin: 4px 0 0; padding-left: 18px; font-size: 13px">
      <li v-for="(msg, i) in log" :key="i">{{ msg }}</li>
    </ul>
  </template>
</template>

<style lang="scss">
.demo-cascader-v2 {
  width: 100%;
  max-width: 320px;
}
</style>
