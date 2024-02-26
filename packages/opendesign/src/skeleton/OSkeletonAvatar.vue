<script lang="ts" setup>
import { skeletonAvatarProps } from './types';
import { getRoundClass } from '../_utils/style-class';

const props = defineProps(skeletonAvatarProps);
const round = getRoundClass(props, 'skeleton');
</script>

<template>
  <div class="o-skeleton-item o-skeleton-avatar" :class="[`o-skeleton-avatar-${props.size}`, round.class.value]" :style="round.style.value"></div>
</template>
