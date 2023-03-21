<script setup lang="ts">
import { computed } from 'vue';
import { dialogProps } from './types';
import { OFigure } from '../figure';
import HtmlTag from '../_shared/components/html-tag';

const props = defineProps(dialogProps);

const hasContent = computed(() => {
  return props.title || props.content;
});
</script>
<template>
  <HtmlTag
    :tag="!!props.href ? 'a' : 'div'"
    :href="props.href"
    class="o-card"
    tabindex="-1"
    :class="[
      `o-card-${props.size}`,
      `o-card-layout-${props.layout}`,
      {
        'o-card-hoverable': props.hoverable || !!props.href,
      },
    ]"
    :style="{
      '--card-title-max-row': props.titleMaxRow,
      '--card-detail-max-row': props.detailMaxRow,
    }"
  >
    <slot name="card">
      <div
        v-if="$slots.cover || props.cover"
        class="o-card-cover"
        :class="[
          props.coverClass,
          `o-card-cover-${props.layout}`,
          {
            'o-card-only-cover': !hasContent && !$slots.title && !$slots.default,
          },
        ]"
      >
        <slot name="cover">
          <OFigure :ratio="props.coverRatio" class="o-card-cover-img" :src="props.cover" :class="{ 'is-full': !props.coverRatio }" />
        </slot>
      </div>
      <div v-if="hasContent || $slots.title || $slots.main || $slots.default" class="o-card-main">
        <slot name="main">
          <div>
            <div v-if="props.title || $slots.title" class="o-card-title">
              <slot name="title">{{ props.title }}</slot>
            </div>
            <div class="o-card-content">
              <div v-if="props.content" class="o-card-detail">{{ props.content }}</div>
              <slot></slot>
            </div>
          </div>
          <div v-if="$slots.actions" class="o-card-actions">
            <slot name="actions"></slot>
          </div>
        </slot>
      </div>
    </slot>
  </HtmlTag>
</template>
