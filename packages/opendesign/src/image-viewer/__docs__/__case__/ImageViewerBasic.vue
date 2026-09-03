<docs lang="md">
<!-- zh-CN -->

### 基本用法

通过 `preview-list` 传入图片地址数组即可渲染预览。支持滚轮缩放、鼠标拖拽、双指缩放、旋转等交互。图片默认展示原始大小，若超出屏幕范围则自动缩放至适屏，但允许放大到任意大小。

通过 `v-model:visible` 控制预览的显示与隐藏。`toolbar` 可自定义工具栏按钮的显示项和排列顺序，默认包含缩小、放大、重置、逆时针旋转和顺时针旋转；关闭按钮由 OLayer 内置提供（通过 `layer-options.buttonClose` 控制）。

通过 `infinite` 属性可开启无限循环切换。通过 `show-progress` 属性可显示图片切换进度指示器。

缩放相关属性：

- `zoom-rate`：控制每次缩放的速率，值越大缩放越快，默认 `1.2`。
- `show-zoom-ratio`：缩放时短暂显示当前缩放百分比，`duration` 控制提示持续时间（毫秒）。
- `toolbar` 中的 `rotateLeft` / `rotateRight` 按钮分别逆时针 / 顺时针旋转 90°，旋转时触发 `rotate` 事件。

<!-- en-US -->

### Basic

Pass an array of image URLs via `preview-list`. Supports wheel zoom, mouse drag, pinch-to-zoom, and rotation interactions. Images default to original size, auto-scaled to fit the screen if larger, but can be zoomed to any size.

Control visibility via `v-model:visible`. Use `toolbar` to customize which tool buttons are shown and their order. The default includes zoom out, zoom in, reset, rotate left, and rotate right. The close button is provided by OLayer (controlled via `layer-options.buttonClose`).

Use `infinite` to enable infinite loop navigation. Use `show-progress` to display an image switching progress indicator.

Zoom-related props:

- `zoom-rate`: Controls the zoom rate per step. Higher values mean faster zoom. Default `1.2`.
- `show-zoom-ratio`: Briefly displays the current zoom percentage. `duration` controls how long the hint stays (in milliseconds).
- `rotateLeft` / `rotateRight` in `toolbar` rotate the image 90° counter-clockwise / clockwise respectively. The `rotate` event fires on rotation.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

const imgList = ['https://www.openeuler.org/img/banners/20230418-odd.png', 'https://www.hiascend.com/p/resource/202511/75b8f0b96d9645b4bd0533782f4b2213.JPG'];
const visible = ref(false);

const onShow = () => {
  visible.value = true;
};
const onClose = () => {
  visible.value = false;
};
</script>

<template>
  <div class="demo-wrap">
    <OButton color="primary" variant="solid" @click="onShow">显示预览</OButton>
    <OImageViewer
      v-model:visible="visible"
      :preview-list="imgList"
      :current-index="0"
      :zoom-rate="1.1"
      :min-scale="0.6"
      :max-scale="5"
      :show-zoom-ratio="true"
      :show-action-area="true"
      :infinite="true"
      :show-progress="true"
      :toolbar="['zoomOut', 'zoomIn', 'reset', 'rotateLeft', 'rotateRight']"
      @close="onClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
}
</style>
