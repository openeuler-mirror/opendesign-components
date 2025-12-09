<script setup lang="ts">
import { ref } from 'vue';
import OIconMore from './OIconMore.vue';
import { OMenu, OSubMenu, OMenuItem } from '../index';

const expandedArr = ref(['1']);
const activeVal = ref('1-1');

const handleChange = (val: string) => {
  console.log(val);
};
const handleExpandedChange = (val: Array<string>) => {
  console.log(val);
};

const activeVal2 = ref('1-1');
</script>

<template>
  <h4>基础用法</h4>
  <h5>多级菜单</h5>
  <section>
    <div>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" @change="handleChange" @expanded-change="handleExpandedChange" arrow-position="left">
        <OSubMenu value="1">
          <template #title>一级菜单1一级菜单1一级菜单1一级菜单1一级菜单1</template>
          <OMenuItem value="1-1">二级菜单1-1</OMenuItem>
          <OMenuItem value="1-2" disabled>二级菜单1-2</OMenuItem>
          <OMenuItem value="1-3">二级菜单1-3</OMenuItem>
          <OMenuItem value="1-4">二级菜单1-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="2">
          <template #title>一级菜单2</template>
          <OMenuItem value="2-1">二级菜单2-1</OMenuItem>
          <OMenuItem value="2-2">二级菜单2-2</OMenuItem>
          <OMenuItem value="2-3">二级菜单2-3</OMenuItem>
          <OMenuItem value="2-4">二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="3">
          <template #title>菜单3</template>
          <OSubMenu value="3-1">
            <template #title>菜单3-1</template>
            <OSubMenu value="3-1-1">
              <template #title>菜单3-1-1</template>
              <OMenuItem value="3-1-1-1">菜单3-1-1-1</OMenuItem>
              <OMenuItem value="3-1-1-2">菜单3-1-1-2</OMenuItem>
              <OMenuItem value="3-1-1-3">菜单3-1-1-3</OMenuItem>
              <OMenuItem value="3-1-1-4">菜单3-1-1-4</OMenuItem>
            </OSubMenu>
            <OMenuItem value="3-1-2">菜单3-1-2</OMenuItem>
            <OMenuItem value="3-1-3">菜单3-1-3</OMenuItem>
            <OSubMenu value="3-1-4">
              <template #title>菜单3-1-4</template>
              <OMenuItem value="3-1-4-1">菜单3-1-4-1</OMenuItem>
              <OMenuItem value="3-1-4-2">菜单3-1-4-2</OMenuItem>
              <OMenuItem value="3-1-4-3">菜单3-1-4-3</OMenuItem>
              <OMenuItem value="3-1-4-4">菜单3-1-4-4</OMenuItem>
            </OSubMenu>
            <OMenuItem value="3-1-5">菜单3-1-5</OMenuItem>
            <OMenuItem value="3-1-6">菜单3-1-6</OMenuItem>
          </OSubMenu>
          <OMenuItem value="3-2">菜单3-2</OMenuItem>
          <OMenuItem value="3-3">菜单3-3</OMenuItem>
          <OMenuItem value="3-4">菜单3-4</OMenuItem>
          <OMenuItem value="3-5">菜单3-5</OMenuItem>
        </OSubMenu>
      </OMenu>
    </div>
    <div>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" @change="handleChange" @expanded-change="handleExpandedChange" arrow-position="right">
        <OSubMenu value="1">
          <template #title>一级菜单1一级菜单1一级菜单1一级菜单1一级菜单1</template>
          <template #icon><OIconMore /></template>
          <OMenuItem value="1-1" :icon="OIconMore">二级菜单1-1</OMenuItem>
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
          <OMenuItem value="2-4">二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4</OMenuItem>
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
          <OMenuItem value="3-2" :icon="OIconMore">二级菜单3-2</OMenuItem>
          <OMenuItem value="3-3" :icon="OIconMore">二级菜单3-3</OMenuItem>
          <OMenuItem value="3-4" :icon="OIconMore">二级菜单3-4</OMenuItem>
          <OMenuItem value="3-5" :icon="OIconMore">二级菜单3-5</OMenuItem>
        </OSubMenu>
          <OMenuItem value="3-5" :icon="OIconMore">二级菜单3-5</OMenuItem>
      </OMenu>
    </div>
    <div>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" @change="handleChange" @expanded-change="handleExpandedChange" arrow-position="left" size="small">
        <OSubMenu value="1">
          <template #title>一级菜单1一级菜单1一级菜单1一级菜单1一级菜单1</template>
          <!-- <template #icon><OIconMore /></template> -->
          <OMenuItem value="1-1">二级菜单1-1</OMenuItem>
          <OMenuItem value="1-2" disabled>二级菜单1-2</OMenuItem>
          <OMenuItem value="1-3">二级菜单1-3</OMenuItem>
          <OMenuItem value="1-4">二级菜单1-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="2">
          <template #title>一级菜单2</template>
          <OMenuItem value="2-1">二级菜单2-1</OMenuItem>
          <OMenuItem value="2-2">二级菜单2-2</OMenuItem>
          <OMenuItem value="2-3">二级菜单2-3</OMenuItem>
          <OMenuItem value="2-4">二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="3">
          <template #title>一级菜单3</template>
          <!-- <template #icon><OIconMore /></template> -->
          <OSubMenu value="3-1">
            <template #title>二级菜单3-1</template>
            <!-- <template #icon><OIconMore /></template> -->
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
    </div>
    <div>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" @change="handleChange" @expanded-change="handleExpandedChange" arrow-position="right" size="small">
        <OSubMenu value="1">
          <template #title>一级菜单1一级菜单1一级菜单1一级菜单1一级菜单1</template>
          <!-- <template #icon><OIconMore /></template> -->
          <OMenuItem value="1-1">二级菜单1-1</OMenuItem>
          <OMenuItem value="1-2" disabled>二级菜单1-2</OMenuItem>
          <OMenuItem value="1-3">二级菜单1-3</OMenuItem>
          <OMenuItem value="1-4">二级菜单1-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="2">
          <template #title>一级菜单2</template>
          <OMenuItem value="2-1">二级菜单2-1</OMenuItem>
          <OMenuItem value="2-2">二级菜单2-2</OMenuItem>
          <OMenuItem value="2-3">二级菜单2-3</OMenuItem>
          <OMenuItem value="2-4">二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4二级菜单2-4</OMenuItem>
        </OSubMenu>
        <OSubMenu value="3">
          <template #title>一级菜单3</template>
          <template #icon><OIconMore /></template>
          <OSubMenu value="3-1">
            <template #title>二级菜单3-1</template>
            <template #icon><OIconMore /></template>
            <OMenuItem value="3-1-1" :icon="OIconMore">三级菜单3-1-1</OMenuItem>
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
    </div>
  </section>
  <h5>一级菜单</h5>
  <section>
  <div>
      <OMenu v-model="activeVal2" @change="handleChange">
        <OMenuItem value="2-1" :icon="OIconMore">菜单2-1</OMenuItem>
        <OMenuItem value="2-2" :icon="OIconMore">菜单2-2</OMenuItem>
        <OMenuItem value="2-3" :icon="OIconMore">菜单2-3</OMenuItem>
        <OMenuItem value="2-4" :icon="OIconMore">菜单2-4</OMenuItem>
        <OMenuItem value="3-2" :icon="OIconMore">菜单3-2</OMenuItem>
        <OMenuItem value="3-3" :icon="OIconMore">菜单3-3</OMenuItem>
        <OMenuItem value="3-4" :icon="OIconMore">菜单3-4</OMenuItem>
        <OMenuItem value="3-5" :icon="OIconMore">菜单3-5</OMenuItem>
      </OMenu>
    </div>
    <div>
      <OMenu v-model="activeVal2" @change="handleChange"  size="small">
        <OMenuItem value="2-1" :icon="OIconMore">菜单2-1</OMenuItem>
        <OMenuItem value="2-2" :icon="OIconMore">菜单2-2</OMenuItem>
        <OMenuItem value="2-3" :icon="OIconMore">菜单2-3</OMenuItem>
        <OMenuItem value="2-4" :icon="OIconMore">菜单2-4</OMenuItem>
        <OMenuItem value="3-2" :icon="OIconMore">菜单3-2</OMenuItem>
        <OMenuItem value="3-3" :icon="OIconMore">菜单3-3</OMenuItem>
        <OMenuItem value="3-4" :icon="OIconMore">菜单3-4</OMenuItem>
        <OMenuItem value="3-5" :icon="OIconMore">菜单3-5</OMenuItem>
      </OMenu>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  align-items: flex-start;
}
</style>
