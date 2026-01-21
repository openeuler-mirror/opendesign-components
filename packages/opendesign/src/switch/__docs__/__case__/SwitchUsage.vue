<docs lang="md">
<!-- zh-CN -->

### 使用

两种种尺寸：`small`、`medium` ；

禁用切换：`disabled` ；

加载状态：`loading` ；

按钮的圆角可以通过 `pill` 设置为半圆，也可以是 css 属性 `border-radius` 能够接受的其它值；

可以通过 `checkedValue`、`uncheckedValue` 自定义选中状态与未选中状态对应的值。

<!-- en-US -->

### Usage

Two sizes: `small` and `medium`;

Disable switching: `disabled`;

loading status: `loading`;

The rounded corners of the button can be set to a semi-circle through `pill`, or they can be other values acceptable to the css property `border-radius`;

The values corresponding to the selected and unselected states can be customized through `checkedValue` and `uncheckedValue`.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  size: {
    type: 'list',
    list: ['medium', 'small'],
  },
  round: {
    type: 'list',
    list: ['pill', '4px', '8px'],
  },
  disabled: {
    type: 'boolean',
  },
  loading: {
    type: 'boolean',
  },
  checkedValue: {
    type: 'string',
    default: 'apple',
  },
  uncheckedValue: {
    type: 'string',
    default: 'banana',
  },
  toggledVal: {
    type: 'string',
    disabled: true,
  },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  selectedVal: '',
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  props.toggledVal = _oCtx.selectedVal;
  return `<OSwitch v-model='ctx.selectedVal' ${propsToAttrStr(props, ['toggledVal'])} />`;
};
</script>
