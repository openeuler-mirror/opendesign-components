<docs lang="md">
<!-- zh-CN -->

### 遮罩层配置

`OImageViewer` 内部持有 `OLayer`，通过 `layer-options` 配置遮罩层行为，通过 `v-model:visible` 控制预览显隐：

| 选项          | 说明                                      | 默认值 |
| ------------- | ----------------------------------------- | ------ |
| `mask`        | 是否渲染遮罩层                            | `true` |
| `maskClose`   | 点击遮罩层是否关闭                        | `true` |
| `buttonClose` | 是否渲染右上角关闭按钮                    | `true` |
| `wrapper`     | teleport 目标节点，`null` 表示不 teleport | `null` |

遮罩层场景示例：设置 `mask: true`、`wrapper: 'body'` 将预览 teleport 到 body 并渲染遮罩层。

`close-on-press-escape` 控制是否允许按 ESC 键关闭预览（默认 `true`），`body-close` 控制是否点击图片关闭预览（默认 `false`）。

<!-- en-US -->

### Mask Layer Configuration

`OImageViewer` holds an internal `OLayer`. Configure mask behavior via `layer-options` and control visibility via `v-model:visible`:

| Option        | Description                                    | Default |
| ------------- | ---------------------------------------------- | ------- |
| `mask`        | Whether to render the mask layer               | `true`  |
| `maskClose`   | Whether clicking the mask closes the preview   | `true`  |
| `buttonClose` | Whether to render a top-right close button     | `true`  |
| `wrapper`     | Teleport target node, `null` means no teleport | `null`  |

Overlay example: set `mask: true` and `wrapper: 'body'` to teleport the preview to body with a mask layer.

Use `close-on-press-escape` to control whether pressing ESC closes the preview (default `true`). Use `body-close` to control whether clicking the image closes the preview (default `false`).
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
    <OButton color="primary" variant="solid" @click="onShow">点击打开预览</OButton>
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
      :layer-options="{ mask: true, maskClose: true, buttonClose: true, wrapper: 'body' }"
      :close-on-press-escape="true"
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
