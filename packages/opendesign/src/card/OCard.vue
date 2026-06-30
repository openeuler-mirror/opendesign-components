<script setup lang="ts">
import { computed, ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { cardProps } from './types';
import { OFigure } from '../figure';
import HtmlTag from '../_components/html-tag';
import ClientOnly from '../_components/client-only.ts';
import { isString, isUndefined } from '../_utils/is';
import { mergeClass } from '../_utils/vue-utils';
import { OPopover } from '../popover';
import { useElementOverflown } from '../hooks';

const props = defineProps(cardProps);

const slots = defineSlots<{
  default(): any;
  card(): any;
  main(): any;
  icon(): any;
  title(): any;
  header(): any;
  footer(): any;
  detail(): any;
  cover(): any;
}>();

const showFadeOut = computed(() => {
  return props.textOverflow === 'fade';
});

const hasMain = computed(
  () => slots.main || props.icon || slots.icon || props.title || slots.title || slots.header || props.detail || slots.detail || slots.default,
);

const isTitleLimited = computed(() => {
  return !isUndefined(props.titleMaxRow);
});
const isDetailLimited = computed(() => {
  return !isUndefined(props.detailMaxRow) && showFadeOut.value;
});

const hasCover = computed(() => {
  return Boolean(slots.cover || props.cover);
});

const hasTitleIcon = computed(() => {
  return props.titleIcon;
});

// 支持超出隐藏，hover时popover提示，并添加响应式
const cardRef = ref<InstanceType<typeof HtmlTag>>();
const titleRef = ref<HTMLDivElement>();
const detailRef = ref<HTMLDivElement>();
const isTitleOverflow = useElementOverflown(titleRef);
const isDetailOverflow = useElementOverflown(detailRef);
const { width: cardWidth } = useElementBounding(cardRef);

const popoverStyle = computed(() => ({
  '--card-popover-width': cardWidth.value ? `${cardWidth.value * 0.8}px` : undefined,
}));
</script>

<template>
  <HtmlTag
    ref="cardRef"
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
        'o-card-cover': hasCover,
      },
    ]"
  >
    <slot name="card">
      <!-- cover -->
      <div
        v-if="hasCover"
        class="o-card-cover"
        :class="
          mergeClass(
            `o-card-cover-${props.layout}`,
            {
              'o-card-only-cover': !hasMain,
            },
            props.coverClass,
          )
        "
      >
        <slot name="cover">
          <OFigure
            v-if="props.cover"
            :ratio="props.coverRatio"
            class="o-card-cover-img"
            :src="props.cover"
            :fit="props.coverFit"
            :class="{ 'is-full': !props.coverRatio }"
          />
        </slot>
      </div>
      <div v-if="!!hasMain" class="o-card-main">
        <slot name="main">
          <!-- icon -->
          <div v-if="props.icon || !!slots.icon" class="o-card-icon">
            <slot name="icon">
              <OFigure v-if="isString(props.icon)" :src="props.icon" />
              <component :is="props.icon" v-else />
            </slot>
          </div>
          <div class="o-card-main-wrap">
            <div>
              <!-- header -->
              <div
                v-if="props.title || !!slots.header || !!slots.title"
                :class="{
                  'o-card-header': true,
                  'o-card-header-with-icon': hasTitleIcon,
                }"
              >
                <slot name="header">
                  <div v-if="hasTitleIcon" class="o-card-title-icon">
                    <OFigure v-if="isString(props.titleIcon)" :src="props.titleIcon" class="o-card-title-icon-figure" />
                    <component :is="props.titleIcon" v-else />
                  </div>
                  <div
                    v-if="props.title"
                    ref="titleRef"
                    class="o-card-title"
                    :class="{ 'o-card-title-limited': isTitleLimited }"
                    :style="{ '--card-title-row': props.titleRow, '--card-title-max-row': props.titleMaxRow }"
                  >
                    <slot name="title">
                      {{ props.title }}
                    </slot>
                  </div>
                  <ClientOnly>
                    <OPopover
                      v-if="isTitleOverflow && props.showOverflowTooltip"
                      :offset="12"
                      :target="titleRef"
                      :adjust-min-width="false"
                      :adjust-width="false"
                      position="bottom"
                      class="o-card-popover"
                      :style="popoverStyle"
                      >{{ props.title }}</OPopover
                    >
                  </ClientOnly>
                </slot>
              </div>
              <!-- content -->
              <div class="o-card-content">
                <div
                  v-if="props.detail || !!slots.detail"
                  ref="detailRef"
                  class="o-card-detail"
                  :class="{ 'o-card-detail-limited': isDetailLimited }"
                  :style="{ '--card-detail-row': props.detailRow, '--card-detail-max-row': props.detailMaxRow }"
                >
                  <slot name="detail">
                    {{ props.detail }}
                  </slot>
                </div>
                <ClientOnly>
                  <OPopover
                    v-if="isDetailOverflow && props.showOverflowTooltip"
                    :offset="12"
                    :target="detailRef"
                    :adjust-min-width="false"
                    :adjust-width="false"
                    position="bottom"
                    class="o-card-popover"
                    :style="popoverStyle"
                    >{{ props.detail }}</OPopover
                  >
                </ClientOnly>
                <slot></slot>
              </div>
            </div>
            <!-- footer -->
            <div v-if="!!slots.footer" class="o-card-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </slot>
      </div>
    </slot>
  </HtmlTag>
</template>
