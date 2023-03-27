<script setup lang="ts">
import { inject } from 'vue';
import { slidesInjectKey } from './provide';

const injection = inject(slidesInjectKey);
</script>
<template>
  <div class="o-slide-item" :class="[injection ? `o-slide-${injection.type}` : '']">
    <slot></slot>
  </div>
</template>
