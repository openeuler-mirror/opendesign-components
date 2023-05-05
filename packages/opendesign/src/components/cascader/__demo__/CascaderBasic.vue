<script setup lang="ts">
import { ref } from 'vue';
import { OCascader } from '../index';

const cascaderVal1 = ref('1-1-1');

const option1 = [
  {
    label: '选项一',
    value: '1',
    children: [
      {
        label: '子选项1-1',
        value: '1-1',
        children: [
          {
            label: '子选项1-1-1',
            value: '1-1-1',
          },
          {
            label: '子选项1-1-2',
            value: '1-1-2',
          },
          {
            label: '子选项1-1-3',
            value: '1-1-3',
          },
        ],
      },
      {
        label: '子选项1-2',
        value: '1-2',
      },
      {
        label: '子选项1-3',
        value: '1-3',
      },
    ],
  },
  {
    label: '选项二',
    value: '2',
    children: [
      {
        label: '子选项2.1',
        value: '2.1',
      },
      {
        label: '子选项2.2',
        value: '2.2',
      },
    ],
  },
];

const handleChange1 = (val: string | number | Array<string | number>) => {
  console.log(val);
};

const cascaderVal2 = ref('1-1-1');
const option2 = [
  {
    label: '选项一',
    value: '1',
    children: [
      {
        label: '子选项1-1',
        value: '1-1',
        children: [
          {
            label: '子选项1-1-1',
            value: '1-1-1',
          },
          {
            label: '子选项1-1-2',
            value: '1-1-2',
          },
          {
            label: '子选项1-1-3',
            value: '1-1-3',
          },
        ],
      },
      {
        label: '子选项1-2',
        value: '1-2',
      },
      {
        label: '子选项1-3',
        value: '1-3',
      },
    ],
  },
  {
    label: '选项二',
    value: '2',
    children: [
      {
        label: '子选项2.1',
        value: '2.1',
      },
      {
        label: '子选项2.2',
        value: '2.2',
      },
    ],
  },
];
const handleChange2 = (val: string | number | Array<string | number>) => {
  console.log(val);
};
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OCascader v-model="cascaderVal1" :options="option1" @change="handleChange1" />
    <OCascader v-model="cascaderVal2" :options="option2" path-mode @change="handleChange2" />
  </section>
</template>
