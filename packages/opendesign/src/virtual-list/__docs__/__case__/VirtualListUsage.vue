<docs lang="md">
<!-- zh-CN -->

### 使用

通过左侧控件面板调整 `itemSize`、`defaultStartIndex`、`buffer`、`threshold` 等参数，实时观察虚拟滚动在不同配置下的渲染效果。水平布局请见下方「水平布局」示例。

<!-- en-US -->

### Usage

Adjust parameters such as `itemSize`, `defaultStartIndex`, `buffer`, and `threshold` via the control panel on the left to observe virtual scrolling behavior under different configurations in real time. For horizontal layout, see the "Horizontal Layout" case below.
</docs>
<script lang="ts" setup>
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oCtx = reactive({
  list: new Array(100).fill(0).map((_, i) => ({ label: i + 1 })),
});

const _oSchema = {
  defaultStartIndex: {
    type: 'number',
    default: 10,
  },
  itemSize: {
    type: 'number',
    default: 80,
  },
  buffer: {
    type: 'number',
    default: 1,
  },
  threshold: {
    type: 'number',
    default: null,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => {
  return `<OVirtualList class="virtual-list-demo container" ${propsToAttrStr(_props)} :list="ctx.list">
  <template  #default="{ item, index }">
    <div :key="item.label" class="section" :class="\`item-\${index % 8 + 1}\`">
      <span>Row:</span> <span>{{ item.label }}</span>------<span>Height:</span> <span>80px</span>
    </div>
  </template>
</OVirtualList>`;
};
</script>
<style lang="scss">
@use 'sass:list';
// 交叉色板：8 色系交叉取浅色（1-2 级），避免同色系连续
$demo-bg:
  rgb(var(--o-deepblue-1)), rgb(var(--o-yellow-2)), rgb(var(--o-purple-1)), rgb(var(--o-cyan-2)), rgb(var(--o-pink-1)), rgb(var(--o-blue-2)),
  rgb(var(--o-rosyred-1)), rgb(var(--o-lime-2));

.virtual-list-demo {
  &.container {
    width: 100%;
    height: 300px;
    border: 2px solid var(--o-color-control4);
    box-sizing: border-box;
    display: flex;
  }
  .col {
    flex: 1;
  }

  .section {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: var(--o-gap-2) 0;
  }

  .container2 {
    width: 100%;
    border: 2px solid var(--o-color-control4);
  }

  @for $i from 1 through 8 {
    .item-#{$i} {
      background-color: list.nth($demo-bg, $i);
    }
  }
}
</style>
