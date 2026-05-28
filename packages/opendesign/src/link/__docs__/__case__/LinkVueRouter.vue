<docs lang="md">
  <!-- zh-CN -->

### 配合 Vue Router 使用

当给 `OLink` 组件传入 `to` 属性时，它会使用`RouterLink`组件渲染。这样可以实现与 Vue Router 的集成，支持 SPA 应用跳转。

传入 `to` 属性时，`OLink` 还可以使用 `replace` 属性来控制路由跳转时是否覆盖浏览器历史记录（`replace` 的值会直接传给 `RouterLink` 组件）。

需要注意在使用 `OLink` 时已正确配置 Vue Router。

```js
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';

const router = createRouter({
  /** 省略 */
});
const app = createApp(/** 省略 */);
app.use(router); // 此处确保 OLink 能正确解析RouterLink组件
```

  <!-- en-US -->

### Using with Vue Router

When the `to` property is passed to the `OLink` component, it will render using the `RouterLink` component. This allows integration with Vue Router, supporting SPA application navigation.

When the `to` property is passed, the `OLink` can also use the `replace` property to control whether the browser history is replaced during routing (the value of `replace` will be directly passed to the `RouterLink` component).

It is important to ensure that Vue Router is correctly configured when using `OLink`.

```js
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';

const router = createRouter({
  /** omitted */
});
const app = createApp(/** omitted */);
app.use(router); // Ensure that OLink can correctly parse the RouterLink component here
```
</docs>

<script setup lang="ts">
import { OLink } from '@opensig/opendesign';
</script>

<template>
  <OLink color="primary" to="/">查看更多</OLink>
</template>
