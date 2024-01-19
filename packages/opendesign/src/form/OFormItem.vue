<script setup lang="ts">
import { computed, ref, provide } from 'vue';
import { RequiredRuleT, formItemProps, TriggerT, FieldResultT } from './types';
import { formItemInjectKey } from './provide';
import { getFlexValue, normalizeRules } from './form';
import { isArray } from '../_utils/is';
import { asyncSome } from '../_utils/helper';

const requireSymbol = '*';

const props = defineProps(formItemProps);

const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));
const isRequired = computed(() => {
  if (props.required) {
    return true;
  } else if (isArray(props.rules)) {
    return props.rules.some((item) => (item as RequiredRuleT).required === true);
  }
  return false;
});
const rules = computed(() => normalizeRules(props.rules));

const fieldResult = ref<FieldResultT | null>(null);

const runValidate = (trigger: TriggerT, value: any) => {
  fieldResult.value = null;
  return asyncSome(rules.value, async (item) => {
    if (item.triggers?.includes(trigger)) {
      const rlt = await item.validator?.(value);
      if (rlt?.type === 'danger') {
        fieldResult.value = {
          type: 'danger',
          message: [rlt.message],
        };
        return true;
      } else if (rlt?.type === 'warning') {
        if (!fieldResult.value) {
          fieldResult.value = {
            type: 'warning',
            message: [rlt.message],
          };
        } else if (rlt.message) {
          fieldResult.value.message?.push(rlt.message);
        }
        return false;
      }
      return false;
    }
  });
};

const fieldHandlers = {
  onChange(val: any) {
    runValidate('change', val).then((r) => {
      console.log('fieldResult', r, fieldResult.value);
    });
  },
};

provide(formItemInjectKey, {
  fieldHandlers,
  fieldResult,
});
</script>
<template>
  <div
    class="o-form-item"
    :class="[
      {
        'is-required': isRequired,
        'o-form-item-danger': fieldResult?.type === 'danger',
        'o-form-item-warning': fieldResult?.type === 'warning',
      },
    ]"
    :style="{
      '--form-label-width': props.labelWidth,
      '--form-label-align': align,
      '--form-label-justify': justify,
    }"
  >
    <div class="o-form-item-label">
      <span
        class="o-form-require-symbol"
        :class="{
          visible: isRequired,
        }"
      >
        <slot name="symbol">{{ requireSymbol }}</slot>
      </span>
      <slot name="name">
        <span>{{ props.label }}</span>
      </slot>
    </div>
    <div class="o-form-item-main">
      <slot></slot>
      <div v-if="fieldResult?.message" class="o-form-item-message" :class="`type-${fieldResult.type}`">
        <slot name="message" :message="fieldResult?.message" :type="fieldResult?.type">
          <div v-if="!isArray(fieldResult?.message)">{{ fieldResult?.message }}</div>
          <template v-else>
            <div v-for="item in fieldResult?.message" :key="item">{{ item }}</div>
          </template>
        </slot>
      </div>
      <div v-if="$slots.extra" class="o-form-item-extra">
        <slot name="extra"> </slot>
      </div>
    </div>
  </div>
</template>
