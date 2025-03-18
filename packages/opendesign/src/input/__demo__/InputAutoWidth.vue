<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';

const val1 = ref('192-168-1-0192-168-1-0192-168-1-0192-168-1-0192-168-1-0192-168-1-0192-168-1-0');
const val2 = ref('min width: 100px');

const format = (v: string) => {
  return `$${v.replace(/-/g, '.')}`;
};
</script>
<template>
  <h4>Auto Width</h4>
  <div>
    max-width: 300px:
    <section>
      <OInput v-model="val1" :clearable="false" auto-width style="max-width: 300px" :format="format" />
    </section>
  </div>
  <div>
    min-width: 200px:
    <section>
      <div>
        <OInput v-model="val2" auto-width style="min-width: 200px" :max-length="50" />
      </div>
    </section>
  </div>
</template>
<style lang="scss"></style>
