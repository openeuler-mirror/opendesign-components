<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconWarning',
  svgType: 'color',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-warning', 'type-color'];
    const isClient = ref(false);
    onMounted(() => {
      isClient.value = true;
    });
    return {
      isClient,
      classNames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classNames">
    <template v-if="isClient">
      <path fill="currentColor" d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9"/><path fill="#fff" d="M12 13.621a.433.433 0 0 1-.432-.404l-.367-5.441-.002-.054c0-.408.306-.745.701-.795l.1-.006.054.002c.441.03.775.412.745.853l-.367 5.441a.433.433 0 0 1-.432.404m0 3.15a1.1 1.1 0 1 1-.001-2.199A1.1 1.1 0 0 1 12 16.771"/>
    </template>
  </svg>
</template>