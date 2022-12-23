<script setup lang="ts">
import { OButton, ButtonType } from '../index';
</script>
<template>
  <section>
    <OButton :type="ButtonType.PRIMARY" disabled>Primary Button</OButton>
    <OButton :type="ButtonType.OUTLINE" disabled>Outline Button</OButton>
    <OButton :type="ButtonType.TEXT" disabled>Text Button</OButton>
    <OButton :type="ButtonType.LINK" disabled>Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
