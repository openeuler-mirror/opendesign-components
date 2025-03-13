<script setup lang="ts">
import { ref } from 'vue';
import { OTextarea } from '../index';

const val1 = ref('');
</script>
<template>
  <h4>Slot</h4>
  <section>
    <div>Outline</div>
    <div class="row">
      <OTextarea v-model="val1" placeholder="normal + outline" clearable style="min-width: 250px" resize="both">
        <template #prefix>
          <div>#CANN</div>
        </template>
        <template #suffix>
          <div>#指示领域</div>
        </template>
      </OTextarea>
    </div>
  </section>
</template>
<style lang="scss"></style>
