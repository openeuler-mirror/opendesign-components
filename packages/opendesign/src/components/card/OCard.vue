<script setup lang="ts">
import { computed } from 'vue';
import { cardProps } from './types';
import { OFigure } from '../figure';
import HtmlTag from '../_shared/components/html-tag';

const props = defineProps(cardProps);
const hasContent = computed(() => {
  return props.icon || props.title || props.detail;
});
</script>

<template>
  <HtmlTag
    :tag="!!props.href ? 'a' : 'div'"
    :href="props.href"
    class="o-card"
    tabindex="-1"
    :class="[
      `o-card-layout-${props.layout}`,
      {
        'o-card-hoverable': props.hoverable || !!props.href,
        'o-card-cursor-pointer': props.cursor === 'pointer' || !!props.href,
      },
    ]"
  >
    <slot name="card">
      <!-- cover -->
      <div
        v-if="$slots.cover || props.cover"
        class="o-card-cover"
        :class="[
          props.coverClass,
          `o-card-cover-${props.layout}`,
          {
            'o-card-only-cover': !hasContent && !$slots.header && !$slots.default && !$slots.footer,
          },
        ]"
      >
        <slot name="cover">
          <OFigure :ratio="props.coverRatio" class="o-card-cover-img" :src="props.cover" :class="{ 'is-full': !props.coverRatio }" />
        </slot>
      </div>
      <div v-if="hasContent || $slots.header || $slots.main || $slots.default" class="o-card-main">
        <slot name="main">
          <!-- icon -->
          <div v-if="props.icon || $slots.icon" class="o-card-icon">
            <slot name="icon">
              <component :is="props.icon" />
            </slot>
          </div>
          <div class="o-card-main-wrap">
            <div>
              <!-- header -->
              <div v-if="props.title || $slots.header" class="o-card-header">
                <slot name="header">
                  <div v-if="props.title" class="o-card-title">{{ props.title }}</div>
                </slot>
              </div>
              <!-- content -->
              <div class="o-card-content">
                <div v-if="props.detail" class="o-card-detail">{{ props.detail }}</div>
                <slot></slot>
              </div>
            </div>
            <!-- footer -->
            <div v-if="$slots.footer" class="o-card-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </slot>
      </div>
    </slot>
  </HtmlTag>
</template>
