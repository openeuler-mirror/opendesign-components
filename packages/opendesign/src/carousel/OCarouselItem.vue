<script setup lang="ts">
import { inject } from 'vue';
import { carouselInjectKey } from './provide';

const injection = inject(carouselInjectKey);
</script>
<template>
  <div :class="[injection ? `o-carousel-item-${injection.effect}` : 'o-carousel-item']">
    <slot></slot>
  </div>
</template>
