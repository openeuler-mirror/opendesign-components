<script setup lang="ts">
import { provide, ref, nextTick, watch, computed } from 'vue';
import { tabInjectKey } from './provide';
import { IconAdd, IconChevronLeft, IconChevronRight } from '../_utils/icons';
import { tabProps } from './types';
import { vOnResize } from '../directives';
import { debounceRAF } from '../_utils/helper';
import { defaultSize, isPhonePad } from '../_utils/global';

const props = defineProps(tabProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: number, oldValue?: number): void;
  (e: 'change', value: string, oldValue?: string ): void;
  (e: 'delete', value: number): void;
  (e: 'delete', value: string): void;
  (e: 'add', evt: MouseEvent): void;
}>();

const activeKey = ref(props.modelValue);
const anchorStyle = ref<Record<string, string>>({});

const navWrapRef = ref<HTMLElement | null>(null);
const navsRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);

const valueSet: Array<string | number> = [];

let activeNavEl: HTMLElement | null = null;

const isScroll = ref(false);
const prevDisabled = ref(true);
const nextDisabled = ref(true);
const showArrow = computed(() => {
  return !isPhonePad.value && isScroll.value;
});

const scrollActiveNavIntoView = () => {
  if (isScroll.value && activeNavEl && navWrapRef.value) {
    const { offsetLeft } = activeNavEl;
    const { scrollLeft, clientWidth } = navWrapRef.value;
    const center = scrollLeft + clientWidth / 2;
    if (offsetLeft > center || offsetLeft < center) {
      navWrapRef.value?.scrollTo({
        left: offsetLeft - clientWidth / 2,
        behavior: 'smooth',
      });
    }
  }
};

const onWrapScroll = debounceRAF(() => {
  if (navWrapRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = navWrapRef.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollLeft + 1 >= scrollWidth - clientWidth;
  }
});
const updateNavScroll = () => {
  if (navWrapRef.value) {
    const { scrollWidth, clientWidth } = navWrapRef.value;
    isScroll.value = scrollWidth > clientWidth;
    if (isScroll.value) {
      nextTick(() => {
        onWrapScroll();
        scrollActiveNavIntoView();
      });
    }
  }
};

watch(
  () => props.modelValue,
  (v) => {
    activeKey.value = v;
  }
);
const updateAnchor = () => {
  nextTick(() => {
    if (!activeNavEl) {
      return;
    }
    const { clientWidth, offsetLeft } = activeNavEl;
    anchorStyle.value = {
      transform: `translate3d(${offsetLeft}px, 0px, 0px)`,
      width: `${clientWidth}px`,
    };
  });
};
watch(() => isScroll.value, updateAnchor);

// 更新tab当前选中值
const updateValue = (value: string | number, navEl: HTMLElement | null) => {
  emits('update:modelValue', value as string);
  activeNavEl = navEl;
  if (activeKey.value !== value) {
    emits('change', value as string, activeKey.value as string);
    activeKey.value = value;
  }

  if (navEl) {
    activeNavEl = navEl;
    updateAnchor();

    scrollActiveNavIntoView();
  }
};
const isAdding = ref(false);

// 初始化tab，如果没有选中项，默认第一个
const initValue = (value: string | number, navEl: HTMLElement | null) => {
  if (!valueSet.includes(value)) {
    valueSet.push(value);
  }

  if (activeKey.value === undefined || isAdding.value) {
    updateValue(value, navEl);
    isAdding.value = false;
  }

  if (activeKey.value === value && navEl) {
    activeNavEl = navEl;
    updateAnchor();
  }
};
// 删除页签
const onDeletePane = (value: string | number) => {
  emits('delete', value as  string);
  const idx = valueSet.indexOf(value);

  nextTick(updateNavScroll);

  if (activeKey.value === value) {
    activeKey.value = valueSet[idx > 0 ? idx - 1 : 0];
    emits('change', activeKey.value as string, value as string);
  }
  valueSet.splice(idx, 1);
};
// 添加页签
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
  if (!props.addInactive) {
    isAdding.value = true;
  }
  nextTick(updateNavScroll);
};
provide(tabInjectKey, {
  lazy: props.lazy,
  navsRef,
  bodyRef,
  activeValue: activeKey,
  updateValue,
  onDeletePane,
  initValue,
});
const onHeadResize = debounceRAF(() => {
  updateAnchor();
  updateNavScroll();
  scrollActiveNavIntoView();
});
const navScroll = (to: 'prev' | 'next') => {
  if (!navWrapRef.value) {
    return;
  }

  const { clientWidth } = navWrapRef.value;
  const i = to === 'prev' ? -1 : to === 'next' ? 1 : 0;
  navWrapRef.value.scrollBy({ left: i * clientWidth, behavior: 'smooth' });
};
</script>
<template>
  <div class="o-tab" :class="[`o-tab-${props.variant}`, `o-tab-${props.size || defaultSize}`]">
    <div
      v-on-resize="onHeadResize"
      class="o-tab-head"
      :class="[
        {
          'with-act': $slots.suffix || $slots.prefix,
          'show-line': props.line,
        },
        props.headerClass,
      ]"
    >
      <div v-if="$slots.prefix" class="o-tab-head-prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="o-tab-navs">
        <div :class="{ 'o-tab-navs-scrollable': isScroll }">
          <div v-if="showArrow" class="o-tab-nav-btn prev" :class="{ 'o-tab-nav-btn-disabled': prevDisabled }" @click="navScroll('prev')">
            <IconChevronLeft />
          </div>
          <div ref="navWrapRef" class="o-tab-navs-wrap o-hide-scrollbar" @scroll.passive="onWrapScroll">
            <div ref="navsRef" class="o-tab-nav-list"></div>
            <div v-if="props.variant === 'text'" class="o-tab-nav-anchor" :style="anchorStyle">
              <slot name="anchor">
                <div class="o-tab-nav-anchor-line"></div>
              </slot>
            </div>
          </div>
          <div v-if="showArrow" class="o-tab-nav-btn next" :class="{ 'o-tab-nav-btn-disabled': nextDisabled }" @click="navScroll('next')">
            <IconChevronRight />
          </div>
        </div>

        <div v-if="props.addable" class="o-tab-nav-add" @click="onAddNav">
          <IconAdd />
        </div>
      </div>
      <div v-if="$slots.suffix" class="o-tab-head-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div ref="bodyRef" class="o-tab-body">
      <slot></slot>
    </div>
  </div>
</template>
