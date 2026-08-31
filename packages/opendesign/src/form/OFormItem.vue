<script setup lang="ts">
import { computed, ref, watch, provide, inject, onMounted, onBeforeUnmount, toValue } from 'vue';
import { RequiredRuleT, formItemProps, TriggerT, FieldResultT, ValidateStatusT, ValidatorT } from './types';
import { RoundT, SizeT } from '../_utils/types';
import { formItemInjectKey, formInjectKey, formCtx } from './provide';
import { getFlexValue, groupRules, mergeRules } from './form';
import { isArray } from '../_utils/is';
import { asyncSome, getValueByPath, moveToFirst, setValueByPath } from '../_utils/helper';
import { log } from '../_utils/log';
import { IconAsterisk } from '../_utils/icons';

const props = defineProps(formItemProps);

const formInject = inject<Partial<formCtx>>(formInjectKey, {});

/**
 * @description Form model 的响应式解包，供模板和逻辑统一使用
 */
const formModel = computed<Record<string, any> | undefined>(() => toValue(formInject.model));

const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));

/**
 * @description 合并后的规则：FormItem 局部 rules 优先，否则取 Form 全局 rules
 */
const mergedRules = computed(() => mergeRules(toValue(formInject.rules), props.field, props.rules));

const isRequired = computed(() => {
  if (props.required) {
    return true;
  } else if (isArray(mergedRules.value)) {
    return mergedRules.value.some((item) => (item as RequiredRuleT).required === true);
  }
  return false;
});

/**
 * @description 合并后的 requiredIcon：FormItem requiredIcon 优先，否则继承 Form requiredIcon
 */
const mergedRequiredIcon = computed<boolean>(() => {
  if (props.requiredIcon !== undefined) {
    return props.requiredIcon;
  }
  return toValue(formInject.requiredIcon) ?? false;
});

/**
 * @description 合并后的 showMessage：FormItem showMessage 优先，否则继承 Form showMessage
 */
const mergedShowMessage = computed(() => {
  if (props.showMessage !== undefined) {
    return props.showMessage;
  }
  return toValue(formInject.showMessage) ?? true;
});

/**
 * @description 合并后的 size：FormItem size 优先，否则继承 Form size
 */
const mergedSize = computed<SizeT | undefined>(() => {
  return props.size || toValue(formInject.size);
});

/**
 * @description 合并后的 disabled：FormItem disabled 优先，否则继承 Form disabled
 */
const mergedDisabled = computed<boolean | undefined>(() => {
  if (props.disabled !== undefined) {
    return props.disabled;
  }
  return toValue(formInject.disabled);
});

/**
 * @description 合并后的 round：FormItem round 优先，否则继承 Form round
 */
const mergedRound = computed<RoundT | undefined>(() => {
  return props.round || toValue(formInject.round);
});

/**
 * @description 合并后的 clearable：FormItem clearable 优先，否则继承 Form clearable
 */
const mergedClearable = computed<boolean | undefined>(() => {
  if (props.clearable !== undefined) {
    return props.clearable;
  }
  return toValue(formInject.clearable);
});

const mergedLabelWidth = computed<string | undefined>(() => {
  return props.labelWidth || toValue(formInject.labelWidth);
});

/**
 * @description FormItem 级内联样式：labelWidth 为 'auto' 时不设 --form-label-width，由 OForm 的 JS 测量统一控制
 */
const formItemStyle = computed<Record<string, string | undefined>>(() => {
  const style: Record<string, string | undefined> = {
    '--form-label-align': align.value,
    '--form-label-justify': justify.value,
  };
  if (mergedLabelWidth.value && mergedLabelWidth.value !== 'auto') {
    style['--form-label-width'] = mergedLabelWidth.value;
  }
  return style;
});

/**
 * @description 分组后的校验规则：当 requiredIcon 为 true 时，required 仅作星号指示，不注入默认 required 校验
 */
const rules = computed(() => groupRules(mergedRules.value, mergedRequiredIcon.value ? false : props.required));
const ruleTriggers = computed(() => {
  const t = Object.keys(rules.value) as TriggerT[];
  return moveToFirst(t, 'change');
});

const fieldResult = ref<FieldResultT>(null);

/**
 * @description 手动设置的校验状态（error / validateStatus prop）
 */
const manualValidateStatus = ref<ValidateStatusT | undefined>(undefined);

/**
 * @description 合并后的校验状态：手动设置优先，否则取 fieldResult
 */
