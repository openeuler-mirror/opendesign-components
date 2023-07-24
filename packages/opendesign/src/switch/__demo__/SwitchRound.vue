<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
const switchVal3 = ref(true);

const r2 = '6px';
const r4 = '4px';
</script>

<template>
  <h4>Round</h4>
  <section>
    <div>
      <p>round = 'pill'</p>
      <section>
        <OSwitch v-model="switchVal1" round="pill" size="small" />
        <OSwitch v-model="switchVal1" round="pill" size="medium" />
      </section>
    </div>

    <div>
      <p>round = {{ r2 }}</p>
      <section>
        <OSwitch v-model="switchVal2" :round="r2" size="small" />
        <OSwitch v-model="switchVal2" :round="r2" size="medium" />
      </section>
    </div>

    <div>
      <p>round = {{ r4 }}</p>
      <section>
        <OSwitch v-model="switchVal3" :round="r4" size="small" />
        <OSwitch v-model="switchVal3" :round="r4" size="medium" />
      </section>
    </div>
  </section>
</template>
