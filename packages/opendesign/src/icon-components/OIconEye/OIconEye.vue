<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconEye',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-eye', 'type-fill'];
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
      <path d="M12.028 4.789c1.794 0 3.578.6 5.242 1.658a.7.7 0 0 1-.751 1.181c-1.453-.925-2.985-1.439-4.491-1.439-2.045 0-4.153.957-5.97 2.53-1.428 1.236-2.473 2.745-2.473 3.279 0 .536 1.04 2.047 2.461 3.283 1.809 1.574 3.91 2.531 5.955 2.531s4.146-.958 5.955-2.532c1.421-1.236 2.461-2.748 2.461-3.284 0-.448-.785-1.685-1.934-2.806a.7.7 0 1 1 .978-1.002c1.398 1.365 2.356 2.874 2.356 3.808 0 2.596-5.311 7.216-9.816 7.216s-9.816-4.62-9.816-7.214c0-2.589 5.338-7.208 9.843-7.208zm-.041 3.603a3.63 3.63 0 1 1 0 7.26 3.63 3.63 0 0 1 0-7.26m0 1.4a2.23 2.23 0 1 0-.001 4.459 2.23 2.23 0 0 0 .001-4.459"/>
    </template>
  </svg>
</template>