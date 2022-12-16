<script setup lang="ts">
import { OButton, ButtonTypeT } from '../index';
</script>
<template>
  <section>
    <OButton :type="ButtonTypeT.PRIMARY">Primary Button</OButton>
    <OButton :type="ButtonTypeT.OUTLINE">Outline Button</OButton>
    <OButton :type="ButtonTypeT.TEXT">Text Button</OButton>
    <OButton :type="ButtonTypeT.LINK">Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
