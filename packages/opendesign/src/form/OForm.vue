<script setup lang="ts">
import { provide, computed } from 'vue';
import { formInjectKey } from './provide';
import { formProps, FiledInfoT, FieldResultT } from './types';
import { getFlexValue } from './form';
import { isFunction } from '../_utils/is';
const props = defineProps(formProps);

const emits = defineEmits<{
  (e: 'submit', results: FieldResultT[]): void;
  (e: 'validate', results: FieldResultT[]): void;
  (e: 'clear', filed?: string | string[]): void;
  (e: 'reset', filed?: string | string[]): void;
}>();

const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));

const filedList: FiledInfoT[] = [];

const doValidate = (filed?: string | string[]) => {
  const filedNames = filed ? ([] as string[]).concat(filed) : [];

  const list = filedList.map((item) => {
    if (filedNames.length === 0 || (item.filed && filedNames.includes(item.filed))) {
      return item.validate ? item.validate() : null;
    }
    return null;
  });

  return Promise.all(list).then((rlt) => {
    emits('validate', rlt);
    return rlt;
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
  emits('clear', filed);
};

const addFiled = (filedItem: FiledInfoT) => {
  filedList.push(filedItem);
};

const removeFiled = (filed: string) => {
  const idx = filedList.findIndex((item) => item.filed === filed);
  filedList.splice(idx, 1);
};

const resetFields = (filed?: string | string[]) => {
  clearValidate(filed, (item: FiledInfoT) => {
    // 重置表单
    item.resetFiled();
  });
  emits('reset', filed);
};

const onSubmit = () => {
  doValidate().then((rlt) => {
    emits('submit', rlt);
  });
};

provide(formInjectKey, {
  model: computed(() => props.model),
  addFiled,
  removeFiled,
});

defineExpose({
  /** expose: validate form */
  validate: doValidate,
  /** expose: reset form */
  resetFields,
  /** expose: clear validate state */
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
