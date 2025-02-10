<script setup lang="ts">
import { computed, ref, provide, inject, onMounted, onBeforeUnmount } from 'vue';
import { RequiredRuleT, formItemProps, TriggerT, FieldResultT } from './types';
import { formItemInjectKey, formInjectKey, formCtx } from './provide';
import { getFlexValue, groupRules } from './form';
import { isArray } from '../_utils/is';
import { asyncSome, getValueByPath, moveToFirst, setValueByPath } from '../_utils/helper';
import { log } from '../_utils/log';

const requireSymbol = '*';

const props = defineProps(formItemProps);

const formInject = inject<Partial<formCtx>>(formInjectKey, {});

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

const rules = computed(() => groupRules(props.rules, props.required));
const ruleTriggers = computed(() => {
  const t = Object.keys(rules.value) as TriggerT[];

  return moveToFirst(t, 'change');
});

const fieldResult = ref<FieldResultT>(null);

const initialVal = formInject.model?.value && props.field ? getValueByPath(formInject.model.value, props.field) : void 0;

const runValidate = async (trigger?: TriggerT): Promise<FieldResultT> => {
  if (!props.field || !formInject.model?.value) {
    return null;
  }

  const validators = rules.value[trigger || props.defaultTrigger || ruleTriggers.value[0]];
  // 判断该事件是否存在校验规则
  if (!validators || validators.length === 0) {
    return null;
  }

  const value = getValueByPath(formInject.model.value, props.field);

  fieldResult.value = null;
  await asyncSome(validators, async (validatorFn) => {
    try {
      const rlt = await validatorFn?.(value);
      if (rlt?.type === 'danger') {
        fieldResult.value = {
          type: 'danger',
          message: rlt.message ? [rlt.message] : [],
        };
        return true;
      } else if (rlt?.type === 'warning') {
        if (!fieldResult.value) {
          fieldResult.value = {
            type: 'warning',
            message: rlt.message ? [rlt.message] : [],
          };
        } else if (rlt.message) {
          fieldResult.value.message?.push(rlt.message);
        }
        return false;
      }
    } catch (e) {
      log.error('failed to validate rules');
    }
  });
  return fieldResult.value;
};

const clearValidate = () => {
  if (!props.field || !formInject.model?.value) {
    return;
  }
  fieldResult.value = null;
};

const resetFiled = () => {
  if (formInject.model?.value && props.field) {
    setValueByPath(formInject.model.value, props.field, initialVal);
  }
};

const fieldHandlers = {
  runValidate: runValidate,
  onChange() {
    runValidate('change');
  },
  onFocus() {
    runValidate('focus');
  },
  onInput() {
    runValidate('input');
  },
  onBlur() {
    runValidate('blur');
  },
};

onMounted(() => {
  if (props.field) {
    formInject.addFiled?.({
      filed: props.field,
      validate: runValidate,
      clearValidate,
      resetFiled,
    });
  }
});

onBeforeUnmount(() => {
  if (props.field) {
    formInject.removeFiled?.(props.field);
  }
});
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
        'o-form-item-required': isRequired,
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
      <slot name="label">
        <span>{{ props.label }}</span>
      </slot>
    </div>
    <div class="o-form-item-main">
      <div class="o-form-item-main-wrap">
        <slot></slot>
      </div>
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
