<script setup lang="ts">
import { ref } from 'vue';
import { OSelect } from '../index';
import { OOption, OOptionGroup } from '../../option';

const selectVal1 = ref('opt4');
const options = [
  {
    groupName: 'group1',
    list: [
      { label: 'option 1', value: 'opt1' },
      { label: 'option 2', value: 'opt2' },
      { label: 'option 3', value: 'opt3' },
      { label: 'option 4', value: 'opt4' },
    ],
  },
  {
    groupName: 'group2',
    list: [
      { label: 'option 5', value: 'opt5' },
      { label: 'option 6', value: 'opt6' },
    ],
  },
  {
    groupName: 'group3',
    list: [
      { label: 'option 7', value: 'opt7' },
      { label: 'option 8', value: 'opt8' },
      { label: 'option 9', value: 'opt9' },
    ],
  },
];
</script>
<template>
  <h4>Select Group</h4>
  <section>
    <OSelect v-model="selectVal1" placeholder="select..." clearable>
      <OOptionGroup v-for="gp in options" :key="gp.groupName" :name="gp.groupName">
        <OOption v-for="item in gp.list" :key="item.value" :label="item.label" :value="item.value" />
      </OOptionGroup>
    </OSelect>
  </section>
</template>
<style lang="scss"></style>
