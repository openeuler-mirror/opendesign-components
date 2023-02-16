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
    <OTag v-model:checked="tagVal2" status="success" checkable @change="handleChange">Tag2</OTag>
    <OTag v-model:checked="tagVal3" status="warning" checkable @change="handleChange">Tag3</OTag>
    <OTag v-model:checked="tagVal4" status="danger" checkable @change="handleChange">Tag4</OTag>
    <OTag :default-checked="true" checkable bordered @change="handleChange">Tag5</OTag>
    <OTag :default-checked="true" status="success" checkable bordered @change="handleChange">Tag6</OTag>
    <OTag :default-checked="true" status="warning" checkable bordered @change="handleChange">Tag7</OTag>
    <OTag :default-checked="true" status="danger" checkable bordered @change="handleChange">Tag8</OTag>
  </section>
</template>
