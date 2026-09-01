<docs lang="md">
  <!-- zh-CN -->

### 虚拟滚动 ^[NEXT](primary)

通过 `virtual` prop 开启虚拟滚动，大数据量时只渲染可见项，显著提升渲染性能。

配合 `virtualListProps` 可配置 `OVirtualList` 的参数（如 `itemSize`、`buffer` 等）。`itemSize` 为数字时为定高模式，性能最佳；不传为不定高模式，运行时测量。

虚拟滚动可与多选、搜索、创建、自定义渲染等能力自由组合。

  <!-- en-US -->

### Virtual Scroll ^[NEXT](primary)

Enable virtual scrolling via the `virtual` prop. Only visible items are rendered for large data, significantly improving rendering performance.

Use `virtualListProps` to configure `OVirtualList` parameters (e.g. `itemSize`, `buffer`). When `itemSize` is a number, fixed-height mode is used for best performance; when omitted, dynamic height mode measures at runtime.

Virtual scrolling can be freely combined with multi-select, search, creation, custom rendering, and other capabilities.
</docs>
<script setup lang="ts">
import { ref, h } from 'vue';
import { OForm, OFormItem, OSelect } from '@opensig/opendesign';
import type { SelectOptionData } from '@opensig/opendesign';

/** 生成 1000 个选项数据 */
const largeOptions = Array.from({ length: 1000 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: i,
}));

/** 分组大数据 */
const largeGroupOptions = [
  {
    type: 'group' as const,
    key: 'g1',
    label: '第一组（1-500）',
    children: Array.from({ length: 500 }, (_, i) => ({
      label: `项 ${i + 1}`,
      value: i,
    })),
  },
  {
    type: 'group' as const,
    key: 'g2',
    label: '第二组（501-1000）',
    children: Array.from({ length: 500 }, (_, i) => ({
      label: `项 ${i + 501}`,
      value: i + 500,
    })),
  },
];

/** 带颜色标签的大数据（用于自定义渲染） */
const colorOptions = Array.from({ length: 500 }, (_, i) => {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  return {
    label: `色块 ${i + 1}`,
    value: i,
    color: colors[i % colors.length],
  };
});

/**
 * renderLabel：渲染颜色圆点 + 文字
 *
 * @description 使用 `display: flex`（块级）而非 `inline-flex`（行内级），
 * 避免 inline-flex 在 `.o-checkbox-label` 的 line box 中因 `vertical-align: baseline`
 * 导致 line box 膨胀，使 checkbox 与文字产生 1px 垂直偏差
 */
const renderColorLabel = (option: SelectOptionData) => {
  return h('span', { style: 'display: flex; align-items: center; gap: 8px; height: 100%;' }, [
    h('span', {
      style: `display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${option.color};`,
    }),
    option.label,
  ]);
};

const selectVal1 = ref();
const selectVal2 = ref();
/** 预设初始值，验证虚拟滚动定位到选中项的行为 */
const selectVal3 = ref(500);
/** 多选值 */
const selectVal4 = ref<number[]>([0, 1, 2]);
/** 多选+创建值 */
const selectVal5 = ref<string[]>([]);
/** 自定义渲染值 */
const selectVal6 = ref();
/** 多选+自定义渲染值 */
const selectVal7 = ref<number[]>([]);
</script>
<template>
  <OForm layout="v" class="demo-select-virtual-wrap">
    <OFormItem label="1000 项（定高）">
      <OSelect v-model="selectVal1" :options="largeOptions" :virtual="true" placeholder="请选择" clearable class="demo-select" />
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="分组大数据">
      <OSelect v-model="selectVal2" :options="largeGroupOptions" :virtual="true" placeholder="请选择" clearable class="demo-select" />
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="初始值定位">
      <OSelect v-model="selectVal3" :options="largeOptions" :virtual="true" placeholder="请选择" clearable class="demo-select" />
      <template #extra
        ><u>selectVal3: {{ JSON.stringify(selectVal3) }}</u></template
      >
    </OFormItem>
    <OFormItem label="虚拟多选">
      <OSelect
        v-model="selectVal4"
        :options="largeOptions"
        :virtual="true"
        multiple
        filterable
        :max-tag-count="3"
        placeholder="多选 + 搜索 + 虚拟滚动"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
    <OFormItem label="虚拟创建">
      <OSelect
        v-model="selectVal5"
        :options="largeOptions.map((o) => ({ label: String(o.label), value: String(o.value) }))"
        :virtual="true"
        multiple
        filterable
        allow-create
        :max-tag-count="3"
        placeholder="输入创建 + 虚拟滚动"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal5: {{ JSON.stringify(selectVal5) }}</u></template
      >
    </OFormItem>
    <OFormItem label="自定义渲染">
      <OSelect
        v-model="selectVal6"
        :options="colorOptions"
        :virtual="true"
        :render-label="renderColorLabel"
        filterable
        placeholder="500 项颜色圆点"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal6: {{ JSON.stringify(selectVal6) }}</u></template
      >
    </OFormItem>
    <OFormItem label="多选+渲染">
      <OSelect
        v-model="selectVal7"
        :options="colorOptions"
        :virtual="true"
        :render-label="renderColorLabel"
        multiple
        filterable
        :max-tag-count="3"
        placeholder="多选 + 自定义渲染 + 虚拟滚动"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal7: {{ JSON.stringify(selectVal7) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-virtual-wrap {
  .demo-select {
    max-width: 320px;
  }
}
</style>
