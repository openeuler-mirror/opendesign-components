<script setup lang="ts">
import { inject } from 'vue';
import { breadcrumbItemProps } from './types';
import { breadcrumbInjectKey } from './provide';
import { IconChevronRight } from '../_shared/icons';

defineProps(breadcrumbItemProps);

const breadcrumbInjection = inject(breadcrumbInjectKey, null);

const emits = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  emits('click');
};
</script>

<template>
  <div class="o-breadcrumb-item">
    <!-- label -->
    <a v-if="href" :href="href" :target="target" class="o-breadcrumb-item-label" @click="onClick">
      <slot></slot>
    </a>
    <router-link v-else-if="to" :to="to" :replace="replace" @click="onClick">
      <slot></slot>
    </router-link>
    <span v-else class="o-breadcrumb-item-label" @click="onClick">
      <slot></slot>
    </span>
    <!-- separator -->
    <span class="o-breadcrumb-item-separator">
      <slot v-if="$slots.separator" name="separator"></slot>
      <span v-else-if="separator"> {{ separator }}</span>
      <template v-else-if="breadcrumbInjection?.separator.value">{{ breadcrumbInjection?.separator.value }} </template>
      <IconChevronRight v-else />
    </span>
  </div>
</template>
