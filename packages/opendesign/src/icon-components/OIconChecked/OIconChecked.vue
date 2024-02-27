<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconChecked',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-checked', 'type-fill'];
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
  <template v-if="isClient">
    <svg viewBox="0 0 24 24" :class="classNames"><path d="M5.08 13.094a1.199 1.199 0 0 1-.062-1.698 1.21 1.21 0 0 1 1.699-.057l3.508 3.269 6.753-7.24a1.195 1.195 0 0 1 1.578-.154l.117.096c.485.452.505 1.218.061 1.695l-7.572 8.119-.104.096a1.194 1.194 0 0 1-1.475.06l-.117-.096-4.386-4.09z"/></svg>
  </template>
</template>