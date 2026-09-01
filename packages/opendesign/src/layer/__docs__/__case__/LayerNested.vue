<docs lang="md">
<!-- zh-CN -->

### 嵌套浮层

OLayer 支持 `z-index` 自动管理，多个嵌套浮层会按打开顺序自动分配递增的 `z-index`，无需手动设置层级。

子浮层的遮罩会覆盖在父浮层内容之上，点击子浮层遮罩可关闭子浮层而不影响父浮层。

<!-- en-US -->

### Nested Layers

OLayer automatically manages `z-index` — nested layers receive incrementing z-index values in the order they are opened, without manual configuration.

The child layer's mask overlays the parent layer's content. Clicking the child mask closes only the child layer, leaving the parent unaffected.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OLayer, OButton } from '@opensig/opendesign';

const parentVisible = ref(false);
const childVisible = ref(false);
const handleOpenParent = () => {
  parentVisible.value = true;
};
const handleOpenChild = () => {
  childVisible.value = true;
};
</script>
<template>
  <div class="layer-doc-nested">
    <OButton color="primary" @click="handleOpenParent">Open Parent</OButton>
    <OLayer v-model:visible="parentVisible" :wrapper="null">
      <div class="layer-doc-nested-main parent">
        <h2>Parent Layer</h2>
        <p>这是父浮层。点击下方按钮可在父浮层之上打开子浮层。</p>
        <OButton color="primary" @click="handleOpenChild">Open Child</OButton>
      </div>
    </OLayer>
    <OLayer v-model:visible="childVisible" :wrapper="null">
      <div class="layer-doc-nested-main child">
        <h2>Child Layer</h2>
        <p>子浮层自动获得更高的 z-index，遮罩覆盖父浮层内容。</p>
        <OButton color="primary" @click="childVisible = false">Close Child</OButton>
      </div>
    </OLayer>
  </div>
</template>
<style lang="scss" scoped>
.layer-doc-nested {
  height: 300px;
  position: relative;
}
.layer-doc-nested-main {
  padding: 24px;
  background-color: var(--o-color-control5-light);
  min-width: 320px;
}
.parent {
  background-color: var(--o-color-control4-light);
}
.child {
  background-color: var(--o-color-control5-light);
}
</style>
