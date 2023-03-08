<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(true);

const r2 = '2px';
const r4 = '4px';
</script>

<template>
  <h4>Round</h4>
  <section>
    <div>
      <section>
        <p>round="pill"</p>
        <OSWitch v-model="switchVal1" round="pill" size="small" />
        <OSWitch v-model="switchVal1" round="pill" size="medium" />
        <OSWitch v-model="switchVal1" round="pill" size="large" />
      </section>
    </div>

    <div>
      <section>
        <p>round="2px"</p>
        <OSWitch v-model="switchVal2" :round="r2" size="small" />
        <OSWitch v-model="switchVal2" :round="r2" size="medium" />
        <OSWitch v-model="switchVal2" :round="r2" size="large" />
      </section>
    </div>

    <div>
      <section>
        <p>round="4px"</p>
        <OSWitch v-model="switchVal3" :round="r4" size="small" />
        <OSWitch v-model="switchVal3" :round="r4" size="medium" />
        <OSWitch v-model="switchVal3" :round="r4" size="large" />
      </section>
    </div>
  </section>
</template>
