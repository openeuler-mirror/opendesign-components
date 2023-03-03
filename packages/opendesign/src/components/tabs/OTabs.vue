<script setup lang="ts">
import { computed, provide, reactive, ref, nextTick } from 'vue';
import { tabsInjectKey, TabNavData } from './provide';
import TabNav from './TabNav.vue';
import TabContent from './TabContent.vue';
import { IconAdd } from '../_shared/icons';
import { tabsProps } from './types';

const props = defineProps(tabsProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number, oldValue: string | number): void;
  (e: 'delete', value: string | number): void;
  (e: 'add', evt: MouseEvent): void;
}>();

const activeKey = ref(props.modelValue);
const archorStyle = ref<Record<string, string>>({});

const tabsMap = reactive(new Map<string | number, TabNavData>());
const addTabItem = (tabKey: string | number, tabData: TabNavData) => {
  tabsMap.set(tabKey, tabData);
};
const removeTabItem = (tabKey: string | number) => {
  tabsMap.delete(tabKey);
};
// nav构造数据
const navList = computed(() => {
  const rlt: TabNavData[] = [];
  tabsMap.forEach((val) => {
    rlt.push(val);
  });

  return rlt;
});

const navKeys = computed(() => {
  const keys = navList.value.map((item) => item.value);

  return keys;
});

const activeValue = computed(() => {
  if (!navKeys.value.includes(activeKey.value)) {
    emits('update:modelValue', navKeys.value[0]);

    return navKeys.value[0];
  }
  return activeKey.value;
});

provide(tabsInjectKey, {
  lazy: props.lazy,
  addTabItem,
});
const updateArchor = (el: HTMLElement) => {
  nextTick(() => {
    const { clientWidth, offsetLeft } = el;
    archorStyle.value = {
      transform: `translate3d(${offsetLeft}px, 0px, 0px)`,
      width: `${clientWidth}px`,
    };
  });
};

let activeEl: HTMLElement | null = null;
const onNavSelect = (value: string | number, el: HTMLElement) => {
  if (el) {
    updateArchor(el);
    activeEl = el;
  }
};
// nav选择
const onNavClick = (value: string | number) => {
  if (activeValue.value !== value) {
    emits('change', value, activeValue.value);
    activeKey.value = value;
    emits('update:modelValue', value);
  }
};

// 删除页签
const onDeleteNav = (value: string | number) => {
  removeTabItem(value);
  emits('delete', value);
  if (activeEl) {
    updateArchor(activeEl);
  }
};
// 添加页签
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
};
</script>
<template>
  <div class="o-tabs">
    <slot></slot>
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
      <div
        class="o-tabs-navs"
        :style="{
          'justify-content': props.navJustify,
        }"
      >
        <TabNav
          v-for="item in navList"
          :key="item.value"
          class="o-tabs-nav"
          :active-value="activeValue"
          v-bind="item"
          @click="onNavClick"
          @select="onNavSelect"
          @delete="onDeleteNav"
        />
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
    <div class="o-tabs-body">
      <TabContent v-for="item in navList" :key="item.value" class="o-tab-pane" :active-value="activeValue" v-bind="item" />
    </div>
  </div>
</template>
