<docs lang="md">
<!-- zh-CN -->

### 图片懒加载

通过设置`lazy`属性，可以开启图片懒加载。

- 当 `background` 属性为假时，组件使用 `<img>` 标签渲染图片，此时使用的是 `<img>` 原生的懒加载，`lazy` 取值为 `true` 或 `false`
- 当 `background` 属性为真时，组件以背景图的形式渲染图片，此时使用 `IntersectionObserver` 处理懒加载，`lazy` 取值为 `true` 或 `false` 或 `IntersectionObserverInit` 对象

```ts
/** new IntersectionObserver(callback, options?: IntersectionObserverInit) */
interface IntersectionObserverInit {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}
```

<!-- en-US -->

### Image Lazy Loading

Lazy loading for images can be enabled by setting the `lazy` attribute.

- When the `background` attribute is `false`, the component uses the `<img>` tag to render the image.
  In this case, the native lazy loading of the `<img>` tag is used, and the `lazy` attribute accepts values of `true` or `false`.
- When the `background` attribute is `true`, the component renders the image as a background image.
  In this case, `IntersectionObserver` is used to handle lazy loading, and the `lazy` attribute accepts values of `true`, `false`,
  or an `IntersectionObserverInit` object.

```ts
/** new IntersectionObserver(callback, options?: IntersectionObserverInit) */
interface IntersectionObserverInit {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}
```
</docs>
<script setup lang="ts">
import { OFigure, useMessage } from '@opensig/opendesign';
import img1 from '@assets/images/tree1.png';
import img2 from '@assets/images/tree2.png';
import img3 from '@assets/images/tree3.png';
import img4 from '@assets/images/tree4.png';
import img5 from '@assets/images/tree5.png';

const message = useMessage('#figure-doc-lazy-container');
const urls = [img1, img2, img3, img4, img5];
function load(index: number) {
  message.success({ content: `Image ${index + 1} loaded.` });
}
</script>
<template>
  <div id="figure-doc-lazy-container" class="lazy-container">
    <div class="wrapper">
      <OFigure v-for="(url, index) in urls" :key="index" :src="url" :lazy="true" :ratio="16 / 9" background class="img-item" @load="load(index)" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.lazy-container {
  width: 100%;
}
.wrapper {
  width: 100%;
  aspect-ratio: 16 / 5;
  overflow: auto;
}
.img-item {
  display: block;
  width: 100%;
}
</style>
