<script setup lang="ts">
import { provide, toRef } from 'vue';
import { breadcrumbProps } from './types';
import { breadcrumbInjectKey } from './provide';
import { useI18n } from '../locale';

const props = defineProps(breadcrumbProps);

const { t } = useI18n();

provide(breadcrumbInjectKey, {
  separator: toRef(props, 'separator'),
});
</script>

<template>
  <div role="navigation" :aria-label="t('breadcrumb.nav')" class="o-breadcrumb">
    <slot></slot>
  </div>
</template>
