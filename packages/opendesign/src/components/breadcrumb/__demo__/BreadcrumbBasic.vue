<script setup lang="ts">
import { OBreadcrumb, OBreadcrumbItem } from '../index';

const handleClick = () => {
  console.log(1);
};
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OBreadcrumb>
      <OBreadcrumbItem :to="{ name: 'Home' }" @click="handleClick">首页</OBreadcrumbItem>
      <OBreadcrumbItem href="http://devin-cwd.gitee.io/design-token-editor/#/token-color" target="_blank" @click="handleClick">Token</OBreadcrumbItem>
      <OBreadcrumbItem @click="handleClick">面包屑</OBreadcrumbItem>
    </OBreadcrumb>
  </section>
</template>
