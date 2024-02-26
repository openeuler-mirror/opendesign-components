<script setup lang="ts">
import { inject } from 'vue';
import { breadcrumbItemProps } from './types';
import { breadcrumbInjectKey } from './provide';
import { IconChevronRight } from '../_utils/icons';
import HtmlTag from '../_components/html-tag';

const props = defineProps(breadcrumbItemProps);

const breadcrumbInjection = inject(breadcrumbInjectKey, null);
</script>

<template>
  <div class="o-breadcrumb-item">
    <!-- label -->
    <router-link v-if="props.to" :to="props.to" :replace="props.replace" class="o-breadcrumb-item-label">
      <slot></slot>
    </router-link>
    <HtmlTag v-else :tag="!!props.href ? 'a' : 'span'" :href="props.href" :target="props.href ? props.target : undefined" class="o-breadcrumb-item-label">
      <slot></slot>
    </HtmlTag>

    <!-- separator -->
    <span class="o-breadcrumb-item-separator">
      <slot name="separator">
        <template v-if="props.separator"> {{ props.separator }}</template>
        <template v-else-if="breadcrumbInjection?.separator.value">{{ breadcrumbInjection?.separator.value }} </template>
        <IconChevronRight v-else />
      </slot>
    </span>
  </div>
</template>
