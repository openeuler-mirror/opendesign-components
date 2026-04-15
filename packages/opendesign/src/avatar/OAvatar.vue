<script setup lang="ts">
import { computed, ref } from 'vue';

import { IconAvatar, IconEdit } from '../_utils/icons';

import { avatarProps } from './types.ts';
import { normalizeSize } from './utils.ts';

const props = defineProps(avatarProps);

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void;
  (e: 'error'): void;
  (e: 'load'): void;
}>();

const hasError = ref(false);
const isLoaded = ref(false);

const showText = computed(() => props.name && !props.url);
const showDefault = computed(() => !props.url && !props.name);

const outerStyle = computed(() => {
  const style: Record<string, any> = {};
  if (props.size) {
    style['--avatar-size'] = normalizeSize(props.size);
  }
  if (showText.value) {
    style['--avatar-bg'] = props.background || `var(--o-color-auxiliary${Math.floor(Math.random() * 8) + 1})`;
  } else if (!showDefault.value && !hasError.value) {
    style['--avatar-bg'] = `var(--o-color-fill2)`;
  }
  return style;
});

const handleImgLoad = () => {
  isLoaded.value = true;
  emit('load');
};

const handleImgError = () => {
  hasError.value = true;
  emit('error');
};

const onClick = (e: MouseEvent) => {
  if (props.clickable) {
    emit('click', e);
  }
};
</script>

<template>
  <div
    :style="outerStyle"
    :class="[
      'o-avatar',
      'o-avatar-circle',
      {
        'o-avatar-img': isLoaded,
        'o-avatar-default': !showText && !isLoaded,
        'o-avatar-text': showText,
        'o-avatar-clickable': props.clickable,
      },
    ]"
    @click="onClick"
  >
    <img v-if="url && !hasError" :src="url" :style="{ objectFit: props.objectFit }" alt="avatar" @load="handleImgLoad" @error="handleImgError" />
    <template v-else-if="showText">
      <slot name="name">
        <component :is="props.nameFormatter({ name: props.name })" v-if="props.nameFormatter" />
        <span v-else>{{ props.name?.[0] }}</span>
      </slot>
    </template>
    <IconAvatar v-else-if="showDefault || hasError" class="o-avatar-default-icon" />

    <div v-if="props.clickable" class="o-avatar-trigger-icon">
      <slot name="trigger-icon"><IconEdit /></slot>
    </div>
  </div>
</template>
