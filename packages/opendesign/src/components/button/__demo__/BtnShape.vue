<script setup lang="ts">
import { OButton } from '../index';
import { IconAdd } from '../../icons';
</script>
<template>
  <h4>Shape</h4>
  <section>
    <OButton type="primary" size="large" shape="round">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline" shape="round">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline" size="small" shape="round">
      <template #icon><IconAdd /></template>
    </OButton>

    <OButton type="primary" size="large" shape="round">
      <template #icon><IconAdd /></template>Round Button
    </OButton>
    <OButton type="outline" shape="round">
      <template #icon><IconAdd /></template>Round Button
    </OButton>
    <OButton type="outline" size="small" shape="round">
      <template #icon><IconAdd /></template>Round Button
    </OButton>
  </section>
</template>
<style lang="scss"></style>
