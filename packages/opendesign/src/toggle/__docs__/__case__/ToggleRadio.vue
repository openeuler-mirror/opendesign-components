<docs lang="md">
<!--zh-CN-->

### 单选

<!--en-US-->

### exclusive
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OToggle, ORadio, ORadioGroup } from '@opensig/opendesign';
const radioVal = ref(1);
</script>

<template>
  <section>
    <ORadioGroup v-model="radioVal" :style="{ '--radio-group-gap': '8px' }">
      <ORadio :value="1">
        <template #radio="{ checked }">
          <OToggle :checked="checked" round="pill">筛选条件1</OToggle>
        </template>
      </ORadio>
      <ORadio :value="2">
        <template #radio="{ checked }">
          <OToggle :checked="checked" round="pill">筛选条件2</OToggle>
        </template>
      </ORadio>
      <ORadio :value="3">
        <template #radio="{ checked }">
          <OToggle :checked="checked" round="pill">筛选条件3</OToggle>
        </template>
      </ORadio>
      <ORadio :value="4">
        <template #radio="{ checked }">
          <OToggle :checked="checked" round="pill">筛选条件4</OToggle>
        </template>
      </ORadio>
    </ORadioGroup>
  </section>
</template>
