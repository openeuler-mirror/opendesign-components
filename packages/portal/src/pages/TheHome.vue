<script setup lang="ts">
import '@opensig/opendesign/es/button/style';
import { OButton } from '@opensig/opendesign';
import { IconHeart } from '@opensig/opendesign/es/icons';

const title = 'Home';
</script>
<template>
  <div class="page-demo">
    {{ title }}
    <section>
      <IconHeart />
      <OButton>button</OButton>
    </section>
  </div>
</template>
<style lang="scss">
.the-home {
  color: #333;
}
</style>
