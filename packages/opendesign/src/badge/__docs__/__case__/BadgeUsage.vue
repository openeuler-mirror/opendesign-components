<docs lang="md">
<!-- zh-CN -->

### 使用

徽标包含 `primary`、`success`、`warning`、`danger` 四种主题色。

徽标 `value` 参数支持数字和文本两种类型的值，当为数字时 `max` 参数会影响值的显示。

徽标支持小红点样式，小红点中不会显示徽标内容。

徽标可以通过 `offset` 设置偏移位置。

<!-- en-US -->

### Usage

The badge includes four theme colors: `primary`, `success`, `warning`, and `danger`.

The `value` parameter of the badge supports both numeric and text values. When it is numeric, the `max` parameter affects how the value is displayed.

The badge supports a small dot style, where the content is not displayed in the dot.

The badge can set an offset position using the `offset` property.
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
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
  offsetX: {
    type: 'number',
    default: 0,
  },
  offsetY: {
    type: 'number',
    default: 0,
  },
} satisfies Record<string, DocDemoSchema>;

const NUMBER_REGEXP = /^\d+$/;
const _template: DocDemoTemplate<typeof _schema> = (props) => {
  const { offsetX, offsetY, value } = props;
  const isNumber = NUMBER_REGEXP.test(value);

  return `
<OBadge
  ${propsToAttrStr(props, ['offsetX', 'offsetY', 'value'])}
  ${isNumber ? `:value="${parseInt(value)}"` : `value="${value}"`}
  ${offsetX || offsetY ? `:offset="[${offsetX}, ${offsetY}]"` : ''}
>
  <img src="/avatar.svg" alt="avatar" style="width: 48px; height: 48px;" />
</OBadge>`;
};

const _ctx = {};
</script>
