<script setup lang="ts">
import { ref } from 'vue';
import { OCollapse, OCollapseItem } from '../index';
const val = ref([1]);
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OCollapse v-model="val">
      <OCollapseItem title="这是标题1" :value="1">
        <div class="content1"></div>
      </OCollapseItem>
      <OCollapseItem title="2" :value="2">
        <div class="content1"></div>
      </OCollapseItem>
    </OCollapse>
  </section>
</template>

<style lang="scss" scoped>
section {
  display: block;
}

.content1 {
  height: 200px;
  background-color: peachpuff;
}
</style>
