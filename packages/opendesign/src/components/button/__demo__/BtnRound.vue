<script setup lang="ts">
import { OButton } from '../index';
import { IconAdd } from '../../icons';
import { ref } from 'vue';

const r = ref(12);
const onClick = () => {
  if (r.value <= 0) {
    r.value += 16;
  } else {
    r.value -= 2;
  }
};
</script>
<template>
  <h4>Shape</h4>
  <section>
    <div>
      <p>round="pill"</p>
      <section>
        <OButton type="primary" size="large" round="pill">
          <template #icon><IconAdd /></template>
        </OButton>
        <OButton type="outline" round="pill">
          <template #icon><IconAdd /></template>
        </OButton>
        <OButton type="outline" size="small" round="pill">
          <template #icon><IconAdd /></template>
        </OButton>

        <OButton type="primary" size="large" round="pill">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" round="pill">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" size="small" round="pill">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
    <div>
      <p>round="{{ r }}"</p>
      <section>
        <OButton type="primary" size="large" :round="r + 'px'" @click="onClick">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" :round="r + 'px'">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
        <OButton type="outline" size="small" :round="r + 'px'">
          <template #icon><IconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
  </section>
</template>
<style lang="scss"></style>
