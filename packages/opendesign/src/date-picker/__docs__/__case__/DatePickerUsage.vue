<docs lang="md">
<!-- zh-CN -->

### 使用

`ODatePicker` 用于选择年月日，支持 `normal`、`success`、`warning`、`danger` 四种主题色；

三种尺寸：`small`、`medium`、`large` ；

三种形态：`solid`、`outline`、`text` ；

禁用状态：`disabled` ；只读状态：`readonly` ；

支持快速清除：`clearable` ；

圆角可通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值。

<!-- en-US -->

### Usage

`ODatePicker` for year-month-day selection. Supports four theme colors: `normal`, `success`, `warning`, and `danger`;

Three sizes: `small`, `medium`, and `large`;

Three shapes: `solid`, `outline`, and `text`;

Disabled state: `disabled`; Readonly state: `readonly`;

Support quick clearing: `clearable`;

The border radius can be set to a semi-circle via `pill`, or any value accepted by the CSS `border-radius` property.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';

import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  format: {
    type: 'string',
    default: 'YYYY/MM/DD',
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
  dayStartOfWeek: {
    type: 'number',
    default: 0,
  },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  val: '',
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<div style="display:flex;align-items:center;gap:12px;"><ODatePicker v-model="ctx.val" style="width: 290px" ${propsToAttrStr({ ...props, format: props.format || undefined })} /><span>{{ ctx.val }}</span></div>`;
};
</script>
