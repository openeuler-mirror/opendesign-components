<script setup lang="ts">
import { provide, computed } from 'vue';
import { formInjectKey } from './provide';
import { formProps, FiledInfoT } from './types';
import { getFlexValue } from './form';
import { isFunction } from '../_utils/is';
const props = defineProps(formProps);

const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));

const filedList: FiledInfoT[] = [];

const addFiled = (filedItem: FiledInfoT) => {
  filedList.push(filedItem);
};
const removeFiled = (filed: string) => {
  const idx = filedList.findIndex((item) => item.filed === filed);
  filedList.splice(idx, 1);
};

const doValidate = (filed?: string | string[]) => {
  const filedNames = filed ? ([] as string[]).concat(filed) : [];

  filedList.forEach((item) => {
    if (filedNames.length === 0 || (item.filed && filedNames.includes(item.filed))) {
      item?.validate?.('change');
    }
  });
};
const clearValidate = (filed?: string | string[], onClear?: (filed: FiledInfoT) => void) => {
  const filedNames = filed ? ([] as string[]).concat(filed) : [];
  filedList.forEach((item) => {
    if (filedNames.length === 0 || (item.filed && filedNames.includes(item.filed))) {
      item.clearValidate();
      if (isFunction(onClear)) {
        onClear(item);
      }
    }
  });
};
const resetFields = (filed?: string | string[]) => {
  clearValidate(filed, (item: FiledInfoT) => {
    // 重置表单
    item.resetFiled();
  });
};

const onSubmit = () => {
  doValidate();
};

provide(formInjectKey, {
  model: props.model,
  addFiled,
  removeFiled,
});

defineExpose({
  validate: doValidate,
  resetFields,
  clearValidate,
});
</script>
<template>
  <form
    class="o-form"
    :class="[
      {
        'o-form-has-required': props.hasRequired,
      },
      `o-form-layout-${props.layout}`,
    ]"
    :style="{
      '--form-label-width': props.labelWidth,
      '--form-label-align': props.labelAlign,
      '--form-label-justify': justify,
      '--form-item-align': align,
    }"
    @submit.prevent="onSubmit"
  >
    <slot></slot>
  </form>
</template>
