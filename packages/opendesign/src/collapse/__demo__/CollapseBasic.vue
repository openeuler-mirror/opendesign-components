<script setup lang="ts">
import { ref } from 'vue';
import { OCollapse, OCollapseItem } from '../index';
const val = ref<(string | number)[]>([1, 2]);
window.setTimeout(() => {
  val.value = [2];
}, 3000);

const update = (value: (string | number)[]) => {
  console.log('update', value);
  val.value = value;
};
const update2 = (value: (string | number)[]) => {
  console.log('update', value);
  if (value.length === 0) {
    return;
  }
  val.value = value;
};
const onchange = (value: (string | number)[]) => {
  console.log('change', value);
};
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OCollapse :model-value="val" @update:modelValue="update" @change="onchange" accordion>
      <OCollapseItem title="这是标题1" :value="1">
        <div class="content1"></div>
      </OCollapseItem>
      <OCollapseItem title="2" :value="2">
        <div class="content1"></div>
      </OCollapseItem>
    </OCollapse>
  </section>
  <h4>受控用法</h4>
  <section>
    <OCollapse :model-value="val" @update:modelValue="update2" @change="onchange">
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
