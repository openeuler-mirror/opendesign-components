<script setup lang="ts">
import { useRouter } from 'vue-router';
import { OResult, useI18n } from '@opensig/opendesign';

const { t } = useI18n();
const router = useRouter();
</script>
<template>
  <OResult :description="t('notFound')" title="404" status="danger" class="not-found">
    <template #extra>
      <OButton @click="router.push('/')">{{ t('goBackHome') }}</OButton>
    </template>
  </OResult>
</template>
<style lang="scss" scoped>
.not-found {
  height: var(--body-min-height);
}
</style>
