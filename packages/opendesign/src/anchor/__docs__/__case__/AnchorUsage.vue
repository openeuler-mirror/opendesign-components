<docs lang="md">
<!-- zh-CN -->

### 使用

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

`container` property
- Description: Specifies the scroll container to be monitored by the anchor (default: window)
- Usage: The component listens for the `scroll` event on this container to determine the currently active anchor
- Example: `container="#wrap"` means listening to the scroll event of the container with id "wrap"

`targetOffset` property
- Description: The offset from the top of the container when the target element is scrolled or activated (default: 0)
- Example: `:target-offset="10"` means when clicking the anchor, the target element will scroll to 10px from the top of the container; when the scroll distance is less than 10px, the anchor is considered active

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
import { OAnchor, OAnchorItem } from '@opensig/opendesign';
import { useRouter } from 'vue-router';
const router = useRouter();
const handleAnchorClick = (_: Event, link?: string) => {
  // control URL manually
  if (link) {
    router.push(link);
  }
};
</script>

<template>
  <div class="row">
    <div id="wrap" class="demo-wrap">
      <div id="container-block1" class="block">container-block1</div>
      <div id="container-block2" class="block">container-block2</div>
      <div id="container-block2-1" class="block">container-block2-1</div>
      <div id="container-block4" class="block">container-block4</div>
    </div>
    <div class="demo-anchor">
      <OAnchor container="#wrap" :bounds="100" :target-offset="10" :change-hash="false" @click="handleAnchorClick">
        <OAnchorItem href="#container-block1" title="container-block1" />
        <OAnchorItem href="#container-block2" title="container-block2">
          <!-- Nested anchor -->
          <OAnchorItem href="#container-block2-1" title="container-block2-1" />
        </OAnchorItem>
        <OAnchorItem href="#container-block4" title="container-block4" />
      </OAnchor>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block {
  height: 300px;

  &:nth-child(even) {
    background-color: paleturquoise;
  }

  &:nth-child(odd) {
    background-color: pink;
  }
}

.demo-wrap {
  flex: 1;
  height: 400px;
  overflow: auto;
}
.demo-anchor {
  min-width: 185px;
}
</style>
