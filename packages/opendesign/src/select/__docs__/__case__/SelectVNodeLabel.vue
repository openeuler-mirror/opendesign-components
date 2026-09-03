<docs lang="md">
  <!-- zh-CN -->

### 自定义选项渲染 ^[1.2.7](primary)

通过 `renderLabel` 渲染函数自定义下拉选项的 label 内容（如「图标 + 文字」），`label` 字段保持纯字符串用于过滤匹配、input 显示与无障碍读屏。`renderTag` 可自定义多选 tag 渲染——以选项图标颜色作色条、携带选项图标，与默认 tag 形成明显区分；`onClose` 回调由组件注入，调用后移除对应 tag。

  <!-- en-US -->

### Custom Option Rendering ^[1.2.7](primary)

Use `renderLabel` render function to customize dropdown option label content (e.g. "icon + text"). The `label` field stays as plain string for filtering, input display, and accessibility. `renderTag` customizes multiple selection tags — color-coded by option with a colored left border and icon, clearly distinct from the default tag. The `onClose` callback is injected by the component to remove the tag.
</docs>
<script setup lang="ts">
import { ref, h } from 'vue';
import type { VNode } from 'vue';
import { OForm, OFormItem, OIconStar, OIconFile, OIconEdit, OIconDownload, OIconDelete, OIconClose, OSelect } from '@opensig/opendesign';
import type { SelectMixedOption, SelectOptionData } from '@opensig/opendesign';

/** 图标 + 文本选项（label 为字符串供过滤/input 显示，icon 通过自定义字段携带） */
const iconOptions: SelectOptionData[] = [
  { value: 'star', label: '收藏', icon: OIconStar, iconColor: 'var(--o-color-warning1)' },
  { value: 'file', label: '文件', icon: OIconFile, iconColor: 'var(--o-color-info2)' },
  { value: 'edit', label: '编辑', icon: OIconEdit, iconColor: 'var(--o-color-primary1)' },
  { value: 'download', label: '下载', icon: OIconDownload, iconColor: 'var(--o-color-success1)' },
  { value: 'delete', label: '删除', icon: OIconDelete, iconColor: 'var(--o-color-danger1)' },
];

/** 长文本选项——展示 renderLabel 下图标与长文本的溢出/换行 */
const longTextOptions: SelectOptionData[] = [
  { value: 'long-edit', label: '编辑当前选中文件的元数据信息并同步到云端服务器', icon: OIconEdit, iconColor: 'var(--o-color-primary1)' },
  { value: 'long-download', label: '下载完整的项目资源压缩包到本地临时目录', icon: OIconDownload, iconColor: 'var(--o-color-success1)' },
  { value: 'short-star', label: '收藏', icon: OIconStar, iconColor: 'var(--o-color-warning1)' },
  { value: 'long-delete', label: '永久删除选中文件及其关联的索引记录，此操作不可恢复', icon: OIconDelete, iconColor: 'var(--o-color-danger1)' },
];

/**
 * 构建图标 + 文字子节点（renderLabel 与 renderTag 共用）
 *
 * @param option 含 icon / iconColor 自定义字段的选项数据
 * @returns VNode 子节点数组
 */
const buildIconChildren = (option: SelectOptionData) => {
  const children: (string | VNode)[] = [option.label];
  if (option.icon) {
    children.unshift(h(option.icon as any, { style: `color: ${option.iconColor}; flex-shrink: 0;` }));
  }
  return children;
};

/**
 * renderLabel：有 icon 时渲染图标+文字，无 icon 时也返回 VNode（<component :is> 不支持纯字符串）
 *
 * @description 使用 `display: flex`（块级）而非 `inline-flex`（行内级），
 * 避免 inline-flex 在 `.o-checkbox-label` 的 line box 中因 `vertical-align: baseline`
 * 导致 line box 膨胀，使 checkbox 与文字产生 1px 垂直偏差
 */
const renderIconLabel = (option: SelectOptionData) => {
  return h('span', { style: 'display: flex; align-items: center; gap: 6px; height: 100%;' }, buildIconChildren(option));
};

/**
 * renderTag：自定义多选 tag（色条 + 图标 + 文字 + 关闭按钮）
 *
 * @description renderTag 回调仅收到 { value, label }，不含自定义字段，
 * 需按 value 从 iconOptions 回查完整选项数据以获取 icon / iconColor；
 * 以 iconColor 作为左侧色条，与默认 tag（纯文字 + 关闭 icon）形成视觉区分；
 * onClose 由组件注入，调用后移除对应 tag
 */
const renderIconTag = (option: SelectOptionData, onClose: () => void) => {
  const full = iconOptions.find((o) => o.value === option.value) ?? option;
  return h('span', { style: `display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding-left: 6px;` }, [
    ...buildIconChildren(full),
    h(OIconClose, { class: 'demo-tag-close', onClick: onClose }),
  ]);
};

/** 分组选项（部分子项带 icon，部分为纯文本——renderLabel 统一处理两种情况） */
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

const selectVal1 = ref();
const selectVal2 = ref<string[]>([]);
const selectVal3 = ref();
const selectVal4 = ref();
const selectVal5 = ref('star');
/** 预选长文本项，触发 tag 溢出 */
const selectVal6 = ref<string[]>(['long-edit', 'long-download']);
const selectVal7 = ref<string[]>(['star', 'file']);
</script>
<template>
  <OForm layout="v" class="demo-select-vnode-wrap">
    <OFormItem label="图标选项">
      <OSelect v-model="selectVal1" :options="iconOptions" :render-label="renderIconLabel" placeholder="请选择操作" clearable class="demo-select" />
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="可搜索">
      <OSelect
        v-model="selectVal5"
        :options="iconOptions"
        :render-label="renderIconLabel"
        filterable
        placeholder="试试搜索「收藏」"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal5: {{ JSON.stringify(selectVal5) }}</u></template
      >
    </OFormItem>
    <OFormItem label="多选标签">
      <OSelect
        v-model="selectVal2"
        :options="iconOptions"
        :render-label="renderIconLabel"
        multiple
        :max-tag-count="3"
        placeholder="选择多个操作"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="自定义 tag">
      <OSelect
        v-model="selectVal7"
        :options="iconOptions"
        :render-label="renderIconLabel"
        :render-tag="renderIconTag"
        multiple
        placeholder="选择多个操作"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>selectVal7: {{ JSON.stringify(selectVal7) }}</u></template
      >
    </OFormItem>
    <OFormItem label="长文本多选">
      <OSelect v-model="selectVal6" :options="longTextOptions" :render-label="renderIconLabel" multiple placeholder="选择操作" clearable class="demo-select" />
      <template #extra
        ><u>selectVal6: {{ JSON.stringify(selectVal6) }}</u></template
      >
    </OFormItem>
    <OFormItem label="分组标题">
      <OSelect v-model="selectVal4" :options="groupOptions" :render-label="renderIconLabel" placeholder="请选择" clearable class="demo-select" />
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-vnode-wrap {
  .demo-select {
    max-width: 320px;
  }
  .demo-tag-close {
    margin-left: 4px;
    cursor: pointer;
    font-size: var(--o-icon_size-control-xs);
    color: var(--o-color-info3);
    &:hover {
      color: var(--o-color-info1);
    }
  }
}
</style>
