<docs lang="md">
<!-- zh-CN -->

### 使用

输入框包含 `primary`、`success`、`warning`、`danger` 四种主题色；

三种尺寸：`small`、`medium`、`large` ；

三种形状：`solid`、`outline`、`text` ；

禁用状态：`disabled` ；

按钮的圆角可以通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值。

<!-- en-US -->

### Usage

The input includes four theme colors: `primary`, `success`, `warning`, and `danger`;

Three sizes: `small`, `medium`, and `large`;

Three shapes: `solid`, `outline`, and `text`;

Disabled state: `disabled`;

The input's radius can be set to half circle by setting `pill` to `true`, or to css property `border-radius` accepted values.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  placeholder: {
    type: 'string',
    default: '请输入...',
  },
  color: {
    type: 'list',
    list: ['normal', 'primary', 'success', 'warning', 'danger'],
  },
  variant: {
    type: 'list',
    list: ['outline', 'solid', 'text'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
  },
  type: { type: 'list', list: ['text', 'password'] },
  round: {
    type: 'list',
    list: ['pill', '12px', 'var(--o-radius-l)'],
  },
  disabled: {
    type: 'boolean',
  },
  readonly: {
    type: 'boolean',
  },
  clearable: {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `<OInput v-model="ctx.inputVal"  ${propsToAttrStr(props)} /> 
    <div class="doc-input-text-wrap"><span>输入的值：</span>{{ctx.inputVal}}</div>`;
};

const _ctx = reactive({
  inputVal: '',
});
</script>
<style lang="scss">
.doc-input-text-wrap {
  margin-top: 12px;
  font-size: 16px;
  line-height: 24px;
  span {
    font-weight: 500;
  }
}
</style>
