<docs lang="md">
<!-- zh-CN -->

### 搭配 Figure

`OFigure` 内部已集成 `OImageViewer`，通过 `preview` 属性即可启用预览。`preview` 支持传对象，直接透传 `OImageViewer` 的全部属性（如
`zoomRate`、`minScale`、`toolbar` 等）；也可通过 `#preview-extra` 插槽在预览中叠加自定义内容。

<!-- en-US -->

### With Figure

`OFigure` integrates `OImageViewer` internally — enable preview via the `preview` prop. Pass an object to `preview` to
forward any `OImageViewer` props (e.g. `zoomRate`, `minScale`, `toolbar`). Use the `#preview-extra` slot to overlay
custom content in the preview.
</docs>

<script setup lang="ts">
import { OFigure } from '@opensig/opendesign';

const imgList = ['https://www.hiascend.com/p/resource/202511/75b8f0b96d9645b4bd0533782f4b2213.JPG', 'https://www.openeuler.org/img/banners/20230418-odd.png'];
</script>

<template>
  <div class="demo-wrap">
    <OFigure :src="imgList[1]" :preview="{ previewList: imgList, zoomRate: 1.1, minScale: 0.6, maxScale: 5, duration: 800 }" />
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
}
</style>
