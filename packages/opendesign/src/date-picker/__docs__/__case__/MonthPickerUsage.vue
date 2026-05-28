<docs lang="md">
<!-- zh-CN -->

### 使用

`OMonthPicker` 用于选择年月，支持 `normal`、`success`、`warning`、`danger` 四种主题色；

三种尺寸：`small`、`medium`、`large`；三种形态：`solid`、`outline`、`text`；

禁用状态：`disabled`；只读状态：`readonly`；支持快速清除：`clearable`。

<!-- en-US -->

### Usage

`OMonthPicker` for year-month selection. Supports four theme colors: `normal`, `success`, `warning`, `danger`;

Three sizes: `small`, `medium`, `large`; Three shapes: `solid`, `outline`, `text`;

Disabled state: `disabled`; Readonly state: `readonly`; Quick clear: `clearable`.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
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
    list: [undefined, 'pill', '12px'],
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
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  val: '',
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<div style="display:flex;align-items:center;gap:12px;"><OMonthPicker v-model="ctx.val" style="width: 180px" ${propsToAttrStr(props)} /><span>{{ ctx.val }}</span></div>`;
};
</script>
