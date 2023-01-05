<script setup lang="ts">
import '../style';
import '../../checkbox-group/style';
import CheckboxBasic from './CheckboxBasic.vue';
import CheckboxDisabled from './CheckboxDisabled.vue';
import CheckboxSlots from './CheckboxSlots.vue';
import CheckboxGroup from './CheckboxGroup.vue';
</script>
<template>
  <div class="page-demo">
    <h4>基础用法</h4>
    <CheckboxBasic />
    <h4>禁用状态</h4>
    <CheckboxDisabled />
    <h4>插槽</h4>
    <CheckboxSlots />
    <h4>多选框组</h4>
    <CheckboxGroup />
  </div>
</template>
