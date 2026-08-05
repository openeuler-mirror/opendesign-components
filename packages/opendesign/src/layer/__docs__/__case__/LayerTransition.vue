<docs lang="md">
<!-- zh-CN -->

### transitionOrigin

`transitionOrigin` 设置内容盒子缩放动画的原点（transform-origin）：

- `'mouse'`: 鼠标点击位置（默认值）
- `'css'`: 通过 CSS 变量 `--layer-origin` 设置（默认 center）

`mainTransition` 和 `maskTransition` 自定义过渡动画。

<!-- en-US -->

### transitionOrigin

`transitionOrigin` controls the scaling origin of the content box (`transform-origin`):

- `'mouse'`: Mouse click position (default)
- `'css'`: CSS variable `--layer-origin` (default: center)

Available transitions: `o-zoom-fade2` (default), `o-fade-up`, `o-fade-in`.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OLayer, OButton } from '@opensig/opendesign';

const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
</script>
<template>
  <div class="layer-doc-transition">
    <OButton color="primary" @click="visible1 = true">o-zoom-fade2 (default)</OButton>
    <OLayer v-model:visible="visible1" main-transition="o-zoom-fade2" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>o-zoom-fade2</h2>
        <p>scale(0.8) to scale(1)</p>
      </div>
    </OLayer>

    <OButton color="primary" @click="visible2 = true">o-fade-up</OButton>
    <OLayer v-model:visible="visible2" main-transition="o-fade-up" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>o-fade-up</h2>
        <p>translateY(10px) to translateY(0)</p>
      </div>
    </OLayer>

    <OButton color="primary" @click="visible3 = true">o-fade-in</OButton>
    <OLayer v-model:visible="visible3" main-transition="o-fade-in" mask-transition="o-fade-in" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>o-fade-in</h2>
        <p>Pure fade, no scaling</p>
      </div>
    </OLayer>

    <OButton color="primary" @click="visible4 = true">transitionOrigin: css</OButton>
    <OLayer v-model:visible="visible4" transition-origin="css" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>transitionOrigin: css</h2>
        <p>Origin controlled by --layer-origin variable</p>
      </div>
    </OLayer>
  </div>
</template>
<style lang="scss" scoped>
.layer-doc-transition {
  height: 300px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
  position: relative;
}
.layer-doc-transition-main {
  padding: 24px;
  background-color: var(--o-color-control5-light);
  min-width: 280px;
}
</style>
