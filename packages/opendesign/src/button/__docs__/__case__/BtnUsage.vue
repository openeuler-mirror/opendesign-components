<docs lang="md">
<!-- zh-CN -->

### 使用

按钮包含 `primary`、`success`、`warning`、`danger` 四种主题色；

三种尺寸：`small`、`medium`、`large` ；

三种形状：`solid`、`outline`、`text` ；

禁用状态：`disabled` ；

加载状态：`loading` ；

按钮的圆角可以通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值。

<!-- en-US -->

### Usage

The button includes four theme colors: `primary`, `success`, `warning`, and `danger`;

Three sizes: `small`, `medium`, and `large`;

Three shapes: `solid`, `outline`, and `text`;

Disabled state: `disabled`;

Loading state: `loading`;

The button's radius can be set to half circle by setting `pill` to `true`, or to css property `border-radius` accepted values.
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  color: {
    type: 'list',
    list: ['normal', 'primary', 'success', 'warning', 'danger'],
  },
  variant: {
    type: 'list',
    list: ['solid', 'outline', 'text'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
  },
  round: {
    type: 'list',
    list: ['pill', '12px', 'var(--o-radius-l)'],
  },
  disabled: {
    type: 'boolean',
  },
  loading: {
    type: 'boolean',
  },
  'icon(slot)': {
    type: 'boolean',
    default: true,
  },
  'suffix(slot)': {
    type: 'boolean',
    default: true,
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  const { 'icon(slot)': iconSlot, 'suffix(slot)': suffixSlot } = props;
  let innerHTML = '';
  if (iconSlot) {
    innerHTML += '\n<template #icon><OIconChecked /></template>';
  }
  innerHTML += '\nButton';
  if (suffixSlot) {
    innerHTML += '\n<template #suffix><OIconSearch /></template>';
  }
  return `<OButton ${propsToAttrStr(props, ['icon(slot)', 'suffix(slot)'])}>${innerHTML}\n</OButton>`;
};

const _ctx = {};
</script>
