<script setup lang="ts">
import { OTextarea } from '@components/index';
import { ref } from 'vue';
const val1 = ref('');
const val2 = ref('This is detail This is detail This is detail');
</script>
<template>
  <div class="page-demo">
    <section>
      <OTextarea v-model="val1" placeholder="Hint" />
      <OTextarea v-model="val2" placeholder="Hint" />
      <OTextarea v-model="val2" placeholder="Hint" :max-length="20" />
      <OTextarea v-model="val2" placeholder="Hint" resize="v" />
      <OTextarea v-model="val2" placeholder="Hint" color="danger" resize="v" />
      <OTextarea v-model="val2" placeholder="Hint" :max-length="60" disabled />
    </section>
  </div>
</template>
<style lang="scss"></style>
