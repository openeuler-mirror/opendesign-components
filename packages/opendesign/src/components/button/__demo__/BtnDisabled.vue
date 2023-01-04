<script setup lang="ts">
import { OButton } from '../index';
const btnClick = () => {
  alert('clicked');
};
</script>
<template>
  <h4>Disabled</h4>
  <section>
    <OButton type="primary" disabled @click="btnClick">Primary Button</OButton>
    <OButton type="outline" disabled>Outline Button</OButton>
    <OButton type="text" disabled>Text Button</OButton>
    <OButton type="link" disabled>Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
