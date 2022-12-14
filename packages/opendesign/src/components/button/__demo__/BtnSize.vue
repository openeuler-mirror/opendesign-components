<script setup lang="ts">
import { OButton, ButtonTypeT, ButtonSizeT } from '../index';
</script>
<template>
  <section>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.LARGE"> Large Button </OButton>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.NORMAL"> Normal Button </OButton>
    <OButton :type="ButtonTypeT.PRIMARY" :size="ButtonSizeT.SMALL"> Small Button </OButton>
  </section>
</template>
<style lang="scss"></style>