const mergedValidateStatus = computed<ValidateStatusT>(() => {
  if (manualValidateStatus.value) {
    return manualValidateStatus.value;
  }
  if (!fieldResult.value) {
    return '';
  }
  return fieldResult.value.type;
});

/**
 * @description 提供给子控件的校验结果：合并 manualValidateStatus 与 fieldResult，
 * 使子控件通过 useFormField 的 effectiveColor 感知 validateStatus prop 设置的状态
 */
const effectiveFieldResult = computed<FieldResultT>(() => {
  if (manualValidateStatus.value) {
    const type = manualValidateStatus.value;
    if (type === 'danger' || type === 'warning' || type === 'success') {
      return { type, message: fieldResult.value?.message ?? [] };
    }
  }
  return fieldResult.value;
});

const initialVal = ref<any>(undefined);

const runValidate = async (trigger?: TriggerT): Promise<FieldResultT> => {
  if (!props.field || !formModel.value) {
    return null;
  }

  /**
   * @description 有 trigger 时只校验该分组；无 trigger 时合并所有分组的校验函数，
   * 确保全量校验覆盖全部规则
   */
  let validators: ValidatorT[];
  if (trigger) {
    validators = rules.value[trigger] || [];
  } else if (props.defaultTrigger) {
    validators = rules.value[props.defaultTrigger] || [];
  } else {
    validators = ruleTriggers.value.flatMap((t) => rules.value[t] || []);
  }

  if (validators.length === 0) {
    return null;
  }

  const value = getValueByPath(formModel.value, props.field);

  fieldResult.value = null;
  manualValidateStatus.value = undefined;

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
    } catch (_e) {
      log.error('failed to validate rules');
    }
  });
  return fieldResult.value;
};

const clearValidate = () => {
  if (!props.field || !formModel.value) {
    return;
  }
  fieldResult.value = null;
  manualValidateStatus.value = undefined;
};

/**
 * @description requiredIcon 切换时清除已有校验结果，避免旧的 required 错误残留
 */
watch(mergedRequiredIcon, () => {
  clearValidate();
});

const resetFiled = () => {
  if (formModel.value && props.field) {
    setValueByPath(formModel.value, props.field, initialVal.value);
  }
  clearValidate();
};

const setInitialValue = (value: any) => {
  initialVal.value = value;
};

/**
 * @description error prop 变更时立即设置错误状态
 */
watch(
  () => props.error,
  (val) => {
    if (val) {
      manualValidateStatus.value = 'danger';
      fieldResult.value = { type: 'danger', message: [val] };
    } else {
      manualValidateStatus.value = undefined;
      fieldResult.value = null;
    }
  },
  { immediate: true },
);

/**
 * @description validateStatus prop 变更时立即设置校验状态
 */
watch(
  () => props.validateStatus,
  (val) => {
    if (val) {
      manualValidateStatus.value = val;
    } else {
      manualValidateStatus.value = undefined;
    }
  },
  { immediate: true },
);

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
  if (formModel.value && props.field) {
    initialVal.value = getValueByPath(formModel.value, props.field);
  }
  if (props.field) {
    formInject.addFiled?.({
      filed: props.field,
      validate: runValidate,
      clearValidate,
      resetFiled,
      setInitialValue,
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
  fieldResult: effectiveFieldResult,
  disabled: mergedDisabled,
  size: mergedSize,
  round: mergedRound,
  clearable: mergedClearable,
  showMessage: mergedShowMessage,
});
</script>
<template>
  <div
    class="o-form-item"
    :data-field="props.field"
    :class="[
      {
        'o-form-item-required': isRequired,
        'o-form-item-danger': mergedValidateStatus === 'danger',
        'o-form-item-warning': mergedValidateStatus === 'warning',
        'o-form-item-success': mergedValidateStatus === 'success',
        'o-form-item-validating': mergedValidateStatus === 'validating',
      },
    ]"
    :style="formItemStyle"
  >
    <div class="o-form-item-label">
      <span v-if="isRequired" class="o-form-require-symbol">
        <slot name="symbol">
          <IconAsterisk />
        </slot>
      </span>
      <slot name="label">
        <span>{{ props.label }}</span>
      </slot>
    </div>
    <div class="o-form-item-main">
      <div class="o-form-item-main-wrap">
        <slot></slot>
      </div>
      <div v-if="mergedShowMessage && fieldResult?.message?.length" class="o-form-item-message" :class="`type-${fieldResult.type}`">
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
