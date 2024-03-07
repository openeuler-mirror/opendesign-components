<script setup lang="ts">
import { computed, ref, provide, inject, onMounted, onBeforeUnmount } from 'vue';
import { RequiredRuleT, formItemProps, TriggerT, FieldResultT } from './types';
import { formItemInjectKey, formInjectKey, formCtx } from './provide';
import { getFlexValue, normalizeRules } from './form';
import { isArray } from '../_utils/is';
import { asyncSome, getValueByPath, setValueByPath } from '../_utils/helper';
import { logger } from '../_utils/log';

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

const rules = computed(() => normalizeRules(props.rules, props.required));
const ruleTriggers = computed(() => {
  let triggers: TriggerT[] = [];
  rules.value.forEach((item) => {
    if (item.triggers) {
      triggers = triggers.concat(item.triggers);
    }
  });
  return Array.from(new Set(triggers));
});

const fieldResult = ref<FieldResultT | null>(null);

const initialVal = formInject.model && props.field ? getValueByPath(formInject.model, props.field) : void 0;

const runValidate = (trigger: TriggerT = 'change') => {
  if (!props.field || !formInject.model) {
    return;
  }
  // 判断该事件是否存在校验规则
  if (!ruleTriggers.value.includes(trigger)) {
    return;
  }
  const value = getValueByPath(formInject.model, props.field);
  // logger.info(trigger, props.field, value);

  fieldResult.value = null;
  return asyncSome(rules.value, async (item) => {
    if (item.triggers?.includes(trigger)) {
      if (!item.validator) {
        return false;
      }
      try {
        const rlt = await item.validator?.(value);
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
        logger.error('failed to validate rules');
      }

      return false;
    }
  });
};

const clearValidate = () => {
  if (!props.field || !formInject.model) {
    return;
  }
  fieldResult.value = null;
};

const resetFiled = () => {
  if (formInject.model && props.field) {
    setValueByPath(formInject.model, props.field, initialVal);
  }
};

const fieldHandlers = {
  onChange() {
    runValidate('change');
  },
  onFocus() {
    runValidate('focus');
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
    // logger.info('addFiled', props.field);
  }
});

onBeforeUnmount(() => {
  if (props.field) {
    formInject.removeFiled?.(props.field);
    // logger.info('removeFiled', props.field);
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
