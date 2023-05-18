<script setup lang="ts">
import { OButton } from '../index';
import { OIconAdd } from '../../icon-components';
</script>
<template>
  <h4>Icon + Size</h4>
  <section>
    <div class="row">
      <OButton variant="solid" size="mini" :icon="OIconAdd">mini Button </OButton>
      <OButton variant="solid" size="small">
        <template #icon><OIconAdd /></template>small Button
      </OButton>
      <OButton variant="solid" size="medium">
        <template #icon><OIconAdd /></template>outline Button
      </OButton>
      <OButton variant="solid" size="large">
        <template #icon><OIconAdd /></template>large Button
      </OButton>
    </div>
    <div class="row">
      <OButton variant="outline" size="mini">
        <template #icon><OIconAdd /></template>mini Button
      </OButton>
      <OButton variant="outline" size="small">
        <template #icon><OIconAdd /></template>small Button
      </OButton>
      <OButton variant="outline">
        <template #icon><OIconAdd /></template>outline Button
      </OButton>
      <OButton variant="outline" size="large" :icon="OIconAdd">
        <template #suffix><OIconAdd /></template>large Button
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
