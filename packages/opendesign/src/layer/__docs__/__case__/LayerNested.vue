<docs lang="md">
<!-- zh-CN -->

### z-index

OLayer 支持 z-index 自动管理，多个嵌套浮层按打开顺序自动分配递增的 z-index。

<!-- en-US -->

### z-index

OLayer automatically manages z-index. Nested layers receive incrementing z-index values in the order they are opened.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OLayer, OButton } from '@opensig/opendesign';

const parentVisible = ref(false);
const childVisible = ref(false);
</script>
<template>
  <div class="layer-doc-nested">
    <OButton color="primary" @click="parentVisible = true">Open Parent</OButton>
    <OLayer v-model:visible="parentVisible" :wrapper="null">
      <div class="layer-doc-nested-main parent">
        <h2>Parent Layer</h2>
        <p>Click below to open a child layer on top.</p>
        <OButton color="primary" @click="childVisible = true">Open Child</OButton>
      </div>
    </OLayer>
    <OLayer v-model:visible="childVisible" :wrapper="null">
      <div class="layer-doc-nested-main child">
        <h2>Child Layer</h2>
        <p>Child gets higher z-index automatically.</p>
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
