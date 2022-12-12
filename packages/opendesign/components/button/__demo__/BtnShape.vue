<script setup lang="ts">
import { OButton, ButtonTypeT, ButtonSizeT, ButtonShapeT } from '../index';
import { IconEvil2 } from '../../icons';
</script>
<template>
  <section>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.LARGE" :shape="ButtonShapeT.CIRCLE">
      <template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :shape="ButtonShapeT.CIRCLE">
      <template #icon><IconEvil2 /></template>
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :size="ButtonSizeT.SMALL" :shape="ButtonShapeT.CIRCLE">
      <template #icon><IconEvil2 /></template>
    </OButton>

    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.LARGE" :shape="ButtonShapeT.ROUND">
      <template #icon><IconEvil2 /></template>Round Button
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :shape="ButtonShapeT.ROUND">
      <template #icon><IconEvil2 /></template>Round Button
    </OButton>
    <OButton :type="ButtonTypeT.OUTLINE" :size="ButtonSizeT.SMALL" :shape="ButtonShapeT.ROUND">
      <template #icon><IconEvil2 /></template>Round Button
    </OButton>
  </section>
</template>
<style lang="scss"></style>
