<docs lang="md">
<!-- zh-CN -->

### 横向锚点 ^[1.2.0](primary)

横向锚点支持上滑吸附(父节点需设置`overflow-y`为`auto`或`scroll`)、自动横向滚动遮罩等功能

<!-- en-US -->

### Horizontal Anchor ^[1.2.0](primary)

The horizontal anchor supports features such as upward sticky
(The parent node needs to have its `overflow-y` property set to `auto` or `scroll`)
and automatic horizontal scrolling mask.
</docs>

<script setup lang="ts">
import { OAnchor, OAnchorItem, OScroller } from '@opensig/opendesign';

const blockNum = 3;
</script>

<template>
  <OScroller id="anchor-sticky-demo" wrap-class="anchor-sticky-scroll" show-type="always" disabled-x>
    <div class="height-holder"></div>
    <OAnchor class="demo-anchor" container="#anchor-sticky-demo .anchor-sticky-scroll" layout="h">
      <OAnchorItem v-for="i in blockNum" :key="i" :href="`#anchor-sticky-demo-block${i}`" :title="`block${i}`" />
    </OAnchor>
    <div class="demo-wrap">
      <div v-for="i in blockNum" :id="`anchor-sticky-demo-block${i}`" :key="i" class="block">anchor-sticky-demo-block{{ i }}</div>
    </div>
  </OScroller>
</template>

<style scoped lang="scss">
#anchor-sticky-demo {
  height: 400px;
}
.height-holder {
  height: 100px;
}
.o-anchor {
  --anchor-content-max-width: 70%;
}
.block {
  height: 400px;
  width: 70%;
  margin: 0 auto;

  &:nth-child(even) {
    background-color: paleturquoise;
  }

  &:nth-child(odd) {
    background-color: pink;
  }
}
</style>
