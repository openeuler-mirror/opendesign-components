<script setup lang="ts">
import { OMenu } from '../index';
import OIconMore from './OIconMore.vue';
import RecursiveSubMenu from './RecursiveSubMenu.vue';
import { ref } from 'vue';

const getData = (withIcon = true) => {
  const icon = withIcon ? OIconMore : undefined;
  return [
    {
      label: '1-1',
      icon,
      children: [
        {
          label: '1-1-1',
          children: [
            { label: '1-1-1-1' },
            { label: '1-1-1-2', icon },
            { label: '1-1-1-3' }
          ]
        },
        {
          label: '1-1-2',
          children: [
            { label: '1-1-2-1' },
            { label: '1-1-2-2' },
            { label: '1-1-2-3' }
          ]
        },
        {
          label: '1-1-3',
          children: [
            { label: '1-1-3-1' },
            { label: '1-1-3-2' },
            { label: '1-1-3-3' },
            { label: '1-1-3-4' }
          ]
        },
        {
          label: '1-1-4',
          children: [
            { label: '1-1-4-1' },
            { label: '1-1-4-2' },
            { label: '1-1-4-3' },
            { label: '1-1-4-4' }
          ]
        }
      ]
    },
    {
      label: '1-2',
      icon,
      children: [
        {
          label: '1-2-1',
          children: [
            { label: '1-2-1-1' },
            { label: '1-2-1-2' },
            { label: '1-2-1-3' }
          ]
        },
        {
          label: '1-2-2',
          children: [
            { label: '1-2-2-1' },
            { label: '1-2-2-2' },
            { label: '1-2-2-3' }
          ]
        },
        {
          label: '1-2-3',
          children: [
            { label: '1-2-3-1' },
            { label: '1-2-3-2' },
            { label: '1-2-3-3' },
            { label: '1-2-3-4' }
          ]
        },
        {
          label: '1-2-4',
          children: [
            { label: '1-2-4-1' },
            { label: '1-2-4-2' },
            { label: '1-2-4-3' }
          ]
        }
      ]
    },
    {
      label: '1-3',
      children: [
        {
          label: '1-3-1',
          children: [
            { label: '1-3-1-1' },
            { label: '1-3-1-2' },
            { label: '1-3-1-3' },
            { label: '1-3-1-4' }
          ]
        },
        {
          label: '1-3-2',
          children: [
            { label: '1-3-2-1' },
            { label: '1-3-2-2' },
            { label: '1-3-2-3' }
          ]
        },
        {
          label: '1-3-3',
          children: [
            { label: '1-3-3-1' },
            { label: '1-3-3-2' },
            { label: '1-3-3-3' },
            { label: '1-3-3-4' }
          ]
        },
        {
          label: '1-3-4',
          children: [
            { label: '1-3-4-1' },
            { label: '1-3-4-2' },
            { label: '1-3-4-3' },
            { label: '1-3-4-4' }
          ]
        }
      ]
    },
    {
      label: '1-4',
    }
  ];
};

const activeVal = ref('1-1-1-1');
const expandedArr = ref(['1-1', '1-1-1']);
</script>

<template>
  <h4>是否有icon & size</h4>
  <section>
    <div>
      <h5>有icon & medium</h5>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" size="medium">
        <RecursiveSubMenu v-for="item in getData()" :key="item.label" :data="item"/>
      </OMenu>
    </div>
    <div>
      <h5>有icon & small</h5>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" size="small">
        <RecursiveSubMenu v-for="item in getData()" :key="item.label" :data="item"/>
      </OMenu>
    </div>
    <div>
      <h5>无icon & medium</h5>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" size="medium">
        <RecursiveSubMenu v-for="item in getData(false)" :key="item.label" :data="item"/>
      </OMenu>
    </div>
    <div>
      <h5>无icon & small</h5>
      <OMenu v-model="activeVal" v-model:expanded="expandedArr" size="small">
        <RecursiveSubMenu v-for="item in getData(false)" :key="item.label" :data="item"/>
      </OMenu>
    </div>
  </section>
</template>

<style scoped lang="scss">

section {
  display: flex;
  align-items: stretch;
  gap: 120px;

  >div {
    margin: var(--o-gap-3);
    border: 1px solid var(--o-color-control1-light);
  }
}
</style>