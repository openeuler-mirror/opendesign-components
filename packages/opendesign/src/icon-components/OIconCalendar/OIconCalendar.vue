<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconCalendar',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-calendar', 'type-fill'];
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
      <path d="M6.463 4.976a.7.7 0 0 1 .095 1.394l-.095.006H4.471a.14.14 0 0 0-.13.093l-.007.043v1.856h15.329l.001-1.856a.14.14 0 0 0-.093-.13l-.043-.007h-2.055a.7.7 0 0 1-.095-1.394l.095-.006h2.055c.801 0 1.46.614 1.53 1.397l.006.14v12.359c0 .801-.614 1.46-1.397 1.53l-.14.006H4.47c-.801 0-1.46-.614-1.53-1.397l-.006-.14V6.511c0-.801.614-1.46 1.397-1.53l.14-.006zm13.201 4.792H4.335v9.103c0 .06.039.111.093.13l.043.007h15.057c.06 0 .111-.039.13-.093l.007-.043-.001-9.103zm-3.482 5.663a.7.7 0 0 1 .095 1.394l-.095.006H7.817a.7.7 0 0 1-.095-1.394l.095-.006zm0-3.346a.7.7 0 0 1 .095 1.394l-.095.006H7.817a.7.7 0 0 1-.095-1.394l.095-.006zm-.696-8.467c.354 0 .647.263.694.605l.006.095v2.804a.7.7 0 0 1-1.394.095l-.006-.095V4.318a.7.7 0 0 1 .7-.7m-6.937-.026c.354 0 .647.263.694.605l.006.095v2.804a.7.7 0 0 1-1.394.095l-.006-.095V4.292a.7.7 0 0 1 .7-.7m4.946 1.384a.7.7 0 0 1 .095 1.394l-.095.006H10.53a.7.7 0 0 1-.095-1.394l.095-.006z"/>
    </template>
  </svg>
</template>