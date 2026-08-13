<docs lang="md">
  <!-- zh-CN -->

### 插槽自定义渲染 ^[NEXT](primary)

`#option-label` 插槽是 `renderLabel` prop 的插槽等价物，用于自定义下拉选项和输入框中选中值的 label 渲染。插槽与 prop 同时存在时**插槽优先**。

`#option-label` 在 OOption 内部渲染，保留 OOption 的点击选中、键盘导航、无障碍等能力，无需手动绑定事件。`label` 字段保持纯字符串用于过滤匹配、input 显示与无障碍读屏。

  <!-- en-US -->

### Slot-based Custom Rendering ^[NEXT](primary)

The `#option-label` slot is the slot equivalent of the `renderLabel` prop, used to customize the label rendering of dropdown options and the selected value in the input box. When both exist, the **slot takes precedence**.

`#option-label` renders inside OOption, preserving its click selection, keyboard navigation, and accessibility — no manual event binding needed. The `label` field stays as plain string for filtering, input display, and accessibility.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem, OIconStar, OIconFile, OIconEdit, OIconDownload, OIconDelete, OSelect } from '@opensig/opendesign';
import type { SelectMixedOption } from '@opensig/opendesign';

/** 图标 + 文本选项（label 为字符串供过滤/input 显示，icon 通过自定义字段携带） */
const iconOptions: SelectMixedOption[] = [
  { value: 'star', label: '收藏', icon: OIconStar, iconColor: 'var(--o-color-warning1)' },
  { value: 'file', label: '文件', icon: OIconFile, iconColor: 'var(--o-color-info2)' },
  { value: 'edit', label: '编辑', icon: OIconEdit, iconColor: 'var(--o-color-primary1)' },
  { value: 'download', label: '下载', icon: OIconDownload, iconColor: 'var(--o-color-success1)' },
  { value: 'delete', label: '删除', icon: OIconDelete, iconColor: 'var(--o-color-danger1)' },
];

/** 分组选项（部分子项带 icon，部分为纯文本——#option-label 统一处理两种情况） */
const groupOptions: SelectMixedOption[] = [
  {
    type: 'group' as const,
    key: 'file-ops',
    label: '文件操作',
    children: [
      { value: 'edit', label: '编辑文件', icon: OIconEdit, iconColor: 'var(--o-color-primary1)' },
      { value: 'download', label: '下载文件', icon: OIconDownload, iconColor: 'var(--o-color-success1)' },
      { value: 'delete', label: '删除文件', icon: OIconDelete, iconColor: 'var(--o-color-danger1)' },
    ],
  },
  {
    type: 'group' as const,
    key: 'text-opts',
    label: '纯文本分组',
    children: [
      { value: 't1', label: '选项 A' },
      { value: 't2', label: '选项 B' },
    ],
  },
];

/** 带颜色标签的大数据（用于虚拟模式 + #option 插槽） */
const colorOptions = Array.from({ length: 500 }, (_, i) => {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  return {
    label: `色块 ${i + 1}`,
    value: i,
    color: colors[i % colors.length],
  };
});

const selectVal1 = ref();
const selectVal2 = ref();
const selectVal3 = ref<string[]>([]);
const selectVal4 = ref();
const selectVal6 = ref();
const selectVal7 = ref<number[]>([]);
</script>
<template>
  <OForm layout="v" class="demo-select-slot-wrap">
    <OFormItem label="图标选项">
      <OSelect v-model="selectVal1" :options="iconOptions" placeholder="请选择操作" clearable class="demo-select">
        <template #option-label="{ option }">
          <span style="display: flex; align-items: center; gap: 6px; height: 100%">
            <component :is="option.icon" v-if="option.icon" :style="{ color: option.iconColor }" />
            {{ option.label }}
          </span>
        </template>
      </OSelect>
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="可搜索">
      <OSelect v-model="selectVal2" :options="iconOptions" filterable placeholder="试试搜索「收藏」" clearable class="demo-select">
        <template #option-label="{ option }">
          <span style="display: flex; align-items: center; gap: 6px; height: 100%">
            <component :is="option.icon" v-if="option.icon" :style="{ color: option.iconColor }" />
            {{ option.label }}
          </span>
        </template>
      </OSelect>
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="多选标签">
      <OSelect v-model="selectVal3" :options="iconOptions" multiple :max-tag-count="3" placeholder="选择多个操作" clearable class="demo-select">
        <template #option-label="{ option }">
          <span style="display: flex; align-items: center; gap: 6px; height: 100%">
            <component :is="option.icon" v-if="option.icon" :style="{ color: option.iconColor }" />
            {{ option.label }}
          </span>
        </template>
      </OSelect>
      <template #extra
        ><u>selectVal3: {{ JSON.stringify(selectVal3) }}</u></template
      >
    </OFormItem>
    <OFormItem label="分组标题">
      <OSelect v-model="selectVal4" :options="groupOptions" placeholder="请选择" clearable class="demo-select">
        <template #option-label="{ option }">
          <span style="display: flex; align-items: center; gap: 6px; height: 100%">
            <component :is="option.icon" v-if="option.icon" :style="{ color: option.iconColor }" />
            {{ option.label }}
          </span>
        </template>
      </OSelect>
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
    <OFormItem label="虚拟 + #option-label">
      <OSelect v-model="selectVal6" :options="colorOptions" :virtual="true" filterable placeholder="500 项颜色圆点" clearable class="demo-select">
        <template #option-label="{ option }">
          <span style="display: flex; align-items: center; gap: 8px; height: 100%">
            <span :style="`display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${option.color};`" />
            {{ option.label }}
          </span>
        </template>
      </OSelect>
      <template #extra
        ><u>selectVal6: {{ JSON.stringify(selectVal6) }}</u></template
      >
    </OFormItem>
    <OFormItem label="多选 + 虚拟">
      <OSelect
        v-model="selectVal7"
        :options="colorOptions"
        :virtual="true"
        multiple
        :max-tag-count="3"
        filterable
        placeholder="多选 + 自定义渲染 + 虚拟滚动"
        clearable
        class="demo-select"
      >
        <template #option-label="{ option, selected }">
          <span style="display: flex; align-items: center; gap: 8px; height: 100%">
            <span
              :style="`display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${option.color}; border: 2px solid ${selected ? 'var(--o-color-primary1)' : 'transparent'};`"
            />
            {{ option.label }}
          </span>
        </template>
      </OSelect>
      <template #extra
        ><u>selectVal7: {{ JSON.stringify(selectVal7) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-slot-wrap {
  .demo-select {
    max-width: 320px;
  }
}
</style>
