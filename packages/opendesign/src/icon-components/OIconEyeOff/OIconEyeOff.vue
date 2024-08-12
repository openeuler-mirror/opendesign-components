<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconEyeOff',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-eye-off', 'type-fill'];
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
      <path d="M21.483 8.021a.753.753 0 0 1 .158 1.054 15.6 15.6 0 0 1-2.067 2.282.1.1 0 0 1 .021.022l2.054 2.439a.754.754 0 0 1-1.153.971l-2.054-2.439-.031-.042c-.79.581-1.63 1.077-2.499 1.46l.965 3.406a.753.753 0 0 1-1.449.411l-.935-3.301a9.2 9.2 0 0 1-2.543.371 9 9 0 0 1-1.52-.134l-.869 3.067a.753.753 0 1 1-1.449-.411l.858-3.028a12.4 12.4 0 0 1-2.935-1.459l-1.817 2.158a.754.754 0 0 1-1.153-.971l1.76-2.089A15.7 15.7 0 0 1 2.352 9.2a.753.753 0 1 1 1.201-.909c2.106 2.783 5.337 4.859 8.397 4.859 3.105 0 6.391-2.144 8.478-4.968a.753.753 0 0 1 1.054-.158z"/>
    </template>
  </svg>
</template>