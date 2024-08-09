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
      <OTextarea v-model="val1" placeholder="normal + outline" resize="none" clearable style="width: 250px">
        <template #prepend>
          <div>#CANN</div>
        </template>
        <template #append>
          <div>#指示领域</div>
        </template>
      </OTextarea>
    </div>
  </section>
</template>
<style lang="scss"></style>
