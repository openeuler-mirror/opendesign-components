import { propsToAttrStr } from '../../../_demo/utils';

export const schema = {
  value: {
    type: 'string',
    default: '100',
  },
  max: {
    type: 'number',
    default: 99,
  },
  color: {
    type: 'list',
    list: ['primary', 'success', 'warning', 'danger'],
    default: 'primary',
  },
  dot: {
    type: 'boolean',
    default: false,
  },
  'offset-x': {
    type: 'number',
    default: 0,
    // min: 0,
  },
  'offset-y': {
    type: 'number',
    default: 0,
  },
};
const NUMBER_REGEXP = /^\d+$/;
export const template = (_props: Record<string, any>) => {
  const { 'offset-x': offsetX, 'offset-y': offsetY, value } = _props;
  const isNumber = NUMBER_REGEXP.test(value);

  return `<OBadge 
  ${propsToAttrStr(_props, ['offset-x', 'offset-y', 'value'])}
  ${isNumber ? `:value="${parseInt(value)}"` : `value="${value}"`}
  ${offsetX || offsetY ? `:offset="[${offsetX}, ${offsetY}]"` : ''}
  >
    <img src="/avatar.svg" alt="avatar" style="width: 48px; height: 48px;" />
  </OBadge>`;
};

export const docs = {
  'zh-CN':
    '### 使用\n' +
    '徽标包含 `primary`、`success`、`warning`、`danger` 四种主题色。\n\n' +
    '徽标 `value` 参数支持数字和文本两种类型的值，当为数字时 `max` 参数会影响值的显示。\n\n' +
    '徽标支持小红点样式，小红点中不会显示徽标内容。\n\n' +
    '徽标可以通过 `offset` 设置偏移位置。',
  'en-US':
    '### Usage\n' +
    'The badge includes four theme colors: `primary`, `success`, `warning`, and `danger`.\n\n' +
    'The `value` parameter of the badge supports both numeric and text values. When it is numeric, the `max` parameter affects how the value is displayed.\n\n' +
    'The badge supports a small dot style, where the content is not displayed in the dot.\n\n' +
    'The badge can set an offset position using the `offset` property.',
};
