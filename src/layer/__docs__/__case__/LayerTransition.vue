<docs lang="md">
<!-- zh-CN -->

### 自定义过渡动画

通过 `mainTransition` 和 `maskTransition` 属性可以自定义浮层和遮罩的过渡动画。

`transitionOrigin` 控制内容盒子的缩放原点（`transform-origin`）：

- `'mouse'`：以鼠标点击位置为缩放原点（默认值）
- `'css'`：通过 CSS 变量 `--layer-origin` 设置（默认 `center`）

可用过渡名称：`o-zoom-fade2`（默认）、`o-zoom-fade`、`o-fade-in`、`o-fade-up`。

<!-- en-US -->

### Custom Transition

Customize the layer and mask transitions via the `mainTransition` and `maskTransition` props.

`transitionOrigin` controls the scaling origin (`transform-origin`) of the content box:

- `'mouse'`: Scale from the mouse click position (default)
- `'css'`: Use the CSS variable `--layer-origin` (default: `center`)

Available transition names: `o-zoom-fade2` (default), `o-zoom-fade`, `o-fade-in`, `o-fade-up`.
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
        <p>scale(0.8) → scale(1)，默认过渡动画</p>
      </div>
    </OLayer>

    <OButton color="primary" @click="visible2 = true">o-fade-up</OButton>
    <OLayer v-model:visible="visible2" main-transition="o-fade-up" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>o-fade-up</h2>
        <p>translateY(10px) → translateY(0)，向上淡入</p>
      </div>
    </OLayer>

    <OButton color="primary" @click="visible3 = true">o-fade-in (main + mask)</OButton>
    <OLayer v-model:visible="visible3" main-transition="o-fade-in" mask-transition="o-fade-in" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>o-fade-in</h2>
        <p>纯淡入过渡，无缩放</p>
      </div>
    </OLayer>

    <OButton color="primary" @click="visible4 = true">transitionOrigin: css</OButton>
    <OLayer v-model:visible="visible4" transition-origin="css" :wrapper="null">
      <div class="layer-doc-transition-main">
        <h2>transitionOrigin: css</h2>
        <p>缩放原点由 CSS 变量 --layer-origin 控制（默认 center）</p>
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
