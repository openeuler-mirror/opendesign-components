<script setup lang="ts">
import { ORate } from '@opensig/opendesign';
</script>

<template>
  <ORate size="large" color="danger" allow-half>
    <template #icon="{ status }">
      <svg viewBox="0 0 24 24" :class="['custom-icon', { full: status === 'full', half: status === 'half' }]">
        <ellipse ry="10" rx="10" cy="12" cx="12" class="outline" />
        <path d="M 12, 2 A 10, 10, 0, 0, 0, 12, 22 Z" class="left-half" />
        <path d="M 12, 2 A 10, 10, 0, 0, 1, 12, 22 Z" class="right-half" />
      </svg>
    </template>
  </ORate>
</template>

<style lang="scss" scoped>
.custom-icon {
  width: 1em;
  height: 1em;
}
.outline {
  fill: none;
  stroke: var(--rate-color-selected);
  stroke-width: 2;
}
.left-half, .right-half {
  fill: none;
  stroke: none;
}
.full {
  .outline {
    stroke: var(--rate-color-selected);
  }
  .left-half,
  .right-half {
    fill: var(--rate-color-selected);
  }
}
.half {
  .outline {
    stroke: var(--rate-color-selected);
  }
  .left-half {
    fill: var(--rate-color-selected);
  }
}
</style>
