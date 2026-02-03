<script setup lang="ts">
import { provide, ref, nextTick, watch, computed, toValue, onMounted } from 'vue';
import { useMutationObserver } from '@vueuse/core';

import { TabChildData, tabInjectKey } from './provide';
import { IconAdd, IconChevronLeft, IconChevronRight, IconClose } from '../_utils/icons';
import { tabProps } from './types';
import { vOnResize } from '../directives';
import { debounceRAF } from '../_utils/helper';
import { defaultSize } from '../_utils/global';
import { useScreen } from '../hooks';
import { mergeClass } from '../_utils/vue-utils';
import { getRoundClass } from '../_utils/style-class';

const props = defineProps(tabProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number, oldValue?: string | number): void;
  (e: 'delete', value: string | number): void;
  (e: 'add', evt: MouseEvent): void;
}>();

const round = getRoundClass(props, 'tab-btn');

const { isPhonePad } = useScreen();

const activeKey = ref(props.modelValue);
const anchorStyle = ref<Record<string, string>>({});

const navWrapRef = ref<HTMLDivElement>();
const navsRef = ref<HTMLDivElement>();
const bodyRef = ref<HTMLDivElement>();

const childrenMap = ref<
  Record<
    string,
    TabChildData & {
      navEl?: HTMLDivElement;
    }
  >
>({});
/** 通过遍历dom获取的顺序正确的value列表，但都是字符串 */
const stringValueSet = ref<string[]>([]);
const gatherChildren = () => {
  if (!bodyRef.value) {
    return;
  }
  stringValueSet.value = [];
  Array.from(bodyRef.value.children).forEach((el) => {
    if (!el.classList.contains('o-tab-pane')) {
      return;
    }
    const paneKey = el.getAttribute('data-tab-pane-key');
    if (paneKey) {
      stringValueSet.value.push(paneKey);
    }
  });
};
useMutationObserver(
  bodyRef,
  async (mutations) => {
    if (!mutations[0]) {
      return;
    }
    await nextTick();
    gatherChildren();
  },
  {
    childList: true,
  },
);
onMounted(() => gatherChildren());

let activeNavEl: HTMLElement | undefined;

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
  if (navWrapRef.value && navsRef.value) {
    const { clientWidth: wrapWidth } = navWrapRef.value;
    const { clientWidth: width } = navsRef.value;
    isScroll.value = wrapWidth < width;
    if (isScroll.value) {
      nextTick(() => {
        onWrapScroll();
        scrollActiveNavIntoView();
      });
    }
  }
};

const updateAnchor = () => {
  if (!activeNavEl) {
    return;
  }
  const { clientWidth, offsetLeft } = activeNavEl;
  anchorStyle.value = {
    transform: `translate3d(${offsetLeft}px, 0px, 0px)`,
    width: `${clientWidth}px`,
  };
};
watch(() => isScroll.value, updateAnchor);

const setNavEl = (el: any, stringValue: string) => {
  childrenMap.value[stringValue].navEl = el as HTMLDivElement;
  if (el) {
    childrenMap.value[stringValue].setNavMounted();
  }
};
// 更新tab当前选中值
const updateValue = async (value: string | number) => {
  const { paneKey, navMounted } = childrenMap.value[value];
  const _value = toValue(paneKey);
  emits('update:modelValue', _value);
  if (activeKey.value !== _value) {
    emits('change', _value, activeKey.value);
    activeKey.value = _value;
  }
  await navMounted;
  const { navEl } = childrenMap.value[value];
  activeNavEl = navEl;
  if (navEl) {
    activeNavEl = navEl;
    updateAnchor();
    scrollActiveNavIntoView();
  }
};
watch(
  () => props.modelValue,
  (v) => {
    activeKey.value = v;
    if (v) {
      updateValue(v);
    }
  },
);

// 删除页签
const onDeletePane = (e: MouseEvent, value: string) => {
  e.stopImmediatePropagation();
  const { paneKey } = childrenMap.value[value];
  const _value = toValue(paneKey);
  emits('delete', _value);
  const idx = stringValueSet.value.indexOf(value);

  if (activeKey.value === _value) {
    const targetStringValue = stringValueSet.value[idx > 0 ? idx - 1 : 0];
    activeKey.value = toValue(childrenMap.value[targetStringValue].paneKey);
    emits('change', activeKey.value, _value);
  }
  stringValueSet.value.splice(idx, 1);
};

const isAdding = ref(false);
// 添加页签
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
  if (!props.addInactive) {
    isAdding.value = true;
  }
};
provide(tabInjectKey, {
  lazy: props.lazy,
  activeValue: activeKey,
  registerChild(child) {
    childrenMap.value[toValue(child.paneKey).toString()] = child;
  },
  handleChildMounted(paneKey) {
    // 初始化tab，如果没有选中项，默认第一个
    if (activeKey.value === undefined || isAdding.value) {
      updateValue(paneKey);
      isAdding.value = false;
      return;
    }

    if (activeKey.value === paneKey) {
      updateAnchor();
      return;
    }
  },
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
  <div
    class="o-tab"
    :class="[
      `o-tab-${props.variant}`,
      { 'o-tab-button-inverse': props.variant === 'button' && props.buttonInverse },
      `o-tab-${props.size || defaultSize}`,
      round.class.value,
    ]"
    :style="round.style.value"
  >
    <div
      class="o-tab-head"
      :class="
        mergeClass(
          {
            'with-act': !!$slots.suffix || !!$slots.prefix,
            'show-line': !!props.line && props.variant !== 'button',
          },
          props.headerClass,
        )
      "
    >
      <div v-if="$slots.prefix" class="o-tab-head-prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="o-tab-navs">
        <div :class="{ 'o-tab-navs-scrollable': isScroll }" class="o-tab-navs-container">
          <div v-if="showArrow" class="o-tab-nav-btn prev" :class="{ 'o-tab-nav-btn-disabled': prevDisabled }" @click="navScroll('prev')">
            <IconChevronLeft />
          </div>
          <div ref="navWrapRef" v-on-resize="onHeadResize" class="o-tab-navs-wrap o-hide-scrollbar" @scroll.passive="onWrapScroll">
            <div ref="navsRef" v-on-resize="onHeadResize" class="o-tab-nav-list">
              <template v-for="stringValue in stringValueSet" :key="stringValue">
                <div
                  v-if="childrenMap[stringValue]"
                  :ref="(el) => setNavEl(el, stringValue)"
                  :class="[
                    'o-tab-nav',
                    {
                      'o-tab-nav-active': activeKey?.toString() === stringValue,
                      'o-tab-nav-disabled': childrenMap[stringValue].props.disabled,
                      'o-tab-nav-closable': childrenMap[stringValue].props.closable,
                    },
                  ]"
                  @click="() => updateValue(stringValue)"
                >
                  <component v-if="childrenMap[stringValue].navRenderer" :is="childrenMap[stringValue].navRenderer" />
                  <template v-else>{{ childrenMap[stringValue].props.label || childrenMap[stringValue].props.value }}</template>
                  <div v-if="childrenMap[stringValue].props.closable" class="o-tab-nav-close" @click="(e) => onDeletePane(e, stringValue)"><IconClose /></div>
                </div>
              </template>
            </div>
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
