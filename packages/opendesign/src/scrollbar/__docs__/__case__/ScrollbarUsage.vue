<docs lang="md">
<!-- zh-CN -->

### 使用

两种尺寸：`medium`、`small` ；

四种显示方式：`auto`、`always`、`hover`、`never` ；

滚动条显示方式为 `auto` 时,可以通过 `duration` 属性控制滚动条在停止滚动后持续显示的时间；

<!-- en-US -->

Two sizes: `medium`、`small`.

Four display methods: `auto`、`always`、`hover` and `never`.

When the display mode of the scroll bar is `auto`, the duration of the scroll bar's continuous display after it stops scrolling can be controlled through the `duration` attribute.

### Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  size: {
    type: 'list',
    list: ['medium', 'small'],
  },
  disabledX: {
    type: 'boolean',
  },
  disabledY: {
    type: 'boolean',
  },
  showType: {
    type: 'list',
    list: ['always', 'auto', 'hover', 'never'],
  },
  duration: {
    type: 'number',
    default: 600,
  },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = {};

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OScroller class="demo-scrollbar-usage-wrapper" ${propsToAttrStr(props)}>
        <div class="section">1</div>
        <div class="section">2</div>
        <div class="section">3</div>
      </OScroller>`;
};
</script>
<style lang="scss">
.demo-scrollbar-usage-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
  overflow: auto;

  .section {
    height: 75%;
    width: 150%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    &:nth-child(1) {
      background-color: #a4dcc26e;
    }
    &:nth-child(2) {
      background-color: #6288e66e;
    }
    &:nth-child(3) {
      background-color: #f4f8726e;
    }
  }
}
</style>
