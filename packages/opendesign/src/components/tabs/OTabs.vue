<script setup lang="ts">
import { provide, ref, nextTick } from 'vue';
import { tabsInjectKey } from './provide';
import { IconAdd } from '../_shared/icons';
import { tabsProps } from './types';
import { OResizeObserver } from '../resize-observer';

const props = defineProps(tabsProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number, oldValue?: string | number): void;
  (e: 'delete', value: string | number): void;
  (e: 'add', evt: MouseEvent): void;
}>();

const activeKey = ref(props.modelValue);
const archorStyle = ref<Record<string, string>>({});

const navsRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);

const valueSet: Array<string | number> = [];

let activeNavEl: HTMLElement | null = null;

const updateArchor = () => {
  nextTick(() => {
    if (!activeNavEl) {
      return;
    }
    const { clientWidth, offsetLeft } = activeNavEl;
    archorStyle.value = {
      transform: `translate3d(${offsetLeft}px, 0px, 0px)`,
      width: `${clientWidth}px`,
    };
  });
};

// 更新tab当前选中值
const updateValue = (value: string | number, navEl: HTMLElement | null) => {
  emits('update:modelValue', value);
  activeNavEl = navEl;
  if (activeKey.value !== value) {
    emits('change', value, activeKey.value);
    activeKey.value = value;
  }

  if (navEl) {
    activeNavEl = navEl;
    updateArchor();
  }
};

// 初始化tab，如果没有选中项，默认第一个
const initValue = (value: string | number, navEl: HTMLElement | null) => {
  if (!valueSet.includes(value)) {
    valueSet.push(value);
  }

  if (activeKey.value === undefined) {
    updateValue(value, navEl);
  }

  if (activeKey.value === value && navEl) {
    activeNavEl = navEl;
    updateArchor();
  }
};
// 删除页签
const onDeletePane = (value: string | number) => {
  emits('delete', value);
  const idx = valueSet.indexOf(value);

  if (activeKey.value === value) {
    activeKey.value = valueSet[idx > 0 ? idx - 1 : 0];
    emits('change', activeKey.value, value);
  }
  valueSet.splice(idx, 1);
};
// 添加页签
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
};
provide(tabsInjectKey, {
  lazy: props.lazy,
  navsRef,
  bodyRef,
  activeValue: activeKey,
  updateValue,
  onDeletePane,
  initValue,
});
const onHeadResize = () => {
  updateArchor();
};
</script>
<template>
  <div class="o-tabs">
    <OResizeObserver @resize="onHeadResize">
      <div
        class="o-tabs-head"
        :class="[
          `o-tabs-${props.variant}`,
          {
            'with-act': $slots.suffix || $slots.prefix,
            'show-line': props.line,
          },
        ]"
      >
        <div v-if="$slots.prefix" class="o-tabs-head-prefix">
          <slot name="prefix"></slot>
        </div>
        <div class="o-tabs-navs">
          <div ref="navsRef" class="o-tabs-navs-wrap"></div>
          <div v-if="props.variant === 'text'" class="o-tab-nav-archor" :style="archorStyle">
            <slot name="archor">
              <div class="o-tab-nav-archor-line"></div>
            </slot>
          </div>
          <div v-if="props.addable" class="o-tab-nav-add" @click="onAddNav">
            <IconAdd />
          </div>
        </div>
        <div v-if="$slots.suffix" class="o-tabs-head-suffix">
          <slot name="suffix"></slot>
        </div>
      </div>
    </OResizeObserver>
    <div ref="bodyRef" class="o-tabs-body">
      <slot></slot>
    </div>
  </div>
</template>
