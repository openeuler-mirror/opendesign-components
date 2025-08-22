<docs lang="md">
<!-- zh-CN -->

### 使用

五种主题色：`normal`、`primary`、`success`、`warning`、`danger` ；

四种尺寸：`auto`、`small`、`medium`、`large` ；

四种跳转方式：`_blank`、`_parent`、`_self`、`_top` ；

禁用状态：`disabled` ；

加载状态：`loading` ；

<!-- en-US -->

### Usage

Five theme colors: `normal`、`primary`、`success`、`warning`, and `danger`;

Four sizes: `auto`、`small`、`medium`、`large`;

Four forms of jumps: `_blank`、`_parent`、`_self`, and `_top`

Disabled state: `disabled`;

Loading state: `loading`;
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  href: {
    type: 'string',
    default: '#使用',
  },
  target: {
    type: 'list',
    list: ['_blank', '_parent', '_self', '_top'],
  },
  color: {
    type: 'list',
    list: ['normal', 'primary', 'success', 'warning', 'danger'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small', 'auto'],
  },
  disabled: {
    type: 'boolean',
  },
  loading: {
    type: 'boolean',
  },
  'icon(slot)': {
    type: 'boolean',
  },
  'suffix(slot)': {
    type: 'boolean',
    default: true,
  },
  hoverBg: {
    type: 'boolean',
  },
  hoverUnderline: {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  const { 'icon(slot)': iconSlot, 'suffix(slot)': suffixSlot } = props;
  let innerHTML = '';
  if (iconSlot) {
    innerHTML += '\n<template #icon><OIconEye /></template>';
  }
  innerHTML += '\n查看更多';
  if (suffixSlot) {
    innerHTML += '\n<template #suffix><OIconChevronRight /></template>';
  }
  return `<OLink style="display:flex;align-items:center;width:fit-content" ${propsToAttrStr(props, ['icon(slot)', 'suffix(slot)'])}>${innerHTML}\n</OLink>`;
};

const _ctx = {};
</script>
