<script setup lang="ts">
import { Ref, provide, ref } from 'vue';
import { tabsInjectKey } from './provide';

interface SelectPropT {
  /**
   * tab选中的nav值
   * v-model
   */
  modelValue: string | number;
}

const props = withDefaults(defineProps<SelectPropT>(), {
  modelValue: '',
});

const activeVal = ref(props.modelValue);
const tabNavs = ref<Array<string | number>>([]);
const navRefs: Record<string | number, Ref<HTMLElement | undefined>> = {};
const getNavRef = (el: HTMLElement, value: string | number) => {
  navRefs[value].value = el;
};

provide(tabsInjectKey, {
  value: activeVal,
  navRefs,
  addTabNav(value) {
    navRefs[value] = ref();
    if (!tabNavs.value.includes(value)) {
      tabNavs.value.push(value);
    }
  },
});
</script>
<template>
  <div class="o-tabs">
    <div class="o-tabs-head">
      <div class="o-tabs-navs">
        <div v-for="item in tabNavs" :key="item" :ref="(el) => getNavRef(el as HTMLElement, item)" class="o-tabs-nav"></div>
      </div>
    </div>
    <div class="o-tabs-body">
      <slot></slot>
    </div>
  </div>
</template>
