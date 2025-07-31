<docs lang="md">
<!--zh-CN-->
### Event API

<!--en-US-->
### Event API
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OTextarea } from '@opensig/opendesign';

const val1 = ref('123321');

const inputRef = ref<InstanceType<typeof OTextarea>>();
const focus = () => {
  inputRef.value?.focus();
};
const blur = () => {
  inputRef.value?.blur();
};

const clear = () => {
  inputRef.value?.clear();
};
</script>
<template>
  <section>
    <div class="row">
      <OTextarea ref="inputRef" v-model="val1" placeholder="normal + outline" clearable style="min-width: 250px" resize="both" />
    </div>
    <button @click="focus">focus</button>
    <button @click="blur">blur</button>
    <button @click="clear">clear</button>
  </section>
</template>
<style lang="scss"></style>
