<script setup lang="ts">
import '../style';
import SliderBasic from './SliderBasic.vue';
import SliderStops from './SliderStops.vue';
import SliderDisabled from './SliderDisabled.vue';
</script>

<template>
  <div class="page-demo">
    <SliderBasic />
    <SliderStops />
    <SliderDisabled />
  </div>
</template>

<style scoped lang="scss">
.page-demo > * {
  margin-top: 40px;
}
</style>
