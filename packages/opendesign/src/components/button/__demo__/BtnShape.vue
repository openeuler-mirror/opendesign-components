<script setup lang="ts">
import { OButton, ButtonType, ButtonSize, ButtonShape } from '../index';
import { IconAdd } from '../../icons';
</script>
<template>
  <section>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.LARGE" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :size="ButtonSize.SMALL" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>
    </OButton>

    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.LARGE" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>Round Button
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>Round Button
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :size="ButtonSize.SMALL" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>Round Button
    </OButton>
  </section>
</template>
<style lang="scss"></style>
