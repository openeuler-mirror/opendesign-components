<script setup lang="ts">
import { provide, computed, watch, nextTick, ref, onMounted, getCurrentInstance } from 'vue';
import { useMutationObserver, useResizeObserver, useEventListener } from '@vueuse/core';
import { formInjectKey } from './provide';
import { formProps, FiledInfoT, FieldResultT, RulesT, TriggerT } from './types';
import { getFlexValue } from './form';
import { isFunction, isArray } from '../_utils/is';
import { setValueByPath } from '../_utils/helper';
import { getScrollParents } from '../_utils/dom';
import { isClient } from '../_utils/is';
import { log } from '../_utils/log';
const props = defineProps(formProps);

const emits = defineEmits<{
  /**
   * @zh-CN 表单提交时触发
   * @en-US Triggered when the form is submitted
   */
  (e: 'submit', results: FieldResultT[]): void;
  /**
   * @zh-CN 表单校验完成后触发，返回所有已校验项的结果数组
   * @en-US Triggered after form validation completes, returns the result array of all validated items
   */
  (e: 'validate', results: FieldResultT[]): void;
  /**
   * @zh-CN 任一表单项校验完成后触发，返回包含字段名、是否通过、错误消息的对象
   * @en-US Triggered after any form item is validated, returns an object containing field name, validity, and error message
   * @since 1.2.7
   */
  (e: 'validateField', payload: { field: string; isValid: boolean; message: string }): void;
  /**
   * @zh-CN 清除表单校验状态时触发
   * @en-US Triggered when form validation state is cleared
   */
  (e: 'clear', filed?: string | string[]): void;
  /**
   * @zh-CN 重置表单字段时触发
   * @en-US Triggered when form fields are reset
   */
  (e: 'reset', filed?: string | string[]): void;
}>();

// 检测是否监听了已废弃的 validate 事件，输出迁移警告
const instance = getCurrentInstance();
if (instance?.vnode.props && 'onValidate' in instance.vnode.props) {
  log.warn('[OForm] 事件 `validate` 已废弃，请使用 `validateField` 事件监听逐字段校验结果，将在 v2.0.0 移除');
}

const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));

const formEl = ref<HTMLFormElement>();

/**
 * @description labelWidth 为 'auto' 时测量所有 label 的最大宽度并设置 --form-label-width，
 * 配合 CSS min-width/max-width 实现自适应对齐
 */
const measureLabelWidth = () => {
  // SSR 环境无 document/window，无法进行 DOM 测量，提前返回避免服务端报错
  if (!isClient) return;
  if (!formEl.value || props.labelWidth !== 'auto' || props.layout === 'v') return;
  const labels = formEl.value.querySelectorAll('.o-form-item-label');
  if (labels.length === 0) return;
  formEl.value.style.setProperty('--form-label-width', 'auto');
  let maxWidth = 0;
  labels.forEach((label) => {
    maxWidth = Math.max(maxWidth, (label as HTMLElement).getBoundingClientRect().width);
  });
  if (maxWidth > 0) {
    formEl.value.style.setProperty('--form-label-width', `${Math.ceil(maxWidth)}px`);
  }
};

/**
 * @description 表单内联样式，将 labelAlign / labelJustify / labelWidth 映射为 CSS 变量；
 * labelWidth 为 'auto' 时不设 --form-label-width，由 measureLabelWidth 动态测量统一控制
 */
const formStyle = computed<Record<string, string | undefined>>(() => {
  const style: Record<string, string | undefined> = {
    '--form-label-align': props.labelAlign,
    '--form-label-justify': justify.value,
    '--form-item-align': align.value,
  };
  // 非自动模式才写入具体宽度，'auto' 模式交给 JS 测量
  if (props.labelWidth && props.labelWidth !== 'auto') {
    style['--form-label-width'] = props.labelWidth;
  }
  return style;
});

/** 已注册的表单项列表，由 FormItem 在 onMounted 时注册、onBeforeUnmount 时移除 */
const filedList: FiledInfoT[] = [];
/** 字段初始值缓存，供 setInitialValues 预设、后注册的 FormItem 补齐初始值 */
const initialValues = new Map<string, any>();

/**
 * @description 滚动到指定字段对应的表单项
 * @param field 字段名
 * @param options scrollIntoView 选项，默认 `{ behavior: 'smooth', block: 'center' }`
 * @since 1.2.7
 */
