<docs lang="md">
<!-- zh-CN -->

### 使用

时间选择器包含 `normal`、`success`、`warning`、`danger` 四种主题色；

三种尺寸：`small`、`medium`、`large` ；

三种形态：`solid`、`outline`、`text` ；

禁用状态：`disabled` ；只读状态：`readonly` ；

支持快速清除：`clearable` ；

时间格式：`HH:mm:ss`（默认）或 `HH:mm` ；

支持步进设置：`hourStep`、`minuteStep`、`secondStep` ；

圆角可通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值。

<!-- en-US -->

### Usage

The time picker includes four theme colors: `normal`, `success`, `warning`, and `danger`;

Three sizes: `small`, `medium`, and `large`;

Three shapes: `solid`, `outline`, and `text`;

Disabled state: `disabled`; Readonly state: `readonly`;

Support quick clearing: `clearable`;

Time format: `HH:mm:ss` (default) or `HH:mm`;

Step configuration: `hourStep`, `minuteStep`, `secondStep`;

The border radius can be set to a semi-circle via `pill`, or any value accepted by the CSS `border-radius` property.
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { reactive } from 'vue';

const _oSchema = {
  format: {
    type: 'string',
    default: 'HH:mm:ss',
  },
  color: {
    type: 'list',
    list: ['normal', 'success', 'warning', 'danger'],
  },
  variant: {
    type: 'list',
    list: ['outline', 'solid', 'text'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
  },
  round: {
    type: 'list',
    list: [undefined, 'pill', '12px', 'var(--o-radius-l)'],
  },
  disabled: {
    type: 'boolean',
  },
  readonly: {
    type: 'boolean',
  },
  clearable: {
    type: 'boolean',
    default: true,
  },
  hourStep: {
    type: 'number',
    default: 1,
  },
  minuteStep: {
    type: 'number',
    default: 1,
  },
  secondStep: {
    type: 'number',
    default: 1,
  },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  val: '',
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OTimePicker v-model="ctx.val" style="width: 290px" ${propsToAttrStr(props)} />`;
};
</script>
