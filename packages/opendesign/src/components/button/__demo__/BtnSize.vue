<script setup lang="ts">
import { OButton, ButtonType, ButtonSize } from '../index';
</script>
<template>
  <section>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.LARGE"> Large Button </OButton>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.NORMAL"> Normal Button </OButton>
    <OButton :type="ButtonType.PRIMARY" :size="ButtonSize.SMALL"> Small Button </OButton>
  </section>
</template>
<style lang="scss"></style>
