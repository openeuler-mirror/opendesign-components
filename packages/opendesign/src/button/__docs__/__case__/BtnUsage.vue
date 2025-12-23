<docs lang="md"><!-- zh-CN -->

### 使用

按钮包含 `primary`、`success`、`warning`、`danger` `brand` 五种主题色；

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

The button's radius can be set to half circle by setting `pill` to `true`, or to css property `border-radius` accepted
values.</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  color: {
    type: 'list',
    list: ['primary', 'success', 'warning', 'danger', 'brand', 'normal'],
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
    label: '禁用'
  },
  loading: {
    type: 'boolean',
    label: '加载中'
  },
  prefixIcon: {
    type: 'boolean',
    default: true,
    label: '前缀图标'
  },
  onlyIcon: {
    type: 'boolean',
    label: '图标按钮'
  },
  suffixSlot: {
    type: 'boolean',
    default: false,
    label: '后缀图标'
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  const { prefixIcon, suffixSlot, onlyIcon } = props;
  let innerHTML = '';

  if (prefixIcon) {
    innerHTML += '\n<template #icon><OIconChecked /></template>';
  }
  if (!onlyIcon) {
    innerHTML += '\nButton';
    if (suffixSlot) {
      innerHTML += '\n<template #suffix><OIconSearch /></template>';
    }
  }

  return `<OButton ${propsToAttrStr(props, ['prefixIcon', 'suffixSlot', 'onlyIcon'])}>${innerHTML}\n</OButton>`;
};

const _oCtx = {};
</script>
