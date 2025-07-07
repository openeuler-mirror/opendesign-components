<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '@opendesign-src/index';
const switchVal1 = ref(true);
const switchVal2 = ref(true);
const switchVal3 = ref(false);
</script>

<template>
  <div class="page-demo">
    <h3>基础</h3>
    <section>
      <OSwitch v-model="switchVal1" round="pill" />
    </section>

    <h3>禁用</h3>
    <section>
      <OSwitch v-model="switchVal2" round="pill" disabled />
      <OSwitch v-model="switchVal3" round="pill" disabled />
    </section>

    <h3>loading</h3>
    <section>
      <OSwitch v-model="switchVal2" round="pill" loading />
      <OSwitch v-model="switchVal3" round="pill" loading />
    </section>
  </div>
</template>
