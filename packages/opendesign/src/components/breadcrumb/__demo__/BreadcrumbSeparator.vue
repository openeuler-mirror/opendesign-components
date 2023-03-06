<script setup lang="ts">
import { IconAdd } from '../../icons';
import { OBreadcrumb, OBreadcrumbItem } from '../index';

const handleClick = () => {
  console.log('click!!!');
};
</script>

<template>
  <h4>自定义分隔符</h4>
  <section>
    <OBreadcrumb separator="/">
      <OBreadcrumbItem :to="{ name: 'Home' }" @click="handleClick">首页</OBreadcrumbItem>
      <OBreadcrumbItem href="http://devin-cwd.gitee.io/design-token-editor/#/token-color" target="_blank" @click="handleClick">Token</OBreadcrumbItem>
      <OBreadcrumbItem @click="handleClick">面包屑</OBreadcrumbItem>
    </OBreadcrumb>

    <OBreadcrumb separator="=">
      <OBreadcrumbItem :to="{ name: 'Home' }" @click="handleClick">
        首页
        <template #separator>
          <IconAdd />
        </template>
      </OBreadcrumbItem>
      <OBreadcrumbItem href="http://devin-cwd.gitee.io/design-token-editor/#/token-color" target="_blank" @click="handleClick">
        Token
        <template #separator>
          <IconAdd />
        </template>
      </OBreadcrumbItem>
      <OBreadcrumbItem @click="handleClick">
        面包屑
        <template #separator>
          <IconAdd />
        </template>
      </OBreadcrumbItem>
    </OBreadcrumb>
  </section>
</template>

<style scoped>
section {
  flex-direction: column;
  align-items: flex-start;
}
</style>
