<script setup lang="ts">
import { PopupTriggerT } from '../popup';

interface DropdownPropT {
  /**
   * 下拉菜单触发方式
   */
  trigger?: PopupTriggerT;
  optionPosition:
}

const props = withDefaults(defineProps<DropdownPropT>(), {
  trigger: 'click',
});
</script>

<template></template>
