<script setup lang="ts">
import { OButton } from '../index';
import { OIconAdd } from '../../icon-svgs';
</script>
<template>
  <h4>Icon + Size</h4>
  <section>
    <div class="row">
      <OButton variant="solid" size="mini">
        <template #icon><OIconAdd /></template>Primary Button
      </OButton>
      <OButton variant="solid" size="small">
        <template #icon><OIconAdd /></template>Primary Button
      </OButton>
      <OButton variant="solid" size="medium">
        <template #icon><OIconAdd /></template>Primary Button
      </OButton>
      <OButton variant="solid" size="large">
        <template #icon><OIconAdd /></template>Primary Button
      </OButton>
    </div>
    <div class="row">
      <OButton variant="outline" size="mini">
        <template #icon><OIconAdd /></template>Outline Button
      </OButton>
      <OButton variant="outline" size="small">
        <template #icon><OIconAdd /></template>Outline Button
      </OButton>
      <OButton variant="outline">
        <template #icon><OIconAdd /></template>Outline Button
      </OButton>
      <OButton variant="outline" size="large">
        <template #icon><OIconAdd /></template>Outline Button
      </OButton>
    </div>
    <div class="row">
      <OButton variant="text" size="mini">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="text" size="small">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="text">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="text" size="large">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="outline" size="mini" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="outline" size="small" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="outline" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="outline" size="large" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="solid" size="mini" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="solid" size="small" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="solid" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
      <OButton variant="solid" size="large" round="pill">
        <template #icon><OIconAdd /></template>
      </OButton>
    </div>
  </section>
</template>
<style lang="scss"></style>
