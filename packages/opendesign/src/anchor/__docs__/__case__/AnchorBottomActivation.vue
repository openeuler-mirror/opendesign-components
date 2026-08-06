<docs lang="md">
<!-- zh-CN -->

### 底部锚点激活

当页面内容接近底部、剩余可滚动距离不足一屏时，组件会自动调整激活阈值，确保底部锚点仍可被正确选中。滚动到容器底部，观察最后一个锚点是否被激活。

<!-- en-US -->

### Bottom Anchor Activation

When the page content is near the bottom and the remaining scrollable distance is less than one viewport, the component automatically adjusts the activation threshold to ensure bottom anchors can still be selected. Scroll to the bottom of the container and observe whether the last anchor is activated.
</docs>

<script setup lang="ts">
import { OAnchor, OAnchorItem, OScroller } from '@opensig/opendesign';
</script>

<template>
  <div class="demo-anchor-bottom-wrap">
    <OAnchor class="demo-anchor" container="#anchor-bottom-demo .anchor-bottom-scroll" :target-offset="10">
      <OAnchorItem href="#bottom-block1" title="block1" />
      <OAnchorItem href="#bottom-block2" title="block2" />
      <OAnchorItem href="#bottom-block3" title="block3" />
      <OAnchorItem href="#bottom-block4" title="block4" />
      <OAnchorItem href="#bottom-block5" title="block5" />
      <OAnchorItem href="#bottom-block6" title="block6" />
    </OAnchor>
    <OScroller id="anchor-bottom-demo" wrap-class="anchor-bottom-scroll" show-type="always">
      <div class="demo-wrap">
        <div id="bottom-block1" class="block">block1</div>
        <div id="bottom-block2" class="block">block2</div>
        <div id="bottom-block3" class="block">block3</div>
        <div id="bottom-block4" class="block">block4</div>
        <div id="bottom-block5" class="block block5">block5</div>
        <div id="bottom-block6" class="block block6">block6</div>
      </div>
    </OScroller>
  </div>
</template>

<style lang="scss" scoped>
.demo-anchor-bottom-wrap {
  display: flex;
  gap: 16px;

  .demo-anchor {
    width: 160px;
    flex-shrink: 0;
  }

  #anchor-bottom-demo {
    flex: 1;
    height: 300px;
  }

  .block {
    height: 150px;

    &:nth-child(even) {
      background-color: paleturquoise;
    }

    &:nth-child(odd) {
      background-color: pink;
    }
  }

  .block5 {
    height: 80px;
  }
  .block6 {
    height: 50px;
  }
}
</style>
