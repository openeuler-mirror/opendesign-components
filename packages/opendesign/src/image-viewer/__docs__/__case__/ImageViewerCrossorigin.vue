<docs lang="md">
<!-- zh-CN -->

### crossorigin

`crossorigin` 属性设置 `<img>` 的 [CORS 属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#attr-crossorigin)，用于跨域图片加载场景：

- `'anonymous'`：匿名请求，不带凭证，需目标服务器返回 `Access-Control-Allow-Origin` 响应头才能在 Canvas 中读取像素。
- `'use-credentials'`：带凭证（Cookie、HTTP 认证）请求，需服务器返回 `Access-Control-Allow-Credentials: true`。
- 空字符串（默认）：不设置 CORS 属性，图片按常规方式加载。

下方示例对跨域图片显式设置 `crossorigin="anonymous"`，打开预览后可在 DevTools Network 面板观察请求头是否携带 `Origin`，以及响应是否带 `Access-Control-Allow-Origin`。

<!-- en-US -->

### crossorigin

The `crossorigin` prop sets the [CORS attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin) of the underlying `<img>`, useful for cross-origin image loading:

- `'anonymous'`: Anonymous request without credentials. Requires the origin server to return `Access-Control-Allow-Origin` for Canvas pixel access.
- `'use-credentials'`: Request with credentials (cookies, HTTP auth). Requires the server to return `Access-Control-Allow-Credentials: true`.
- Empty string (default): No CORS attribute set — the image loads the conventional way.

The example below explicitly sets `crossorigin="anonymous"` on a cross-origin image. After opening the preview, inspect the Network panel in DevTools to verify the `Origin` request header and the `Access-Control-Allow-Origin` response header.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OImageViewer, OButton } from '@opensig/opendesign';

const imgList = ['https://www.openeuler.org/img/banners/20230418-odd.png'];
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
    <OButton color="primary" variant="solid" @click="onShow">显示预览（crossorigin）</OButton>
    <OImageViewer v-model:visible="visible" :preview-list="imgList" :current-index="0" crossorigin="anonymous" @close="onClose" />
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
}
</style>
