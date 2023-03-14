<script setup lang="ts">
import { OButton } from '../index';
import { IconAdd } from '../../icons';
</script>
<template>
  <h4>Icon</h4>
  <section>
    <OButton variant="solid" size="mini">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton variant="solid" size="small">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton variant="solid" size="medium">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton variant="solid" size="large">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton variant="outline" size="large">
      <template #icon><IconAdd /></template>Outline Button
    </OButton>
    <OButton variant="outline">
      <template #icon><IconAdd /></template>Outline Button
    </OButton>
    <OButton variant="outline" size="small">
      <template #icon><IconAdd /></template>Outline Button
    </OButton>

    <OButton variant="text" size="mini">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton variant="text" size="small">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton variant="text">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton variant="text" size="large">
      <template #icon><IconAdd /></template>
    </OButton>

    <OButton variant="text" size="mini" round="pill">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton variant="text" size="small" round="pill">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton variant="outline" round="pill">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton variant="solid" size="large" round="pill">
      <template #icon><IconAdd /></template>
    </OButton>
  </section>
</template>
<style lang="scss"></style>
