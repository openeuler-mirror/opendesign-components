<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { cardProps } from './types';
import { OFigure } from '../figure';
import HtmlTag from '../_components/html-tag';
import { isString, isUndefined } from '../_utils/is';

const props = defineProps(cardProps);

const slots = useSlots();

const hasMain = computed(
  () => slots.main || props.icon || slots.icon || props.title || slots.title || slots.header || props.detail || slots.detail || slots.default
);

const isTitleLimited = computed(() => {
  return !isUndefined(props.titleMaxRow);
});
const isDetailLimited = computed(() => {
  return !isUndefined(props.detailMaxRow);
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
        'o-card-no-responsive': props.noResponsive,
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
            'o-card-only-cover': !hasMain,
          },
        ]"
      >
        <slot name="cover">
          <OFigure :ratio="props.coverRatio" class="o-card-cover-img" :src="props.cover" :fit="props.coverFit" :class="{ 'is-full': !props.coverRatio }" />
        </slot>
      </div>
      <div v-if="hasMain" class="o-card-main">
        <slot name="main">
          <!-- icon -->
          <div v-if="props.icon || $slots.icon" class="o-card-icon">
            <slot name="icon">
              <OFigure v-if="isString(props.icon)" :src="props.icon" />
              <component :is="props.icon" v-else />
            </slot>
          </div>
          <div class="o-card-main-wrap">
            <div>
              <!-- header -->
              <div v-if="props.title || $slots.header || $slots.title" class="o-card-header">
                <slot name="header">
                  <div
                    v-if="props.title"
                    class="o-card-title"
                    :class="{ 'o-card-title-limited': isTitleLimited }"
                    :style="{ '--card-title-row': props.titleRow, '--card-title-max-row': props.titleMaxRow }"
                  >
                    <slot name="title">
                      {{ props.title }}
                    </slot>
                  </div>
                </slot>
              </div>
              <!-- content -->
              <div class="o-card-content">
                <div
                  v-if="props.detail || $slots.detail"
                  class="o-card-detail"
                  :class="{ 'o-card-detail-limited': isDetailLimited }"
                  :style="{ '--card-detail-row': props.detailRow, '--card-detail-max-row': props.detailMaxRow }"
                >
                  <slot name="detail">
                    {{ props.detail }}
                  </slot>
                </div>
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
