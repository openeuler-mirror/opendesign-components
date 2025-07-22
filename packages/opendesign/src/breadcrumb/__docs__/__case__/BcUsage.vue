<docs lang="md">
<!-- zh-CN -->

### 基础用法

通过 `href` 属性设置链接跳转地址，或者使用 `to` 属性配合 Vue Router 实现路由跳转。当 `href` 和 `to` 属性都未设置时，`OBreadcrumbItem` 组件会使用 `span` 标签渲染为一个普通的文本（这对于 SEO 是有好处的）。

<!-- en-US -->

### Basic Usage

Set the link jump address using the `href` property, or use the `to` property in conjunction with Vue Router to achieve routing. When neither the `href` nor the `to` property is set, the `OBreadcrumbItem` component will render as a plain text using a `span` tag (which is beneficial for SEO).
</docs>

<script setup lang="ts">
import { OBreadcrumb, OBreadcrumbItem } from '@opensig/opendesign';
</script>

<template>
  <OBreadcrumb>
    <OBreadcrumbItem href="/">Home</OBreadcrumbItem>
    <OBreadcrumbItem>Current Page</OBreadcrumbItem>
  </OBreadcrumb>
</template>
