<script setup lang="ts">
import { inject } from 'vue';
import { carouselInjectKey } from './provide';

const injection = inject(carouselInjectKey);
</script>
<template>
  <div class="o-carousel-item" :class="[injection ? `o-carousel-${injection.type}` : '']">
    <slot></slot>
  </div>
</template>
