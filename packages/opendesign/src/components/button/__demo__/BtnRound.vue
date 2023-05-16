<script setup lang="ts">
import { OButton } from '../index';
import { OIconAdd } from '../../icon-svgs';
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
        <OButton variant="solid" size="large" round="pill">
          <template #icon><OIconAdd /></template>
        </OButton>
        <OButton variant="outline" round="pill">
          <template #icon><OIconAdd /></template>
        </OButton>
        <OButton variant="text" size="small" round="pill">
          <template #icon><OIconAdd /></template>
        </OButton>

        <OButton variant="solid" size="large" round="pill">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
        <OButton variant="outline" round="pill">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
        <OButton variant="text" size="small" round="pill">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
    <div>
      <p>round="{{ r }}px"</p>
      <section>
        <OButton variant="solid" size="large" :round="r + 'px'" @click="onClick">
          <template #icon><OIconAdd /></template>Click To Change Round
        </OButton>
        <OButton variant="outline" :round="r + 'px'">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
        <OButton variant="text" size="small" :round="r + 'px'">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
  </section>
</template>
<style lang="scss"></style>
