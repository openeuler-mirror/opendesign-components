<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import { carouselInjectKey } from './provide';

const injection = inject(carouselInjectKey, null);

onMounted(() => {
  injection?.register();
});

onUnmounted(() => {
  injection?.unregister();
});
</script>
<template>
  <div :class="[injection ? `o-carousel-item-${injection.effect}` : 'o-carousel-item']">
    <slot></slot>
  </div>
</template>
