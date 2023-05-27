<script setup lang="ts">
import { OSelect, SelectOptionT } from '../index';
import { OOption } from '../../option';
import { ref } from 'vue';
const options = [
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' },
  { label: '选项 4', value: '4' },
  { label: '选项 5', value: '5' },
  { label: '选项 6', value: '6' },
  { label: '选项 7', value: '7' },
  { label: '选项 8', value: '8' },
  { label: '选项 9', value: '9' },
];
const val = ref(['1', '3']);
const val2 = ref('1');
</script>
<template>
  <h3>多选</h3>
  <section>
    <OSelect v-model="val" placeholder="多选" style="width: 240px" multiple>
      <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </OSelect>
    <OSelect v-model="val" placeholder="多选" style="width: 240px" multiple size="large">
      <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </OSelect>
    <OSelect v-model="val" placeholder="多选" style="width: 240px" multiple size="small">
      <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </OSelect>
    <OSelect v-model="val2" placeholder="多选" style="width: 240px">
      <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </OSelect>
  </section>
</template>
<style lang="scss" scoped>
.select-add {
  border-top: 1px solid var(--o-color-control1);
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: var(--o-color-link1);
  }
}
</style>
