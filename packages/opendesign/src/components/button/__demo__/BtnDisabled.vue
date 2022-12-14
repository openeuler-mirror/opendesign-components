<script setup lang="ts">
import { OButton, ButtonTypeT } from '../index';
</script>
<template>
  <section>
    <OButton :type="ButtonTypeT.PRIMARY" disabled>Primary Button</OButton>
    <OButton :type="ButtonTypeT.OUTLINE" disabled>Outline Button</OButton>
    <OButton :type="ButtonTypeT.TEXT" disabled>Text Button</OButton>
    <OButton :type="ButtonTypeT.LINK" disabled>Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
