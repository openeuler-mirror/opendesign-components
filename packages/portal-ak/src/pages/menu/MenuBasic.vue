<script setup lang="ts">
import { ref } from 'vue';
import OIconMore from './OIconMore.vue';
import { OMenu, OSubMenu, OMenuItem } from '@components/index';

const handleChange = (val: string) => {
  console.log(val);
};
const handleExpandedChange = (val: Array<string>) => {
  console.log(val);
};

const activeVal1 = ref('1-1');

const expandedArr2 = ref(['1']);
const activeVal2 = ref('1-1');

const expandedArr3 = ref(['1']);
const activeVal3 = ref('1-1');
</script>

<template>
  <h3>基础菜单</h3>
  <section>
    <OMenu v-model="activeVal1" :style="{ width: '200px' }" @change="handleChange">
      <OMenuItem value="1-1">
        <template #icon><OIconMore /></template>
        菜单1-1
      </OMenuItem>
      <OMenuItem value="1-2">
        <template #icon><OIconMore /></template>
        菜单1-2
      </OMenuItem>
      <OMenuItem value="1-3">
        <template #icon><OIconMore /></template>
        菜单1-3
      </OMenuItem>
      <OMenuItem value="1-4">
        <template #icon><OIconMore /></template>
        菜单1-4
      </OMenuItem>
      <OMenuItem value="1-5">
        <template #icon><OIconMore /></template>
        菜单1-5
      </OMenuItem>
      <OMenuItem value="1-6">
        <template #icon><OIconMore /></template>
        菜单1-6
      </OMenuItem>
      <OMenuItem value="1-7">
        <template #icon><OIconMore /></template>
        菜单1-7
      </OMenuItem>
      <OMenuItem value="1-8">
        <template #icon><OIconMore /></template>
        菜单1-8
      </OMenuItem>
    </OMenu>
  </section>
  <h3>手风琴菜单</h3>
  <section>
    <div>
      <h4>带图标：</h4>
      <hr />
      <OMenu v-model="activeVal2" v-model:expanded="expandedArr2" accordion @change="handleChange" @expanded-change="handleExpandedChange">
        <OSubMenu value="1">
          <template #title>一级菜单1一级菜单1一级菜单1</template>
          <template #icon><OIconMore /></template>
          <OMenuItem value="1-1">二级菜单1-1</OMenuItem>
          <OMenuItem value="1-2" disabled>二级菜单1-2</OMenuItem>
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
          <OMenuItem value="3-2">二级菜单3-2</OMenuItem>
          <OMenuItem value="3-3">二级菜单3-3</OMenuItem>
          <OMenuItem value="3-4">二级菜单3-4</OMenuItem>
          <OMenuItem value="3-5">二级菜单3-5</OMenuItem>
        </OSubMenu>
      </OMenu>
    </div>

    <div :style="{ marginLeft: '100px' }">
      <h4>不带图标，父节点可选中：</h4>
      <hr />
      <OMenu v-model="activeVal3" v-model:expanded="expandedArr3" accordion :level-indent="12" @change="handleChange" @expanded-change="handleExpandedChange">
        <OSubMenu value="1" selectable>
          <template #title>一级菜单1一级菜单1一级菜单1</template>
          <OMenuItem value="1-1">二级菜单1-1</OMenuItem>
          <OMenuItem value="1-2" disabled>二级菜单1-2</OMenuItem>
          <OMenuItem value="1-3">二级菜单1-3</OMenuItem>
          <OMenuItem value="1-4">二级菜单1-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="2" selectable>
          <template #title>一级菜单2</template>
          <OMenuItem value="2-1">二级菜单2-1</OMenuItem>
          <OMenuItem value="2-2">二级菜单2-2</OMenuItem>
          <OMenuItem value="2-3">二级菜单2-3</OMenuItem>
          <OMenuItem value="2-4">二级菜单2-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="3" selectable>
          <template #title>一级菜单3</template>
          <OMenuItem value="3-2">二级菜单3-2</OMenuItem>
          <OMenuItem value="3-3">二级菜单3-3</OMenuItem>
          <OMenuItem value="3-4">二级菜单3-4</OMenuItem>
          <OMenuItem value="3-5">二级菜单3-5</OMenuItem>
        </OSubMenu>
      </OMenu>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  align-items: flex-start;
}
</style>
