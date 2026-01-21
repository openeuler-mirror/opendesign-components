<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconZoomOut',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-zoom-out', 'type-fill'];
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
      <path fill-opacity=".8" fill-rule="evenodd" d="M18.138 6.023q.645.929 1.037 2a8.6 8.6 0 0 1 .515 3.417 8.6 8.6 0 0 1-.806 3.236 8.7 8.7 0 0 1-1.256 1.962l3.834 3.834c.197.274.246.744 0 .99a.7.7 0 0 1-.902.074l-3.922-3.908a8.6 8.6 0 0 1-2.663 1.547 8.6 8.6 0 0 1-3.416.515 8.6 8.6 0 0 1-3.236-.806 8.683 8.683 0 0 1-4.499-4.91 8.643 8.643 0 0 1-.516-3.416 8.7 8.7 0 0 1 .806-3.235q.381-.816.906-1.522a8.67 8.67 0 0 1 4.004-2.977 8.7 8.7 0 0 1 2.264-.498A8.692 8.692 0 0 1 15.7 3.678c.33.212.423.637.212.967a.693.693 0 0 1-.968.212 7.33 7.33 0 0 0-4.54-1.135 7.2 7.2 0 0 0-1.902.418q-.78.284-1.46.722-.538.345-1.013.788a7.3 7.3 0 0 0-2.323 4.98 7.2 7.2 0 0 0 .434 2.866q.284.78.722 1.46.345.54.788 1.014a7.2 7.2 0 0 0 2.264 1.645q.692.323 1.419.494a7.27 7.27 0 0 0 4.163-.25 7.256 7.256 0 0 0 2.474-1.51 7.2 7.2 0 0 0 1.645-2.265 7.2 7.2 0 0 0 .677-2.715 7.2 7.2 0 0 0-.433-2.866 7.3 7.3 0 0 0-.87-1.68.693.693 0 0 1 .174-.975.693.693 0 0 1 .975.175" class="zoom-out_svg__合并"/><path fill-opacity=".8" fill-rule="evenodd" d="M15 10.4a.7.7 0 0 1 0 1.4H7a.7.7 0 1 1 0-1.4z" class="zoom-out_svg__合并"/>
    </template>
  </svg>
</template>