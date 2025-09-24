<script setup lang="ts">
import { ref } from 'vue';
import { OCascader } from '../index';
import { getCascaderData } from './getCascaderData';

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

const cascaderVal2 = ref(['1', '1-1', '1-1-1', '1-1-1-1', '1-1-1-1-1']);
// 测试随机的大数据
const option2 = getCascaderData(5, 0, 10);
const handleChange2 = (val: string | number | Array<string | number>) => {
  console.log(val);
};
const errorValue1 = ref('abc')
const errorValue2 = ref(['1', 'abc'])
</script>

<template>
  <h4>基础用法</h4>
  <div>{{ cascaderVal1 }}</div>
  <div>{{ cascaderVal2 }}</div>
  <section>
    <OCascader v-model="cascaderVal1" :options="option1" @change="handleChange1" />
    <OCascader v-model="cascaderVal2" :options="option2" path-mode @change="handleChange2" />
  </section>

  <h4>trigger: hover, expandTrigger: hover</h4>
  <OCascader v-model="cascaderVal1" :options="option1" trigger="hover" expand-trigger="hover" class="wide" @change="handleChange1" />
  <h4>expandTrigger: hover</h4>
  <OCascader v-model="cascaderVal2" :options="option2" expand-trigger="hover" path-mode class="wide" @change="handleChange2" />
  <h4>异常数据测试</h4>
  <section>
    <OCascader v-model="errorValue1" :options="option1" @change="handleChange1" />
    <OCascader v-model="errorValue2" :options="option2" path-mode @change="handleChange2" />
    <OCascader v-model="errorValue2" :options="[]" @change="handleChange1" />
  </section>
</template>
<style scoped lang="scss">
.wide {
  width: 100%;
}
</style>
