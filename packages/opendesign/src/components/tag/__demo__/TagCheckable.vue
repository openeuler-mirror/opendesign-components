<script setup lang="ts">
import { ref } from 'vue';
import { OTag } from '../index';

const tagVal1 = ref(true);
const tagVal2 = ref(true);
const tagVal3 = ref(true);
const tagVal4 = ref(true);
const handleChange = (val: boolean) => {
  console.log(val);
};
</script>

<template>
  <h4>可选中标签</h4>
  <section>
    <OTag v-model:checked="tagVal1" checkable @change="handleChange">Tag1</OTag>
    <OTag v-model:checked="tagVal2" color="success" checkable @change="handleChange">Tag2</OTag>
    <OTag v-model:checked="tagVal3" color="warning" checkable @change="handleChange">Tag3</OTag>
    <OTag v-model:checked="tagVal4" color="danger" checkable @change="handleChange">Tag4</OTag>
    <OTag :default-checked="true" variant="outline" checkable @change="handleChange">Tag5</OTag>
    <OTag :default-checked="true" color="success" variant="outline" checkable @change="handleChange">Tag6</OTag>
    <OTag :default-checked="true" color="warning" variant="outline" checkable @change="handleChange">Tag7</OTag>
    <OTag :default-checked="true" color="danger" variant="outline" checkable @change="handleChange">Tag8</OTag>
  </section>
</template>