const scrollToField = async (
  field: string,
  options?:
    | boolean
    | { behavior?: 'auto' | 'smooth' | 'instant'; block?: 'start' | 'center' | 'end' | 'nearest'; inline?: 'start' | 'center' | 'end' | 'nearest' },
) => {
  await nextTick();
  // 再等一帧确保 DOM 更新完成后再查询目标元素
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  const el = document.querySelector(`.o-form-item[data-field="${field}"]`) as HTMLElement | null;
  if (!el) return;
  const scrollParent = getScrollParents(el)[0];
  if (scrollParent) {
    // 有可滚动父容器时，手动计算滚动位置使目标元素在容器视口内垂直居中
    const parentRect = scrollParent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = Math.max(0, elRect.top - parentRect.top + scrollParent.scrollTop - (parentRect.height - elRect.height) / 2);
    scrollParent.scrollTo({ top: offset, behavior: options === undefined ? 'smooth' : typeof options === 'object' ? (options.behavior ?? 'smooth') : 'auto' });
  } else {
    // 无可滚动父容器时回退到原生 scrollIntoView
    el.scrollIntoView(options === undefined ? { behavior: 'smooth', block: 'center' } : options);
  }
};

/**
 * @description 校验失败时滚动到首个错误项
 * @param fieldResults 字段名与校验结果的对应列表，直接定位错误字段，不依赖过滤后数组下标反查 filedList
 */
const scrollToFirstError = (fieldResults: { filed: string | undefined; result: FieldResultT }[]) => {
  const error = fieldResults.find((fr) => fr.result?.type === 'danger');
  if (error?.filed) {
    scrollToField(error.filed);
  }
};

/** 单项校验结果与字段名的对应结构 */
type FieldResultEntry = { filed: string | undefined; result: Exclude<FieldResultT, null> };

/**
 * @description 类型守卫：保留有校验结果的数据（排除 null 与 result 为 null 的通过项）
 */
const hasResult = (r: { filed: string | undefined; result: FieldResultT } | null): r is FieldResultEntry => r !== null && r.result !== null;

/**
 * @description 处理单项校验结果：派发 validateField 事件并返回带字段名的结果
 * @param item 表单项信息
 * @param result 校验结果
 */
const handleItemResult = (item: FiledInfoT, result: FieldResultT) => {
  if (item.filed) {
    const isValid = !result || result.type !== 'danger';
    const message = result?.message?.join('; ') ?? '';
    emits('validateField', { field: item.filed, isValid, message });
  }
  // 保留字段名与结果的对应关系，供 scrollToFirstError 直接定位错误字段
  return { filed: item.filed, result };
};

/**
 * @description 校验表单
 * @param filed 字段名或字段名数组，不传则校验全部
 * @param trigger 触发校验的事件类型，不传则校验全部 trigger 分组的规则
 * @returns 校验结果数组，仅包含有校验结果的数据（过滤未校验项与通过项）
 */
const doValidate = (filed?: string | string[], trigger?: TriggerT) => {
  const filedNames = filed ? ([] as string[]).concat(filed) : [];

  const list = filedList.map((item) => {
    if (filedNames.length === 0 || (item.filed && filedNames.includes(item.filed))) {
      return item.validate ? item.validate(trigger).then((result) => handleItemResult(item, result)) : null;
    }
    return null;
  });

  return Promise.all(list).then((rlt) => {
    // 过滤未校验项（null）与校验通过项（result 为 null），仅保留有校验结果的数据
    const fieldResults = rlt.filter(hasResult);
    // 开启 scrollToError 时滚动到首个 danger 错误项
    if (props.scrollToError) {
      scrollToFirstError(fieldResults);
    }
    // 提取纯结果数组，用于已废弃的 validate 事件和返回值
    const results = fieldResults.map((fr) => fr.result);
    // 派发已废弃的 validate 事件（整体结果数组），保持向后兼容
    emits('validate', results);
    return results;
  });
};

/**
 * @description 校验指定字段
 * @param field 字段名或字段名数组
 * @param trigger 触发校验的事件类型，不传则校验全部 trigger 分组的规则
 * @returns 校验结果数组，仅包含已校验项的结果
 */
