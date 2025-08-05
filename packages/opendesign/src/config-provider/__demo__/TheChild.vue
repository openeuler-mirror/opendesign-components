<script setup lang="ts">
import { useI18n } from '../../locale';

const { t, locale } = useI18n();
</script>
<template>
  <div>locale: {{ locale }}</div>
  <div>"pagination.goto": {{ t('pagination.goto') }}</div>
  <div>"pagination.total": {{ t('pagination.total', 100, 1, 2) }}</div>
  <div>"pagination.goto": {{ t('pagination.goto') }}</div>
  <div>"select.cancel": {{ t('select.cancel') }}</div>
</template>
<style lang="scss"></style>
