<docs lang="md">
<!-- zh-CN -->

### 使用

通过 `accordion` 属性开启手风情模式；

<!-- en-US -->

### Usage

Enable the hand style mode through the `accordion` attribute;
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  accordion: {
    type: 'boolean',
  },
  titleOne: {
    type: 'string',
    default: 'OCollapseItemOne',
  },
  titleTwo: {
    type: 'string',
    default: 'OCollapseItemTwo',
  },
  valueOne: {
    type: 'string',
    default: '1',
  },
  valueTwo: {
    type: 'string',
    default: '2',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  const { titleOne, titleTwo, valueOne, valueTwo } = props;
  _oCtx.titleOne = titleOne;
  _oCtx.titleTwo = titleTwo;
  _oCtx.valueOne = valueOne;
  _oCtx.valueTwo = valueTwo;

  return `<OCollapse ${propsToAttrStr(props, ['titleOne', 'titleTwo', 'valueOne', 'valueTwo'])} @update:modelValue="ctx.updateModelValue">
    <OCollapseItem :title="ctx.titleOne" :value="ctx.valueOne">
      <div style="height:150px;backgroundColor:yellowgreen"></div>
    </OCollapseItem>
    <OCollapseItem :title="ctx.titleTwo" :value="ctx.valueTwo">
      <div style="height:200px;backgroundColor:lightblue"></div>
    </OCollapseItem>
  </OCollapse>`;
};

const updateModelValue = (v: Array<string | number>) => {
  console.log('选中值：', v);
};

const _oCtx = reactive({
  titleOne: 'OCollapseItemOne',
  titleTwo: 'OCollapseItemTwo',
  valueOne: '1',
  valueTwo: '2',
  updateModelValue,
});
</script>
