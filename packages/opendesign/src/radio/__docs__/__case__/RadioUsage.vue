<docs lang="md">
<!-- zh-CN -->

### 使用

单选框传值：

1. `value` 用于设置选中后 `modelValue` 的值
2. `modelValue` 的类型是 `string | number | boolean`，当选中后 `modelValue` 的值为 `value` 值

单选框组：当单选框的数量较多时，单选框组可以用来简化 `v-model` 的书写，此时将 `v-model` 写在单选框组上即可

<!-- en-US -->

### Usage

Oradio Value Binding:

1. The `value` is used to set the value of the `modelValue` after selection.
2. The type of `modelValue` is `string | number | boolean`. If selected, the value of `modelValue` will be the value of `Value`.

ORadio Groups: When there are a large number of radio choice boxes, radio choice box groups can be used to simplify the writing of `v-model`. At this time, just write `v-model` on the radio choice box group.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  value: {
    type: 'string',
    default: 'radio',
  },
  disabled: {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `  <div class="demo-radio-usage-wrap">
  <ORadio class="demo-radio-usage" v-model="ctx.radioVal" ${propsToAttrStr(props)} >Apple</ORadio>
    <div class="demo-radio-val">
    Selected：{{ ctx.radioVal }}
  </div></div>
  `;
};

const _ctx = reactive({
  radioVal: '',
});
</script>
<style lang="scss">
.demo-radio-usage-wrap {
  .demo-radio-usage {
    display: block;
    width: fit-content;
    .o-radio-wrap {
      width: fit-content;
    }
  }
  .demo-radio-val {
    margin-top: 16px;
  }
}
</style>
