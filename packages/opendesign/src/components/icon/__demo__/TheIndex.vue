<script setup lang="ts">
import { OIcon } from '../index';
import * as OIcons from '../../icon-components';
import '../style';
import { shallowRef } from 'vue';
console.log(OIcons);

const stokes = shallowRef<any[]>([]);
const fills = shallowRef<any[]>([]);
const colors = shallowRef<any[]>([]);
Object.keys(OIcons).forEach((k) => {
  const c = OIcons[k as keyof typeof OIcons];
  if (c.svgType === 'stroke') {
    stokes.value.push(c);
  } else if (c.svgType === 'fill') {
    fills.value.push(c);
  } else {
    colors.value.push(c);
  }
});
</script>
<template>
  <div class="page-demo">
    <h4>Stoke</h4>
    <div class="icon-list">
      <div v-for="icon in stokes" :key="icon" class="icon-item">
        <OIcon
          :icon="icon"
          :class="{
            'o-rotating': icon.name === 'OIconLoading',
          }"
        />
        <div class="icon-name">{{ icon.name }}</div>
      </div>
    </div>

    <h4>Fill</h4>
    <div class="icon-list">
      <div v-for="icon in fills" :key="icon" class="icon-item">
        <OIcon
          :icon="icon"
          :class="{
            'o-rotating': icon.name === 'OIconLoading',
          }"
        />
        <div class="icon-name">{{ icon.name }}</div>
      </div>
    </div>

    <h4>Color</h4>
    <div class="icon-list">
      <div v-for="icon in colors" :key="icon" class="icon-item">
        <OIcon
          :icon="icon"
          :class="{
            'o-rotating': icon.name === 'OIconLoading',
          }"
        />
        <div class="icon-name">{{ icon.name }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.icon-list {
  display: flex;
  flex-wrap: wrap;
}
.icon-item {
  color: #000;
  font-size: 32px;
  width: 140px;
  border: 1px solid #ccc;
  text-align: center;
  margin: 4px;
  padding: 8px;
  > svg {
    margin: 16px;
    stroke-width: 1px;
  }
}
.icon-name {
  font-size: 14px;
  word-wrap: break-word;
}
</style>
