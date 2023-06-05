<script setup lang="ts">
import { OBreadcrumb, OBreadcrumbItem } from '@components/index';

const handleClick = () => {
  console.log(1);
};
</script>

<template>
  <h3>基础用法</h3>
  <section>
    <OBreadcrumb>
      <OBreadcrumbItem :to="{ name: 'Home' }" @click="handleClick">首页</OBreadcrumbItem>
      <OBreadcrumbItem href="http://devin-cwd.gitee.io/design-token-editor/#/token-color" target="_blank" @click="handleClick">
        Token，页面文本宽度最大140
      </OBreadcrumbItem>
      <OBreadcrumbItem @click="handleClick">面包屑，当前页面文本显示完整</OBreadcrumbItem>
    </OBreadcrumb>
  </section>

  <h3>折叠态待补充</h3>
</template>
