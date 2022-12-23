<script setup lang="ts">
import { OButton, ButtonType, ButtonSize, ButtonShape } from '../index';
import { IconAdd } from '../../icons';
</script>
<template>
  <section>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.LARGE">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton :type="ButtonType.PRIMARY">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.SMALL">
      <template #icon><IconAdd /></template>Primary Button
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :size="ButtonSize.LARGE">
      Outline Button<template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE">
      Outline Button<template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :size="ButtonSize.SMALL">
      Outline Button<template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.LARGE">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :size="ButtonSize.SMALL">
      <template #icon><IconAdd /></template>
    </OButton>

    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.LARGE" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>
    </OButton>
    <OButton :type="ButtonType.OUTLINE" :size="ButtonSize.SMALL" :shape="ButtonShape.ROUND">
      <template #icon><IconAdd /></template>
    </OButton>
  </section>
</template>
<style lang="scss"></style>
