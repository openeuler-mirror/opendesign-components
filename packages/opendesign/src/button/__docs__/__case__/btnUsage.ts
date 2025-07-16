import { propsToAttrStr } from '../../../_demo/utils';

// 该导出会作为该使用示例的文案，文案是markdown格式
export const docs = {
  'zh-CN':
    '按钮包含 `primary`、`success`、`warning`、`danger` 四种主题色，`small`、`medium`、`large` 三种尺寸，`solid`、`outline`、`text` 三种形状，`disabled` 禁用状态，`loading` 加载状态。\n' +
    '按钮的圆角可以通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值。',
  'en-US':
    'Button contains `primary`, `success`, `warning`, `danger` four theme colors, `small`, `medium`, `large` three sizes, `solid`, `outline`, `text` three shapes, `disabled` disabled state, `loading` loading state.\n' +
    "Button's radius can be set to half circle by setting `pill` to `true`, or to css property `border-radius` accepted values.",
};

// 该模板会在运行时被编译为vue组件，同时作为组件的源码供用户查看和复制
export const template = (_props: Record<string, any>) => {
  const { 'icon(slot)': iconSlot, 'suffix(slot)': suffixSlot } = _props;
  let innerHTML = '';
  if (iconSlot) {
    innerHTML += '\n<template #icon><OIconChecked /></template>';
  }
  innerHTML += '\nButton';
  if (suffixSlot) {
    innerHTML += '\n<template #suffix><OIconSearch /></template>';
  }
  return `<OButton ${propsToAttrStr(_props, ['icon(slot)', 'suffix(slot)'])}>${innerHTML}\n</OButton>`;
};

// 该配置会生成表单控件，表单控件选取的值会作为 template 函数的参数
export const schema = {
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
};
