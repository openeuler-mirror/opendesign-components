<script setup lang="ts">
import { defaultSize } from '../_shared/global';
import { IconLoading } from '../_shared/icons';
import { uploadProps } from './types';

const props = defineProps(uploadProps);
</script>
<template>
  <div class="o-upload"></div>
</template>
