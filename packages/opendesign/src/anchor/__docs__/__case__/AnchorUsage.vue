<docs lang="md">
<!-- zh-CN -->

### 使用

`layout` 属性

- 说明：锚点的方向，指定锚点的布局（默认值：垂直 v）。可以通过`--anchor-content-max-width`css变量来设置内容区域宽度

`size` 属性

- 说明：仅垂直模式支持，指定锚点的尺寸风格（默认值：medium）

`container` 属性

- 说明：指定锚点监听的滚动容器（默认值：window）
- 用法：组件会在该容器上监听 `scroll` 事件，以判断当前激活的锚点
- 示例：`container="#wrap"` 表示监听 id 为 wrap 的容器滚动事件

`targetOffset` 属性

- 说明：目标元素跳转或激活时距离容器顶部的偏移量（默认值：0）
- 示例：`:target-offset="10"` 表示点击锚点时目标元素会滚动到距离容器顶部 10px 的位置；滚动距离小于 10px 时锚点处于激活状态

`bounds` 属性

- 说明：设置锚点激活的判定边界（默认值：5）
- 用法：当需要跳转位置和激活判定边界不一致时可设置
- 示例：`:bounds="100" :target-offset="10"` 表示目标元素滚动到距离容器顶部 110px 时锚点激活。可实现点击锚点时目标元素滚动到顶部，滚动浏览时需到容器中上部才激活锚点的交互效果

`changeHash` 属性

- 说明：是否在点击锚点时改变浏览器地址栏的 hash 值（默认值：true）
- 用法：如果需要手动控制 URL 跳转，可以设置为 false，并在 `click` 事件中处理跳转逻辑
- 示例：`:change-hash="false"` 表示点击锚点时不会改变浏览器地址栏的 hash 值

锚点嵌套：`OAnchorItem` 可以嵌套使用，形成多级锚点结构

<!-- en-US -->

### Usage

`layout` property

- Description：The orientation of the anchor, supports both horizontal(h) and vertical(v)(default: medium). The width of the content area can be set via the CSS variable `--anchor-content-max-width`

`size` property

- Description：Only supported in vertical layout. The size of anchor (default: medium)

`container` property

- Description: Specifies the scroll container to be monitored by the anchor (default: window)
- Usage: The component listens for the `scroll` event on this container to determine the currently active anchor
- Example: `container="#wrap"` means listening to the scroll event of the container with id "wrap"

`targetOffset` property

- Description: The offset from the top of the container when the target element is scrolled or activated (default: 0)
- Example: `:target-offset="10"` means when clicking the anchor, the target element will scroll to 10px from the top of
  the container; when the scroll distance is less than 10px, the anchor is considered active

`bounds` property

- Description: Sets the boundary for anchor activation (default: 5)
- Usage: Use when the scroll position and activation boundary need to be different
- Example: `:bounds="100" :target-offset="10"` means the anchor is activated when the target element is 110px from the top of the container. This allows the target element to scroll to the top when clicking the anchor, but requires scrolling further down to activate

`changeHash` property

- Description: Whether to change the browser's address bar hash value when clicking the anchor (default: true)
- Usage: If you need to manually control URL navigation, set this to false and handle the navigation logic in the `click` event
- Example: `:change-hash="false"` means clicking the anchor will not change the hash value in the browser's address bar

Nested anchors: `OAnchorItem` can be nested to create multi-level anchor structures
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OAnchor, OAnchorItem, AnchorSizeTypes, DirectionTypes } from '@opensig/opendesign';

import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  layout: {
    type: 'list',
    list: DirectionTypes,
  },
  size: {
    type: 'list',
    list: AnchorSizeTypes,
  },
  container: {
    type: 'string',
    default: '#wrap',
    disabled: true,
  },
  maxWidth: {
    type: 'string',
    default: '70%',
    disabled: true,
  },
  bounds: {
    type: 'number',
    default: 100,
  },
  targetOffset: {
    type: 'number',
    default: 10,
  },
  changeHash: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<div ${props.layout === 'h' ? 'id="wrap"' : ''} class="demo-anchor-usage-wrap ${props.layout === 'v' ? 'row' : ''} demo-anchor-usage-wrap-${props.layout}">
    ${props.layout === 'h' ? '<div class="height-holder"></div>' : ''}
    <OAnchor class="demo-anchor" ${propsToAttrStr(props)}>
      <OAnchorItem href="#container-block1" title="container-block1">
        <OAnchorItem href="#container-block1-1" title="container-block1-1" />
      </OAnchorItem>
      <OAnchorItem href="#container-block2" title="container-block2">
        <OAnchorItem href="https://docs.openeuler.org" observe-href="#container-block2-1" title="自定义监听container-block2-1" />
        <OAnchorItem href="#container-block2-2" title="container-block2-2">
          <OAnchorItem href="#container-block2-2-1" title="container-block2-2-1换行openEuler Developer Day 2023 （简称 ODD 2023）是开放原子开源基金会旗下 openEuler 社区" />
        </OAnchorItem>
      </OAnchorItem>
      <OAnchorItem href="#container-block4" title="container-block4" />
      <OAnchorItem href="#container-block5" title="container-block5">
        <OAnchorItem href="#container-block5-1" title="container-block5-1" />
      </OAnchorItem>
      <OAnchorItem href="#container-block6" title="container-block6" />
      <OAnchorItem href="#container-block7" title="container-block7" />
      <OAnchorItem href="#container-block8" title="container-block8" />
      <OAnchorItem href="#container-block9" title="container-block9" />
    </OAnchor>
    <div ${props.layout === 'v' ? 'id="wrap"' : ''} class="demo-wrap">
      <div id="container-block1" class="block">container-block1</div>
      <div id="container-block1-1" class="block">container-block1-1</div>
      <div id="container-block2" class="block">container-block2</div>
      <div id="container-block2-1" class="block">container-block2-1</div>
      <div id="container-block2-2" class="block">container-block2-2</div>
      <div id="container-block2-2-1" class="block">container-block2-2-1</div>
      <div id="container-block4" class="block">container-block4</div>
      <div id="container-block5" class="block">container-block5</div>
      <div id="container-block5-1" class="block">container-block5-1</div>
      <div id="container-block6" class="block">container-block6</div>
      <div id="container-block7" class="block">container-block7</div>
      <div id="container-block8" class="block">container-block8</div>
      <div id="container-block9" class="block">container-block9</div>
    </div>
  </div>`;
};

const _oCtx = {};
</script>

<style lang="scss">
.demo-anchor-usage-wrap {
  .block {
    height: 300px;

    &:nth-child(even) {
      background-color: paleturquoise;
    }

    &:nth-child(odd) {
      background-color: pink;
    }
  }
}

.demo-anchor-usage-wrap-v {
  .demo-wrap {
    flex: 1;
    height: 400px;
    overflow: auto;
  }

  .demo-anchor {
    width: 200px;
  }
}
.demo-anchor-usage-wrap-h {
  position: relative;
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;

  @include respond('>pad') {
    width: 50vw;
  }

  .height-holder {
    height: 100px;
  }
  .block {
    width: 70%;
    margin: 0 auto;
  }
  .o-anchor {
    --anchor-content-max-width: 70%;
  }
}
</style>
