<script setup lang="ts">
import { OButton, ButtonTypeT, ButtonSizeT, ButtonShapeT } from '../index';
import { IconEvil2 } from '../../icons';
</script>
<template>
  <section>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.LARGE">
      <template #icon><IconEvil2 /></template>Primary Button
    </OButton>
    <OButton :type="ButtonTypeT.PRIMARY">
      <template #icon><IconEvil2 /></template>Primary Button
    </OButton>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.SMALL">
      <template #icon><IconEvil2 /></template>Primary Button
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :size="ButtonSizeT.LARGE">
      Outline Button<template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE">
      Outline Button<template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :size="ButtonSizeT.SMALL">
      Outline Button<template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.LARGE">
      <template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE">
      <template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :size="ButtonSizeT.SMALL">
      <template #icon><IconEvil2 /></template>
    </OButton>

    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.LARGE" :shape="ButtonShapeT.ROUND">
      <template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :shape="ButtonShapeT.ROUND">
      <template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :size="ButtonSizeT.SMALL" :shape="ButtonShapeT.ROUND">
      <template #icon><IconEvil2 /></template>
    </OButton>
  </section>
</template>
<style lang="scss"></style>
