<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

### Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oCtx = {
  list: new Array(100).fill(0).map((_, i) => ({ label: i + 1 })),
};

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
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => {
  return `<OVirtualList class="virtual-list-demo container" ${propsToAttrStr(_props)} :list="ctx.list">
  <template  #default="{ item, index }">
    <div :key="item.label" class="section" :class="\`item-\${index % 3}\`">
      <span>Row:</span> <span>{{ item.label }}</span>------<span>Height:</span> <span>80px</span>
    </div>
  </template>
</OVirtualList>`;
};
</script>
<style lang="scss">
.virtual-list-demo {
  &.scrollbar-wrapper {
    position: relative;
  }
  &.container {
    width: 100%;
    height: 300px;
    border: 2px solid rgb(111, 45, 234);
    box-sizing: border-box;
    display: flex;
  }
  .col {
    flex: 1;
  }

  .item-0 {
    background-color: #9c27b0;
    color: white;
  }
  .item-1 {
    background-color: #ff9800;
  }
  .item-2 {
    background-color: #4caf50;
  }

  section > div {
    flex: 0 1 30%;
  }
  .section {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
  }

  .container2 {
    width: 100%;
    border: 2px solid rgb(111, 45, 234);
  }
}
</style>
