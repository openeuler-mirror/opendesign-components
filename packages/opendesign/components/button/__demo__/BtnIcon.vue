<script setup lang="ts">
import { OButton, ButtonTypeT } from '../index';
import { IconEvil2 } from '../../icons';
</script>
<template>
  <section>
    <OButton :type="ButtonTypeT.PRIMARY"><IconEvil2 />Primary Button</OButton>
    <OButton :type="ButtonTypeT.OUTLINE"><IconEvil2 />Outline Button</OButton>
    <OButton :type="ButtonTypeT.TEXT"><IconEvil2 />Text Button</OButton>
    <OButton :type="ButtonTypeT.LINK"><IconEvil2 />Link Button</OButton>
  </section>
</template>
<style lang="scss"></style>
