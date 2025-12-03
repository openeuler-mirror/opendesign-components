<script setup lang="ts">
import { MockTreeItem } from './utils.ts';
import {  OMenuItem, OSubMenu } from '../index';

const props = defineProps<{
  data: MockTreeItem
}>();

</script>

<template>
  <OSubMenu v-if="props.data.children?.length"  :value="props.data.label" >
    <template #title>{{props.data.label}}</template>
    <template #icon v-if="props.data.icon">
      <component :is="props.data.icon"/>
    </template>
    <RecursiveSubMenu v-for="item in props.data.children" :key="item.label" :data="item"/>
  </OSubMenu>
  <OMenuItem v-else :value="props.data.label">
    <template #icon v-if="props.data.icon">
      <component :is="props.data.icon"/>
    </template>
    {{props.data.label}}
  </OMenuItem>
</template>

<style scoped lang="scss">

</style>