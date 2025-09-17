<docs lang="md">
<!-- zh-CN -->

### 使用

两种类型：`line`、`circle`；

两种尺寸：`medium`、`small` ；

四种颜色：`primary`、`success`、`warning`、`danger`；

进度条百分比通过 `percentage` 属性控制；

进度条线宽通过 `strokeWidth` 属性控制；

进度条轨道宽度通过 `trackWidth` 属性控制；

<!-- en-US -->

### Usage

Two types: `line`、`circle`;

Two sizes: `medium`、`small`;

Four colors: `primary`、`success`、`warning`、`danger`;

The percentage of the progress bar is controlled by the `percentage` attribute;

The width of the progress bar is controlled by the `strokeWidth` attribute;

The width of the progress bar track is controlled by the `trackWidth` attribute;
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  variant: {
    type: 'list',
    list: ['line', 'circle'],
  },
  size: {
    type: 'list',
    list: ['medium', 'small'],
  },
  color: {
    type: 'list',
    list: ['primary', 'success', 'warning', 'danger'],
  },
  percentage: {
    type: 'number',
    default: 30,
  },
  strokeWidth: {
    type: 'number',
    default: 8,
  },
  trackWidth: {
    type: 'number',
    default: 300,
  },
  'icon(slot)': {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  const { 'icon(slot)': iconSlot, color } = props;
  let innerHTML = '';
  if (iconSlot && color === 'warning') {
    innerHTML += '\n<template #icon><OIconWarning /></template>';
  }
  if (iconSlot && color === 'danger') {
    innerHTML += '\n<template #icon><OIconDanger /></template>';
  }
  return `<OProgress  ${propsToAttrStr(props)} >${innerHTML}</OProgress>`;
};

const _ctx = reactive({
  inputVal: '',
});
</script>
<style lang="scss"></style>
