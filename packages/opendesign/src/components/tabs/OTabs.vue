<script setup lang="ts">
import { computed, provide, reactive, ref } from 'vue';
import { tabsInjectKey, TabNavData } from './provide';
import TabNav from './TabNav.vue';
import TabContent from './TabContent.vue';
import { IconAdd } from '../_shared/icons';

interface SelectPropT {
  /**
   * tab选中的nav值
   * v-model
   */
  modelValue?: string | number;
  /**
   * 是否激活时再加载
   */
  lazy?: boolean;
  /**
   * 是否可以添加页签
   */
  addable?: boolean;
}

const props = withDefaults(defineProps<SelectPropT>(), {
  modelValue: '',
  lazy: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number, oldValue: string | number): void;
  (e: 'delete', value: string | number): void;
  (e: 'add', evt: MouseEvent): void;
}>();

const activeKey = ref(props.modelValue);

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
  value: activeValue,
  lazy: props.lazy,
  addTabItem,
  removeTabItem,
});

// nav选择
const onSelectNav = (value: string | number) => {
  emits('change', value, activeValue.value);
  activeKey.value = value;
  emits('update:modelValue', value);
};

// 删除页签
const onDeleteNav = (value: string | number) => {
  removeTabItem(value);
  emits('delete', value);
};
// 添加页签
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
};
</script>
<template>
  <div class="o-tabs">
    <slot></slot>
    <div class="o-tabs-head" :class="{ 'with-act': !!$slots.act }">
      <div class="o-tabs-navs">
        <TabNav
          v-for="item in navList"
          :key="item.value"
          class="o-tabs-nav"
          :active-value="activeValue"
          v-bind="item"
          @select="onSelectNav"
          @delete="onDeleteNav"
        />
        <div v-if="props.addable" class="o-tab-nav-add" @click="onAddNav">
          <IconAdd />
        </div>
      </div>
      <div v-if="$slots.act" class="o-tabs-act">
        <slot name="act"></slot>
      </div>
    </div>
    <div class="o-tabs-body">
      <TabContent v-for="item in navList" :key="item.value" class="o-tab-pane" :active-value="activeValue" v-bind="item" />
    </div>
  </div>
</template>
