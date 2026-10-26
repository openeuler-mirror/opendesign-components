<docs lang="md">
<!-- zh-CN -->

### 超屏幕图片适屏

当图片原始尺寸超出屏幕时，组件自动计算适屏缩放比例：统一缩放至整张可见（contain 模式，不超原始尺寸）。切换图片、点击重置按钮均回到该适屏比例。下方示例使用 4K 分辨率图片——3840×2160 横向与 2160×3840 竖向，可直观观察适屏缩放效果，也可通过滚轮或双指放大至超出屏幕。

<!-- en-US -->

### Oversized Image Auto-Fit

When the image's original size exceeds the screen, the component automatically calculates a fit-to-screen scale: scales to fit entirely (contain, not exceeding original size). Switching images or clicking reset returns to this fit ratio. The example below uses 4K resolution images — 3840×2160 landscape and 2160×3840 portrait — to demonstrate the auto-fit behavior. You can also zoom beyond the screen via wheel or pinch.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

/** 4K 横向图片（3840×2160）与 4K 竖向图片（2160×3840），用于演示超屏幕适屏缩放 */
const imgList = ['https://dummyimage.com/3840x2160/CEDBF5/626270.jpg&text=4K-H', 'https://dummyimage.com/2160x3840/CEDBF5/626270.jpg&text=4K-V'];
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
    <OButton color="primary" variant="solid" @click="onShow">显示 4K 预览</OButton>
    <OImageViewer v-model:visible="visible" :preview-list="imgList" @close="onClose" />
  </div>
</template>

<style lang="scss" scoped>
/* 使用 inset box-shadow 替代 outline：scale 变换下 outline 外边缘恰好落在视口边界被裁剪，
   inset box-shadow 从元素边缘向内绘制，缩放后始终完整可见。
   选择器编译为 [data-v-xxx] img，通过 teleport wrapper 上的 scope 属性命中 img */
:deep(img) {
  box-shadow: inset 0 0 0 2px var(--o-color-auxiliary4);
}
</style>
