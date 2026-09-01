<docs lang="md">
<!-- zh-CN -->

### 搭配 Layer

放入 `OLayer` 中作为浮层预览使用，`OImageViewer` 会通过 `inject` 自动获取 `OLayer` 的关闭能力。

<!-- en-US -->

### With Layer

Place inside `OLayer` to use as an overlay preview. `OImageViewer` automatically acquires the layer's close capability via `inject`.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OLayer, OButton } from '@opensig/opendesign';

const imgList = ['https://www.hiascend.com/p/resource/202511/75b8f0b96d9645b4bd0533782f4b2213.JPG', 'https://www.openeuler.org/img/banners/20230418-odd.png'];
const previewVisible = ref(false);

const onPreviewChange = (v: boolean) => {
  previewVisible.value = v;
};
const onClickHandle = () => {
  previewVisible.value = true;
};
</script>

<template>
  <div class="demo-wrap">
    <OButton color="primary" variant="solid" @click="onClickHandle">点击预览图片</OButton>
    <OLayer v-model:visible="previewVisible" @change="onPreviewChange">
      <OImageViewer
        class="demo-image-viewer-in-layer"
        :preview-list="imgList"
        :current-index="0"
        :zoom-rate="1.1"
        :min-scale="0.6"
        :max-scale="5"
        :show-zoom-ratio="true"
        :show-action-area="true"
      />
    </OLayer>
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
}

.demo-image-viewer-in-layer {
  height: 100vh;
}
</style>
