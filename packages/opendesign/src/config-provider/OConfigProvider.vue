<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue';
import { configProviderProps } from './types';
import { configProviderInjectKey } from './provide';

const props = defineProps(configProviderProps);

const { locale, link } = toRefs(props);

const globalConfig = reactive({
  locale,
  link,
});
provide(configProviderInjectKey, globalConfig);
</script>
<template>
  <slot></slot>
</template>
