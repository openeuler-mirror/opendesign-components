<script setup lang="ts">
import { OButton } from '../index';
import { IconAdd } from '../../icons';
</script>
<template>
  <section>
    <OButton type="primary" size="large">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton type="primary">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton type="primary" size="small">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton type="outline" size="large">
      Outline Button<template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline">
      Outline Button<template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline" size="small">
      Outline Button<template #icon><IconAdd /></template>
    </OButton>
    <OButton type="primary" size="large">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline" size="small">
      <template #icon><IconAdd /></template>
    </OButton>

    <OButton type="primary" size="large" shape="round">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline" shape="round">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton type="outline" size="small" shape="round">
      <template #icon><IconAdd /></template>
    </OButton>
  </section>
</template>
<style lang="scss"></style>
