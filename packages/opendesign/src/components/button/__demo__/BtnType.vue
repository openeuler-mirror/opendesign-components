<script setup lang="ts">
import { OButton, ButtonType } from '../index';
</script>
<template>
  <section>
    <OButton :type="ButtonType.PRIMARY">Primary Button</OButton>
    <OButton :type="ButtonType.OUTLINE">Outline Button</OButton>
    <OButton :type="ButtonType.TEXT">Text Button</OButton>
    <OButton :type="ButtonType.LINK">Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
