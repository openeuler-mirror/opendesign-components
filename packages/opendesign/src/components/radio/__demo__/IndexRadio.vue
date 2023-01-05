<script setup lang="ts">
import '../style';
import '../../radio-group/style';
import RadioBasic from './RadioBasic.vue';
import RadioDisabled from './RadioDisabled.vue';
import RadioSlots from './RadioSlots.vue';
import RadioGroup from './RadioGroup.vue';
</script>
<template>
  <div class="page-demo">
    <h4>基础用法</h4>
    <RadioBasic />
    <h4>禁用状态</h4>
    <RadioDisabled />
    <h4>插槽</h4>
    <RadioSlots />
    <h4>单选框组</h4>
    <RadioGroup />
  </div>
</template>
