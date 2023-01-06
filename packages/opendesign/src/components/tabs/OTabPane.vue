<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { tabsInjectKey } from './provide';

interface SelectPropT {
  /**
   * 下拉框的值
   */
  value: string | number;
  label?: string;
}

const props = withDefaults(defineProps<SelectPropT>(), {
  value: new Date().getTime,
  label: undefined,
});

const tabsInjection = inject(tabsInjectKey);

// nav 插槽处理
const navRef = ref();

function init() {
  if (!tabsInjection) {
    console.warn('OTabPane should used in OTabs!');
    return;
  }

  const { addTabNav, navRefs } = tabsInjection;
  // 增加tab项
  addTabNav(props.value);

  // 将nav插槽内容移到父容器中
  watch(
    navRefs[props.value],
    (el) => {
      navRef.value = el;
    },
    { immediate: true }
  );
}

init();
</script>
<template>
  <div class="o-tab-pane" :class="{ active: tabsInjection?.value.value === props.value }">
    <Teleport v-if="navRef" :to="navRef">
      <slot name="nav">{{ props.label || props.value }}</slot>
    </Teleport>
    <slot></slot>
  </div>
</template>