const validateField = (field: string | string[], trigger?: TriggerT) => {
  return doValidate(field, trigger);
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

/**
 * @description 注册表单项到表单；若该字段已有预设初始值（通过 setInitialValues 提前设置）则同步写入
 * @param filedItem 表单项信息
 */
const addFiled = (filedItem: FiledInfoT) => {
  filedList.push(filedItem);
  // 后注册的 FormItem 若对应字段已有缓存初始值，立即补齐，避免时序导致的初始值丢失
  if (filedItem.filed && initialValues.has(filedItem.filed)) {
    filedItem.setInitialValue?.(initialValues.get(filedItem.filed));
  }
};

/**
 * @description 从表单中移除指定字段的表单项
 * @param filed 字段名
 */
const removeFiled = (filed: string) => {
  const idx = filedList.findIndex((item) => item.filed === filed);
  if (idx !== -1) {
    filedList.splice(idx, 1);
  }
};

const resetFields = (filed?: string | string[]) => {
  clearValidate(filed, (item: FiledInfoT) => {
    item.resetFiled();
  });
  emits('reset', filed);
};

/**
 * @description 设置表单初始值，同时写入 model 和重置基准
 * @param data 字段名与初始值的映射
 */
const setInitialValues = (data: Record<string, any>) => {
  for (const [key, value] of Object.entries(data)) {
    initialValues.set(key, value);
    if (props.model) {
      setValueByPath(props.model, key, value);
    }
    const item = filedList.find((i) => i.filed === key);
    item?.setInitialValue?.(value);
  }
};

/**
 * @description 获取全局 rules 中指定字段的规则
 * @param field 字段名
 * @returns 规则数组，无匹配时返回 undefined
 */
const getFieldRules = (field: string): RulesT | RulesT[] | undefined => {
  if (!props.rules) return undefined;
  const r = props.rules[field];
  if (!r) return undefined;
  return isArray(r) ? r : [r];
};

/**
 * @description 表单提交处理：先执行全量校验，再派发 submit 事件并携带校验结果
 */
const onSubmit = () => {
  doValidate().then((results) => {
    emits('submit', results);
  });
};

/**
 * @description rules 变更时自动触发校验
 */
watch(
  () => props.rules,
  () => {
    if (props.validateOnRuleChange) {
      nextTick(() => doValidate());
    }
  },
  { deep: true },
);

/** @description 是否启用 label 宽度自动测量（labelWidth='auto' 且非 v 布局） */
const autoMeasureEnabled = computed(() => props.labelWidth === 'auto' && props.layout !== 'v');

/** @description 仅在自动测量启用时执行测量；Observer 始终挂载，未启用时回调空跑 */
const maybeMeasure = () => {
  if (autoMeasureEnabled.value) {
    measureLabelWidth();
  }
};

// DOM 节点增删 VueUse 自动随组件卸载清理
useMutationObserver(formEl, maybeMeasure, { childList: true, subtree: true, characterData: true });
// 视口/容器 resize、响应式 max-width 跃迁导致的 label 宽度变化（监听表单盒，不监听 label 避免与测量翻转死循环）
useResizeObserver(formEl, maybeMeasure);
if (typeof document !== 'undefined' && document.fonts) {
  useEventListener(document.fonts, 'loadingdone', maybeMeasure);
}

/**
 * @description labelWidth 或 layout 变化时重新评估自动测量：启用则下一帧重测，禁用则移除测量变量
 */
watch([() => props.labelWidth, () => props.layout], () => {
  if (autoMeasureEnabled.value) {
    nextTick(() => measureLabelWidth());
  } else {
    formEl.value?.style.removeProperty('--form-label-width');
  }
});

/**
 * @description 挂载后执行首次 label 宽度测量（若自动测量已启用）
 */
onMounted(() => {
  if (autoMeasureEnabled.value) {
    nextTick(() => measureLabelWidth());
  }
});

provide(formInjectKey, {
  model: () => props.model,
  rules: () => props.rules,
  disabled: () => props.disabled,
  size: () => props.size,
  showMessage: () => props.showMessage,
  round: () => props.round,
  clearable: () => props.clearable,
  requiredIcon: () => props.requiredIcon,
  labelWidth: () => props.labelWidth,
  addFiled,
  removeFiled,
  getFieldRules,
});

defineExpose({
  /**
   * 校验表单
   * validate form
   * @param filed 字段名或字段名数组，不传则校验全部
   * @param trigger 触发校验的事件类型，不传则校验全部 trigger 分组的规则
   */
  validate: doValidate,
  /**
   * 校验指定字段
   * validate specific fields
   * @param field 字段名或字段名数组
   * @param trigger 触发校验的事件类型，不传则校验全部 trigger 分组的规则
   * @since 1.2.7
   */
  validateField,
  /** reset form */
  resetFields,
  /**
   * 设置表单初始值，同时写入 model 和重置基准
   * set initial values for form fields, also writes to model and updates reset baseline
   * @since 1.2.7
   */
  setInitialValues,
  /** clear validate state */
  clearValidate,
  /**
   * 滚动到指定字段对应的表单项
   * scroll to the form item of the specified field
   * @since 1.2.7
   */
  scrollToField,
});
</script>
<template>
  <form
    ref="formEl"
    class="o-form"
    :class="[
      {
        'o-form-has-required': props.hasRequired,
      },
      `o-form-layout-${props.layout}`,
    ]"
    :style="formStyle"
    @submit.prevent="onSubmit"
  >
    <slot></slot>
  </form>
</template>
