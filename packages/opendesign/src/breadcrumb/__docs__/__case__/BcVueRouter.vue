<docs lang="md">
<!-- zh-CN -->

### 配合 Vue Router 使用

当给 `OBreadcrumbItem` 组件传入 `to` 属性时，它会使用`RouterLink`组件渲染。这样可以实现与 Vue Router 的集成，支持 SPA 应用跳转。

传入 `to` 属性时，`OBreadcrumbItem` 还可以使用 `replace` 属性来控制路由跳转时是否覆盖浏览器历史记录（`replace` 的值会直接传给 `RouterLink` 组件）。

需要注意在使用 `OBreadcrumbItem` 时已正确配置 Vue Router。

```js
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';

const router = createRouter({
  /** 省略 */
});
const app = createApp(/** 省略 */);
app.use(router); // 此处确保 OBreadcrumbItem 能正确解析RouterLink组件
```

<!-- en-US -->

### Using with Vue Router

When the `to` property is passed to the `OBreadcrumbItem` component, it will render using the `RouterLink` component. This allows integration with Vue Router, supporting SPA application navigation.

When the `to` property is passed, the `OBreadcrumbItem` can also use the `replace` property to control whether the browser history is replaced during routing (the value of `replace` will be directly passed to the `RouterLink` component).

It is important to ensure that Vue Router is correctly configured when using `OBreadcrumbItem`.

```js
import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';

const router = createRouter({
  /** omitted */
});
const app = createApp(/** omitted */);
app.use(router); // Ensure that OBreadcrumbItem can correctly parse the RouterLink component here
```
</docs>

<script setup lang="ts">
import { OBreadcrumb, OBreadcrumbItem } from '@opensig/opendesign';
</script>

<template>
  <OBreadcrumb>
    <OBreadcrumbItem to="/">Home</OBreadcrumbItem>
    <OBreadcrumbItem>Current Page</OBreadcrumbItem>
  </OBreadcrumb>
</template>
