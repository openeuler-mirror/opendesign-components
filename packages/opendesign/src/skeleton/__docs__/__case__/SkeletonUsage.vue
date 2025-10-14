<docs lang="md">
<!-- zh-CN -->

### 使用

1. 骨架屏的显示与隐藏通过 `loading` 属性控制；
2. 骨架屏的动画效果通过 `animation` 属性控制；
3. 骨架屏的显示文本行数通过 `rows` 属性控制。

<!-- en-US -->

1. The display and hiding of the skeleton screen are controlled by the `loading` attribute.

2. The animation effect of the skeleton screen is controlled through the `animation` property.

3. The number of text lines displayed on the skeleton screen is controlled by the `rows` attribute.

### Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  loading: {
    type: 'boolean',
    default: true,
  },
  animation: {
    type: 'boolean',
  },
  rows: {
    type: 'number',
    default: 3,
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `<div class="demo-skeleton-usage-wrap">
            <OSkeleton  ${propsToAttrStr(props)} > Demo of Skeleton </OSkeleton>
          </div>`;
};

const _ctx = {};
</script>
