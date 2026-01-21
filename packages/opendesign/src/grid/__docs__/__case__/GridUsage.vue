<docs lang="md">
<!-- zh-CN -->

### 使用

ORow的属性：

通过属性 `inline` 控制 `Row` 的根元素的 `display` 是否为 `inline-flex`；

通过属性 `align` 控制容器辅轴对齐方式；

通过属性 `justify` 控制容器主轴对齐方式；

通过属性 `wrap` 控制容器 `flex-wrap` 样式的值；

通过属性 `direction` 控制容器 `flex-direction` 样式的值；

通过属性 `gap` 控制子元素的间距，注意：当同时为组件传递了 `gap`、`gapX`、`gapY` 属性，将优先使用 `gapX`、`gapY`；

通过属性 `pcS`、`laptop`、`pad`、`padV`、`phone` 可以控制不同断点尺寸下的 `gap`值。

OCol的属性：

通过属性 `flex` 控制元素的 `flex` 样式的值；

通过属性 `align` 控制元素辅轴的对齐方式；

通过属性 `pcS`、`laptop`、`pad`、`padV`、`phone` 可以控制不同断点尺寸下的 `flex`值。

<!-- en-US -->

The attributes of ORow:

Control whether the `display` of the root element of the `Row` is`inline-flex`through the property`inline`;

Control the alignment of the container\`s auxiliary axes through the attribute `align`;

Control the alignment of the container\`s main axis through the attribute `justify`;

Control the value of the container `flex-wrap` style through the attribute `wrap`;

Control the value of the container `flex-direction` style through the attribute `direction`;

Control the spacing of child elements through the attribute `gap`. Note: When the attributes`gap`, `gapX`, and `gapY` are passed to a component simultaneously, `gapX` and `gapY` will be used first.

The `gap` value at different breakpoint sizes can be controlled through the attributes`pcS`, `laptop`, `pad`, `padV`, and `phone`.

The properties of OCol:

Control the value of the `flex` style of an element through the attribute `flex`;

Control the alignment of the element\`s secondary axis through the attribute `align`;

The `flex` value at different breakpoint sizes can be controlled through the attributes`pcS`, `laptop`, `pad`, `padV`, and `phone`.

### Usage
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { type RowMediaT } from '../../types';

const _oSchema = {
  inline: {
    type: 'boolean',
  },
  align: {
    type: 'list',
    list: ['center', 'flex-start', 'flex-end', 'stretch', 'baseline', 'inherit', 'initial'],
  },
  justify: {
    type: 'list',
    list: ['center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly', 'inherit', 'initial'],
  },
  wrap: {
    type: 'list',
    list: ['wrap', 'nowrap', 'wrap-reverse', 'initial', 'inherit'],
  },
  direction: {
    type: 'list',
    list: ['row', 'row-reverse', 'column', 'column-reverse'],
  },
  gap: { type: 'string', default: '32px' },
  gapX: { type: 'string', default: '24px' },
  gapY: { type: 'string', default: '24px' },
  flex: {
    type: 'string',
    default: '33.3333%',
  },
  pcSGap: { type: 'string', default: '24px 20px' },
  useGap: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const rowFliterSet = new Set(['useGap', 'flex', 'gap', 'pcSGap']);
const colFilterList = Object.keys(_oSchema).filter((item) => item !== 'flex');

let rowFilterList = Array.from(rowFliterSet);

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  const { useGap, pcSGap } = props;
  const tempArr = pcSGap.split(' ');
  const arrLen = tempArr.length;

  if (arrLen === 1) {
    _oCtx.pcS.gap = tempArr[0] ?? '';
    _oCtx.pcS.gapX = undefined;
    _oCtx.pcS.gapY = undefined;
  } else if (arrLen === 2) {
    _oCtx.pcS.gapX = tempArr[0] ?? '';
    _oCtx.pcS.gapY = tempArr[1] ?? '';
  }

  if (useGap) {
    rowFliterSet.delete('gap');
    rowFliterSet.add('gapX');
    rowFliterSet.add('gapY');
  } else {
    rowFliterSet.add('gap');
    rowFliterSet.delete('gapX');
    rowFliterSet.delete('gapY');
  }
  rowFilterList = Array.from(rowFliterSet);

  return `<ORow class="demo-grid-usage-wrap" :pc-s="ctx.pcS" ${propsToAttrStr(props, rowFilterList as Array<keyof typeof props>)}>
    <OCol ${propsToAttrStr(props, colFilterList as Array<keyof typeof props>)} v-for="item in ctx.list" :key="item">
      <div class="box">{{ item }}</div>
    </OCol>
  </ORow>`;
};

const _oCtx = reactive({
  list: [1, 2, 3, 4, 5, 6, 7, 8],
  pcS: {} as RowMediaT,
});
</script>
<template></template>
<style lang="scss">
.demo-grid-usage-wrap {
  .box {
    background-color: yellowgreen;
    height: 80px;
    color: white;
    font-size: var(--o-font_size-h1);
    line-height: 80px;
    text-align: center;
  }
}
</style>
