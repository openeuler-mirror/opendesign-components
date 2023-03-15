<script setup lang="ts">
import { reactive } from 'vue';
import { IconAdd } from '../../icons';
import { OButton } from '../index';
const rlt = reactive({
  loading1: false,
  loading2: false,
  loading3: true,
});
const showLoading = (key: 'loading1' | 'loading2' | 'loading3', val: boolean) => {
  rlt[key] = val;
  setTimeout(() => {
    rlt[key] = !val;
  }, 1000);
};
</script>
<template>
  <h4>Loading</h4>
  <section>
    <OButton color="primary" :loading="rlt.loading1" @click="showLoading('loading1', true)">Primary Button</OButton>
    <OButton variant="outline" :loading="rlt.loading2" @click="showLoading('loading2', true)">
      <template #icon><IconAdd /></template>Outline Button
    </OButton>
    <OButton variant="text" :loading="rlt.loading3" @click="showLoading('loading3', true)">Text Button</OButton>
    <OButton :loading="!rlt.loading3" href="https://hiascend.com" target="__blank">Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
