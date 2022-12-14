<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
import { IconHome3 } from '@opensig/opendesign/es/icons';

const title = 'Home';
</script>
<template>
  <div class="page-demo">
    {{ title }}
    <section>
      <IconHome3 />
      <OButton>button</OButton>
    </section>
  </div>
</template>
<style lang="scss">
.the-home {
  color: #333;
}
</style>
