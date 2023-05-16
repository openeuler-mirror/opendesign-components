<script setup lang="ts">
import { ref } from 'vue';
import { OIconMore } from '../../icon-svgs';
import { OMenu, OSubMenu, OMenuItem } from '../index';

const expandedArr = ref(['2']);
const activeVal = ref('2-1');
</script>

<template>
  <h4>手风琴模式：同级别展开互斥</h4>
  <section>
    <OMenu v-model="activeVal" v-model:expanded="expandedArr" accordion>
      <OSubMenu value="1">
        <template #title>一级菜单1</template>
        <template #icon><OIconMore /></template>
        <OMenuItem value="1-1">二级菜单1-1</OMenuItem>
        <OMenuItem value="1-2">二级菜单1-2</OMenuItem>
        <OMenuItem value="1-3">二级菜单1-3</OMenuItem>
        <OMenuItem value="1-4">二级菜单1-4</OMenuItem>
      </OSubMenu>
      <OSubMenu value="2">
        <template #title>一级菜单2</template>
        <template #icon><OIconMore /></template>
        <OMenuItem value="2-1">二级菜单2-1</OMenuItem>
        <OMenuItem value="2-2">二级菜单2-2</OMenuItem>
        <OMenuItem value="2-3">二级菜单2-3</OMenuItem>
        <OMenuItem value="2-4">二级菜单2-4</OMenuItem>
      </OSubMenu>
      <OSubMenu value="3">
        <template #title>一级菜单3</template>
        <template #icon><OIconMore /></template>
        <OSubMenu value="3-1">
          <template #title>二级菜单3-1</template>
          <template #icon><OIconMore /></template>
          <OMenuItem value="3-1-1">三级菜单3-1-1</OMenuItem>
          <OMenuItem value="3-1-2">三级菜单3-1-2</OMenuItem>
          <OMenuItem value="3-1-3">三级菜单3-1-3</OMenuItem>
          <OMenuItem value="3-1-4">三级菜单3-1-4</OMenuItem>
        </OSubMenu>
        <OMenuItem value="3-2">二级菜单3-2</OMenuItem>
        <OMenuItem value="3-3">二级菜单3-3</OMenuItem>
        <OMenuItem value="3-4">二级菜单3-4</OMenuItem>
        <OMenuItem value="3-5">二级菜单3-5</OMenuItem>
      </OSubMenu>
    </OMenu>
  </section>
</template>
