<script setup lang="ts">
import { provide, useAttrs, inject } from 'vue';
import { hyphenate } from '@/utils/named';

defineOptions({
  inheritAttrs: false,
});
const parentConfig = inject<Record<string, any>>('docs-config', {});
const selfConfig = useAttrs();
const newConfig = new Proxy(selfConfig, {
  get(target, key: string) {
    if (key in target) {
      return target[key];
    }
    if (key in parentConfig) {
      return parentConfig[key];
    }
    const hKey = hyphenate(key);
    if (hKey in target) {
      return target[hKey];
    }
    if (hKey in parentConfig) {
      return parentConfig[hKey];
    }
  },
  has(target, p) {
    return p in target || p in parentConfig;
  },
});
provide('docs-config', newConfig);
</script>
<template><slot></slot></template>
