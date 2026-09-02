<docs lang="md">
<!-- zh-CN -->

### 缩放边界与适屏联动

当 `min-scale` 高于图片的适屏缩放比例（containScale）时，组件会动态扩展有效下界至 containScale，而非强制将图片放大到 `min-scale`。下方示例使用 4K 图片（3840×2160）配合 `min-scale="0.6"`：在移动端或窄屏下 containScale ≈ 0.1–0.5（低于 0.6），初始展示仍为完整可见的 contain 状态，从该位置放大可平滑过渡到 `min-scale` 以上，缩小不会低于 containScale，重置回到 containScale 而非 `min-scale`。

`scalable`（默认 `true`）控制是否允许缩放图片。设为 `false` 时，非移动端（具备 hover 且 fine pointer）缩放锁定为适屏比例，滚轮、键盘等缩放操作均被禁用；工具栏不展示缩放相关按钮（缩小、放大、重置），若过滤后仅剩 `close` 则隐藏整个操作区。移动端（触摸设备）仍允许双指缩放（自然手势）。

<!-- en-US -->

### Zoom Bounds & Auto-Fit Interaction

When `min-scale` exceeds the image's fit-to-screen scale (containScale), the component dynamically expands the effective lower bound to containScale instead of forcing the image up to `min-scale`. The example below uses a 4K image (3840×2160) with `min-scale="0.6"`: on mobile or narrow screens, containScale ≈ 0.1–0.5 (below 0.6), yet the initial display is a fully visible contain state. Zooming in from that position transitions smoothly past `min-scale`; zooming out stops at containScale; reset returns to containScale rather than `min-scale`.

`scalable` (default `true`) controls whether image scaling is allowed. When `false`, scaling is locked to the fit-to-screen ratio on non-mobile devices (hover-capable with fine pointer) — wheel, keyboard, and other zoom interactions are disabled; zoom-related toolbar buttons (zoom out, zoom in, reset) are hidden, and if only `close` remains after filtering, the entire action area is hidden. Pinch-to-zoom remains available on touch devices (natural gesture).
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

/** 4K 横向图片，窄屏下 containScale 低于 minScale 0.6 */
const imgList = ['https://dummyimage.com/3840x2160/cfb6cf/626270.jpg&text=4K'];
const visible = ref(false);

const onShow = () => {
  visible.value = true;
};
const onClose = () => {
  visible.value = false;
};
</script>

<template>
  <div>
    <OButton color="primary" variant="solid" @click="onShow">显示预览（minScale=0.6）</OButton>
    <OImageViewer v-model:visible="visible" :preview-list="imgList" :zoom-rate="1.2" :min-scale="0.6" :max-scale="8" @close="onClose" />
  </div>
</template>
