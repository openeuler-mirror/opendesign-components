<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconFilter',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-filter', 'type-fill'];
    const isClient = ref(false);
    onMounted(() => {
      isClient.value = true;
    });
    return {
      isClient,
      classNames,
      globalId: globalId++,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classNames">
    <template v-if="isClient">
      <path d="M18.295 3.2c.895 0 1.605.748 1.605 1.653 0 .309-.084.612-.242.874l-.085.127-1.476 1.999a.7.7 0 0 1-1.182-.744l.055-.088 1.476-1.999a.3.3 0 0 0 .054-.169c0-.123-.07-.217-.153-.245l-.052-.008H5.705a.18.18 0 0 0-.112.042c-.087.071-.116.206-.074.317l.034.063 5.01 6.783c.181.246.292.537.32.842l.007.153.018 4.918c0 .066.022.126.057.172l.039.04 1.816 1.43q.052.04.11.04c.088 0 .171-.074.197-.184l.008-.07-.024-6.336a1.7 1.7 0 0 1 .242-.879l.086-.128 2.149-2.909a.7.7 0 0 1 1.182.744l-.055.088-2.149 2.909a.3.3 0 0 0-.048.108l-.006.062.024 6.336c.003.905-.704 1.656-1.599 1.659a1.57 1.57 0 0 1-.857-.251l-.124-.089-1.816-1.43a1.66 1.66 0 0 1-.621-1.138l-.009-.169-.018-4.918a.3.3 0 0 0-.025-.118l-.029-.05-5.01-6.783a1.69 1.69 0 0 1 .278-2.295c.243-.199.536-.321.844-.351l.155-.008z"/>
    </template>
  </svg>
</template>