<script setup lang="ts">
import { ref } from 'vue';
import { OSwitch } from '../index';

const switchVal1 = ref(1);

const handleChange = (val: string | number | boolean) => {
  console.log(val);
};
</script>

<template>
  <h4>Change事件</h4>
  <section>
    <OSwitch v-model="switchVal1" :checked-value="1" :unchecked-value="2" round="pill" @change="handleChange" />
  </section>
</template>
