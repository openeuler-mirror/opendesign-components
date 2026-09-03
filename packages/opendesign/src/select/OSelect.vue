<script setup lang="ts">
import { computed, h, nextTick, provide, ref, useId, watch, watchEffect } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { defaultSize } from '../_utils/global';
import { IconChevronDown, IconClose, IconLoading } from '../_utils/icons';
import { OPopup } from '../popup';
import { OPopover } from '../popover';
import { ODialog } from '../dialog';
import { selectOptionInjectKey } from './provide';
import { SelectOptionData, SelectOptionGroupData, SelectOptionT, selectProps, SelectValueT, SelectVirtualItem } from './types';
import { getRoundClass } from '../_utils/style-class';
import ClientOnly from '../_components/client-only';
import { OScroller } from '../scrollbar';
import { isArray, isArrayEqual, isFunction, isUndefined } from '../_utils/is';
import { Log } from '../_utils/log';
import { filterSlots, isEmptySlot } from '../_utils/vue-utils';
import SelectOption from './SelectOption.vue';
import { OOption, OOptionGroup } from '../option';
import slot from './slot';
import { useFormField } from '../_composables/use-form-field';
import { useI18n } from '../locale';
import { OButton } from '../button';
import { useScreen } from '../hooks';
import { useComposition } from '../hooks/use-composition';
import type { VirtualListExpose } from '../virtual-list';
import { useResponsiveTags } from './composables/use-responsive-tags';
import { useSelectFilter } from './composables/use-select-filter';
import { useOptionData } from './composables/use-option-data';
import { useScrollTo } from './composables/use-scroll-to';
import { useCreateOption } from './composables/use-create-option';

const props = defineProps(selectProps);
const emits = defineEmits<{
  /**
   * @zh-CN 选中值变化时触发
   * @en-US Triggered when the selected value changes
   */
  (e: 'update:modelValue', value: SelectValueT): void;
  /**
   * @zh-CN 选中值变化时触发，第二参数为选中项的 option 数组（单选 0 或 1 个元素，多选任意个）
   * @en-US Triggered when the selected value changes, second parameter is the option array of the selected items (0 or 1 element for single, any number for multiple)
   */
  (e: 'change', value: SelectValueT, option: SelectOptionData[]): void;
  /**
   * @zh-CN 下拉选项展开/收起时触发
   * @en-US Triggered when the dropdown options expand or collapse
   */
  (e: 'options-visible-change', value: boolean): void;
  /**
   * @zh-CN 点击清除按钮时触发
   * @en-US Triggered when the clear button is clicked
   */
  (e: 'clear', evt: Event): void;
  /**
   * @zh-CN 搜索词变化时触发（filterable=true 时）
   * @en-US Triggered when search query changes (when filterable=true)
   * @since 1.2.7
   */
  (e: 'update:inputValue', value: string): void;
  /**
   * @zh-CN 搜索时触发（filterable=true 时）
   * @en-US Triggered on search (when filterable=true)
   * @since 1.2.7
   */
  (e: 'search', value: string): void;
  /**
   * @zh-CN 创建新选项时触发（allowCreate=true 时点击创建项）
   * @en-US Triggered when creating a new option (clicking create option when allowCreate=true)
   * @since 1.2.7
   */
  (e: 'create', value: string): void;
  /**
   * @zh-CN 多选超过 limit 上限时触发，参数为被尝试选中的值
   * @en-US Triggered when multiple selection exceeds limit, parameter is the attempted value
   * @since 1.2.7
   */
  (e: 'exceed-limit', value: string | number): void;
  /**
   * @zh-CN 多选删除 tag 时触发，参数为被删除的值
   * @en-US Triggered when removing a tag in multiple mode, parameter is the removed value
   * @since 1.2.7
   */
  (e: 'remove-tag', value: string | number): void;
  /**
   * @zh-CN input 聚焦时触发，参数为原生 FocusEvent
   * @en-US Triggered when input is focused, parameter is native FocusEvent
   * @since 1.2.7
   */
  (e: 'focus', evt: FocusEvent): void;
  /**
   * @zh-CN input 失焦时触发，参数为原生 FocusEvent
   * @en-US Triggered when input is blurred, parameter is native FocusEvent
   * @since 1.2.7
   */
  (e: 'blur', evt: FocusEvent): void;
  /**
   * @zh-CN 选项列表滚动时触发，参数为原生 Event
   * @en-US Triggered when option list scrolls, parameter is native Event
   * @since 1.2.7
   */
  (e: 'scroll', evt: Event): void;
  /**
   * @zh-CN 选项列表滚动到底部时触发
   * @en-US Triggered when option list scrolls to bottom
   * @since 1.2.7
   */
  (e: 'scroll-to-bottom', evt: Event): void;
}>();
/**
 * 插槽定义
 */
const slots = defineSlots<{
  /** 默认插槽，自定义下拉选项内容 */
  default?(): any;
  /** 前缀插槽 */
  prefix?(): any;
  /** 标签折叠插槽，用于自定义折叠标签的显示 */
  'tag-fold'?(): any;
  /** 箭头插槽，可获取下拉展开状态 */
  arrow?(props: { active: boolean }): any;
  /** 后缀插槽，可获取下拉展开状态 */
  suffix?(props: { active: boolean }): any;
  /** 空状态插槽 */
  empty?(): any;
  /** 选项操作插槽（透传至 SelectOption） */
  action?(): any;
  /**
   * 分组标题插槽，自定义分组标题渲染
   * @description item 在非虚拟模式为 SelectOptionGroupData，在虚拟模式为 SelectVirtualItem
   * @since 1.2.7
   */
  'group-label'(props: { item: SelectOptionGroupData | SelectVirtualItem }): any;
  /**
   * 自定义选项 label 插槽，与 renderLabel prop 同时存在时插槽优先
   * @description 用于自定义下拉选项和输入框中选中值的 label 渲染，保留 OOption 的点击/选中/无障碍能力
   * @since 1.2.7
   */
  'option-label'?(props: { option: SelectOptionData; selected: boolean }): any;
}>();

const logger = new Log('OSelect');
const { lePadV } = useScreen();

const { t } = useI18n();

const selectRef = ref<HTMLElement>();
/** input 元素引用，统一指向当前渲染的输入框（主 input 与 tag 内联 input 互斥渲染），供 focus/blur 操作使用 */
const inputRef = ref<HTMLInputElement | null>(null);
/** 主 input 专属引用，仅用于 overlay 定位测量 */
const mainInputRef = ref<HTMLInputElement | null>(null);
/** 函数 ref 绑定主 input：同时更新 inputRef（共享 focus/blur）与 mainInputRef（overlay 定位） */
const setMainInputRef = (el: Element | { $el: Element } | null) => {
  const input = (el as HTMLInputElement | null) ?? null;
  inputRef.value = input;
  mainInputRef.value = input;
};
/** 选项容器唯一 id，供 input 的 aria-controls 引用（SSR 友好） */
const optionsId = useId();
const optionsRef = ref<HTMLElement | null>(null);

const isSelecting = ref(false);
const isResponding = computed(() => {
  return !props.noResponsive && lePadV.value;
});

const tagPopoverVisible = ref(false);
watch(
  () => isSelecting.value,
  () => {
    if (isSelecting.value) {
      tagPopoverVisible.value = false;
    }
  },
);

// 表单继承：统一通过 useFormField 接入表单系统（color/disabled/size/round/clearable + 校验触发）
const {
  effectiveColor: color,
  effectiveDisabled,
  effectiveSize,
  effectiveRound,
  effectiveClearable,
  triggerFocus,
  triggerBlur,
  onChange: onFormItemChange,
} = useFormField(props, emits);

/** 有效禁用状态：effectiveDisabled 可能 undefined（未传且无表单），归一为 boolean */
const isDisabled = computed(() => effectiveDisabled.value ?? false);

/** 有效尺寸：effectiveSize 可能 undefined（未传且无表单），回退到全局 defaultSize */
const currentSize = computed(() => effectiveSize.value || defaultSize.value);

// ============================================================================
// 值归一化（前置——useOptionData 的 optionLabels 依赖 valueList）
// ============================================================================

/** 内部值类型 */
type SelectInternalValue = string | number;

/**
 * 从 modelValue/defaultValue 提取内部值数组
 * @param mv modelValue 原始值
 * @returns 内部值数组
 */
const extractInternalValues = (mv: unknown): Array<SelectInternalValue> => {
  if (isUndefined(mv)) return [];
  if (isArray(mv)) {
    if (props.multiple) {
      return [...mv] as SelectInternalValue[];
    }
    // 单选 + Array modelValue：取最后一个元素作为选中值
    return mv.length > 0 ? [mv[mv.length - 1] as SelectInternalValue] : [];
  }
  return [mv as SelectInternalValue];
};

const valueList = ref<Array<SelectInternalValue>>(extractInternalValues(props.modelValue ?? props.defaultValue)); // 选项选中的记录
const finalValueList = ref<Array<SelectInternalValue>>([...valueList.value]); // 最终选择值

/**
 * 选中 key 的 Set 视图，供原生 select 兜底的 :selected 绑定使用
 * O(M) 个 option 各做 O(1) has() 查找，避免 includes() 的 O(M×n) 退化
 */
const selectedKeySet = computed(() => new Set(valueList.value));

// ============================================================================
// 选项数据归一化 + Label 派生
// 提取至 composables/use-option-data.ts
// ============================================================================
const {
  optionInfoMap,
  cachedOptionMap,
  createdOptions,
  resolvedOptions,
  optionLabels,
  isOptionGroup,
  getOptionKey,
  getOptionValue,
  getOptionDisabled,
  getOptionRaw,
  getOptionChildren,
} = useOptionData(props, {
  hasDefaultSlot: () => !isEmptySlot(slots.default),
  valueList,
});

watchEffect(() => {
  // 仅检查插槽函数是否存在，不在 watchEffect 中调用它（避免 render 外触发 Vue 警告）
  if (slots.default && props.options && props.options.length > 0) {
    logger.warn('options prop 与默认插槽同时存在，已忽略 options，优先使用插槽');
  }
  if (props.filterable && slots.default) {
    logger.warn('filterable 在插槽模式下不生效，请使用 options prop 进行过滤');
  }
});

/**
 * 在 resolvedOptions 中按 value 查找原始选项对象
 * @description 供 renderLabel / #option-label 的 overlay 渲染获取自定义字段（如 icon），
 * 查找不到时由调用方回退 { value, label }
 */
const findOptionByValue = (key: string | number): SelectOptionData | null => {
  for (const item of resolvedOptions.value) {
    if (isOptionGroup(item)) {
      const found = item.children.find((child) => child.value === key);
      if (found) return found;
    } else if (item.value === key) {
      return item;
    }
  }
  return null;
};

/** 实际是否开启创建：allowCreate 或（autoTagInMultiple && multiple），移动端禁用 */
const effectiveAllowCreate = computed(() => !isResponding.value && (props.allowCreate || (props.autoTagInMultiple && props.multiple)));

/**
 * 多选 Tag 状态下是否需要渲染内联搜索 input
 * @description filterable 或 allowCreate 任一开启时才需要 input；两者均关闭时不渲染，避免无意义的 readonly input 撑宽导致 tag 换行。
 * 移动端（isResponding）始终不渲染搜索 input，避免吊起输入法
 */
const showTagInput = computed(() => !isResponding.value && (props.filterable || effectiveAllowCreate.value));

// ============================================================================
// maxTagCount='responsive' 容器宽度自适应
// 提取至 composables/use-responsive-tags.ts，使用 VueUse useResizeObserver
// 自动管理监听生命周期；重置-测量-设置策略确保容器宽度变化时可恢复
// ============================================================================
const { tagsWrapRef, isResponsiveTag, isMeasuring, valueListDisplay, valueListFold, foldLabel, foldTrigger, calculateResponsiveTags } = useResponsiveTags(
  props,
  { isSelecting, showTagInput, finalValueList, optionLabels },
);

const round = getRoundClass({ round: effectiveRound }, 'select');

// ============================================================================
// 选中值的 DOM 文本可读性
// o-sr-only 文本节点从 optionLabels + valueList 直接派生，不依赖 OOption 注册
// ============================================================================

/** 选中值的 label 文本（o-sr-only 隐藏文本节点，SSR 与客户端均输出） */
const selectedLabel = computed(() => {
  if (valueList.value.length === 0) return '';
  return valueList.value
    .map((v) => optionLabels.value[v] ?? '')
    .filter(Boolean)
    .join(', ');
});

// ============================================================================
// 渲染函数与插槽优先级（插槽优先，renderLabel 为 opt-in）
// ============================================================================

watchEffect(() => {
  // 仅检查插槽函数是否存在，不在 watchEffect 中调用它（避免 render 外触发 Vue 警告）
  if (props.renderLabel && slots.default) {
    logger.warn('renderLabel 与 #default 插槽同时存在，已忽略 renderLabel，优先使用插槽');
  }
});

watch(
  () => props.modelValue,
  (v) => {
    const newValues = extractInternalValues(v);
    // 判断是否值相等 #I9IJT2
    if (!isArrayEqual(newValues, valueList.value)) {
      valueList.value = newValues;
    }
    finalValueList.value = [...valueList.value];
  },
);

watchEffect(() => {
  if (!isResponding.value) {
    finalValueList.value = [...valueList.value];
  }
});

// ============================================================================
// 多选数量上限 limit
// limit > 0 且已选数 >= limit 时，未选项变 disabled（通过 provide 传递给 OOption）
// ============================================================================

/** 多选已达上限（limit > 0 && 已选数 >= limit） */
const limitReached = computed(() => {
  return props.multiple && props.limit > 0 && valueList.value.length >= props.limit;
});

/** IME 组合输入状态（compositionstart → compositionend 期间为 true），compositionend 时主动派发合成 input 事件确保跨浏览器一致 */
const { isComposing, onCompositionStart, onCompositionEnd } = useComposition();

// ============================================================================
// 搜索/过滤能力
// 提取至 composables/use-select-filter.ts
// ============================================================================
const { innerInputValue, mergedInputValue, isClearable, displayInputValue, filteredOptions } = useSelectFilter(props, {
  isComposing,
  isSelecting,
  valueList,
  optionLabels,
  resolvedOptions,
  isOptionGroup,
  effectiveDisabled,
  effectiveClearable,
});

// ============================================================================
// renderLabel overlay：选中值在输入框中的渲染（自定义 VNode 或纯文本）
// label 字符串负责过滤/o-sr-only/原生 select，overlay 负责视觉渲染（下拉 + 输入框）
// ============================================================================

/** 已选值的选项数据，优先原始数据（保留自定义字段），回退 { value, label } */
const overlayOptionData = computed<SelectOptionData | null>(() => {
  if (valueList.value.length === 0) return null;
  const key = valueList.value[0];
  return findOptionByValue(key) ?? { value: key, label: optionLabels.value[key] ?? '' };
});

/** 单选且已有选中值——overlay 渲染的前提条件 */
const hasSingleSelection = computed(() => !props.multiple && valueList.value.length > 0);

/** filterable 模式下搜索框已有输入文本，overlay 需让位给搜索词显示 */
const hasSearchInput = computed(() => props.filterable && !!mergedInputValue.value);

/** 非移动端 filterable 模式下弹窗展开，overlay 需半透明退避以提示用户可搜索 */
const shouldFadeOverlay = computed(() => !isResponding.value && props.filterable && isSelecting.value);

/** 存在自定义渲染（renderLabel prop 或 #option-label 插槽），overlay 以自定义 VNode 替换纯文本 */
const hasCustomLabelRender = computed(() => !!props.renderLabel || !!slots['option-label']);

/**
 * overlay 渲染状态：visible 正常显示 | faded 半透明 | hidden 不渲染
 * @description 由四个独立条件组合决定，每个条件提取为 computed 以保持单一职责与低圈复杂度：
 * - 无单选值或正在搜索 → hidden（input 直接显示搜索词）
 * - 弹窗展开且可搜索 → faded（半透明退避，移动端无搜索能力故不退避）
 * - 自定义渲染模式 → visible（renderLabel / #option-label 蒙层）
 * - 其余 → hidden（input 直接显示文本，无需蒙层）
 */
const labelOverlayState = computed<'visible' | 'faded' | 'hidden'>(() => {
  if (!hasSingleSelection.value || hasSearchInput.value) return 'hidden';
  if (shouldFadeOverlay.value) return 'faded';
  if (hasCustomLabelRender.value) return 'visible';
  return 'hidden';
});

// ============================================================================
// renderLabel overlay 定位：overlay 相对 .o-select padding-box 绝对定位（.o-select 提供
// position: relative 上下文），左右边界与主 input 实际区域对齐。input 为 .o-select 直接
// 子元素，其盒子随 prefix/suffix/容器宽度变化，故由 JS 测量
// 注入 CSS 变量（--_overlay-left / --_overlay-right），var.scss 声明默认回退值供 SSR 使用
// ============================================================================

/** 同步 overlay 左右边界到 CSS 变量
 * @description 以主 input 实际盒子为基准：left = input.offsetLeft（padding-box 左缘到 input
 * 左缘，已含 padding/prefix 宽度与间距），right = clientWidth - offsetLeft - offsetWidth
 * （padding-box 右缘到 input 右缘，即 suffix 宽度与间距）。select 不可见或主 input 不存在时
 * 跳过，保留 var.scss 默认回退值（SSR 首帧安全）。
 */
const syncOverlayBounds = () => {
  const selectEl = selectRef.value;
  const inputEl = mainInputRef.value;
  if (!selectEl || !inputEl || selectEl.clientWidth === 0) return;
  selectEl.style.setProperty('--_overlay-left', `${inputEl.offsetLeft}px`);
  selectEl.style.setProperty('--_overlay-right', `${selectEl.clientWidth - inputEl.offsetLeft - inputEl.offsetWidth}px`);
};

// 监听 select 与主 input 尺寸变化自动刷新（prefix/suffix 插槽内容、loading/clear 切换、容器宽度变化时 overlay 跟随 input）
useResizeObserver(selectRef, () => syncOverlayBounds());
useResizeObserver(mainInputRef, () => syncOverlayBounds());

/**
 * 触发 search 事件
 * @description 直接 emit，防抖由调用者通过 useDebounceFn 等方式自行控制
 */
const onSearch = (value: string) => {
  emits('search', value);
};

// ============================================================================
// focus / blur 事件
// triggerFocus/triggerBlur 内部统一处理 emit + 通知表单项触发校验，禁止额外手动 emit
// ============================================================================

/**
 * input 聚焦事件处理
 * @description 通过 triggerFocus 统一完成 emit('focus', evt) + formItem.onFocus()
 */
const onInputFocus = (evt: FocusEvent) => {
  triggerFocus(evt);
};

/**
 * input 失焦事件处理
 * @description 通过 triggerBlur 统一完成 emit('blur', evt) + formItem.onBlur()
 */
const onInputBlur = (evt: FocusEvent) => {
  triggerBlur(evt);
};

/**
 * 选项列表滚动事件处理（来自 SelectOption 的 scroll 事件透传）
 */
const onOptionScroll = (evt: Event) => {
  emits('scroll', evt);
  // 触底检测
  const target = evt.target as HTMLElement;
  if (target) {
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      emits('scroll-to-bottom', evt);
    }
  }
};

/**
 * 构建 emit 值
 * @returns SelectValueT（多选返回数组，单选返回标量）
 */
const buildEmitValue = (value: Array<SelectInternalValue>): SelectValueT => {
  return (props.multiple ? [...value] : value[0]) as SelectValueT;
};

/**
 * 构建 change 事件的 option 参数
 * 始终返回 SelectOptionData[]（单选 0 或 1 个元素，多选任意个）
 * @param value 当前选中值数组
 * @returns option 数组
 */
const buildEmitOption = (value: Array<SelectInternalValue>): SelectOptionData[] => {
  return value.map((v) => ({
    value: v,
    label: optionLabels.value[v] ?? '',
  }));
};

const emitChange = (value: Array<SelectInternalValue>) => {
  emits('change', buildEmitValue(value), buildEmitOption(value));
  onFormItemChange();
};
const emitUpdateValue = (value: Array<SelectInternalValue>) => {
  emits('update:modelValue', buildEmitValue(value));
};

// ============================================================================
// 创建选项（tags 模式）
// 提取至 composables/use-create-option.ts
// ============================================================================
const { createOption, handleTokenSeparators, valueExistsInOptions } = useCreateOption(props, {
  resolvedOptions,
  isOptionGroup,
  effectiveAllowCreate,
  mergedInputValue,
  isComposing,
  isResponding,
  innerInputValue,
  valueList,
  createdOptions,
  cachedOptionMap,
  t,
  emitCreate: (value: string) => emits('create', value),
  emitUpdateInputValue: (value: string) => emits('update:inputValue', value),
  emitUpdateValue,
  emitChange,
});

/**
 * input 输入事件处理
 * 更新搜索词 + 触发 search
 * 组合输入期间（isComposing=true）不触发 search，由 compositionend 派发的合成 input 事件在此触发
 */
const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;

  // tokenSeparators 分词（仅 multiple + allowCreate 模式生效）
  if (handleTokenSeparators(value)) return;

  innerInputValue.value = value;
  emits('update:inputValue', value);
  if (!isComposing.value) {
    onSearch(value);
  }
};
/**
 * 清除按钮点击处理
 * @description 同时清空选中值和搜索词
 * @param e 点击事件对象
 */
const clearClick = (e: Event) => {
  e.stopPropagation();

  valueList.value = [];
  // 清除值时清理 cachedOptionMap
  cachedOptionMap.clear();
  // 清空搜索词（有搜索输入时才需要 emit，避免非 filterable 时多余事件）
  if (hasSearchInput.value) {
    innerInputValue.value = '';
    emits('update:inputValue', '');
  }
  emits('clear', e);

  emitChange(valueList.value);
  emitUpdateValue(valueList.value);
};
const beforeSelect = async (value: string | number) => {
  if (isFunction(props.beforeSelect)) {
    return props.beforeSelect(value, buildEmitValue(valueList.value));
  }
  return true;
};

/**
 * 多选 limit 上限检查
 * @param toValue 待选中的值（用于判断是否已选中）
 * @param optionValue 原始选项值（用于 exceed-limit 事件）
 * @returns 是否允许选中（false 表示已达上限）
 */
const checkMultiSelectLimit = (toValue: SelectInternalValue, optionValue: string | number): boolean => {
  if (!props.multiple) return true;
  const isSelected = valueList.value.includes(toValue);
  if (!isSelected && limitReached.value) {
    // 已达上限且不是取消选择，触发 exceed-limit 事件
    emits('exceed-limit', optionValue);
    return false;
  }
  return true;
};

/**
 * 处理单选选中逻辑
 * @param option 选项数据
 * @param toValue 选中值
 */
const handleSingleSelect = (option: SelectOptionT, toValue: SelectInternalValue) => {
  isSelecting.value = false;
  if (valueList.value[0] !== toValue) {
    // 选中时写入 cachedOptionMap
    cachedOptionMap.set(option.value, { ...option });
    valueList.value[0] = toValue;
    emitUpdateValue(valueList.value);
    emitChange(valueList.value);
  }
};

/**
 * 处理多选选中/取消选中逻辑
 * @param option 选项数据
 * @param toValue 选中值
 */
const handleMultiSelect = (option: SelectOptionT, toValue: SelectInternalValue) => {
  const idx = valueList.value.indexOf(toValue);
  if (idx > -1) {
    // 取消选择
    valueList.value.splice(idx, 1);
    // 取消选择时从 cachedOptionMap 删除
    cachedOptionMap.delete(option.value);
  } else {
    // 添加选择
    // 选中时写入 cachedOptionMap
    cachedOptionMap.set(option.value, { ...option });
    valueList.value.push(toValue);
  }

  if (!isResponding.value) {
    emitUpdateValue(valueList.value);
    emitChange(valueList.value);
  }
};

provide(selectOptionInjectKey, {
  multiple: props.multiple,
  selectValue: valueList,
  limitReached,
  // 插槽优先——有默认插槽时不提供 renderLabelFn，OOption 走自身 label fallback
  // 次优先 #option-label 插槽，最后回退 renderLabel prop
  renderLabelFn: computed(() => {
    if (!isEmptySlot(slots.default)) return undefined;
    if (slots['option-label']) {
      // 插槽返回 VNode[]，需用 h 包裹为函数式组件 VNode，以兼容 <component :is>
      return (option: SelectOptionData, selected: boolean) => h(() => slots['option-label']!({ option, selected }));
    }
    return props.renderLabel;
  }),
  select: async (option: SelectOptionT) => {
    let toValue: SelectInternalValue = option.value;
    const rlt = await beforeSelect(option.value);

    if (rlt === false) return;
    if (typeof rlt !== 'boolean') toValue = rlt;

    // limit 上限检查
    if (!checkMultiSelectLimit(toValue, option.value)) return;

    // 创建项使用原始输入值作为 label（而非创建项的显示文案），并持久化到 createdOptions
    // 使后续展开面板可见，且 tag/input 显示原始值而非「创建 xxx」文案
    let selectOption = option;
    if (effectiveAllowCreate.value && !valueExistsInOptions(toValue) && toValue === mergedInputValue.value) {
      emits('create', toValue as string);
      selectOption = { value: toValue as string | number, label: String(toValue) };
      createdOptions.value = [...createdOptions.value, { value: toValue as string | number, label: String(toValue) }];
    }

    if (!props.multiple) {
      handleSingleSelect(selectOption, toValue);
    } else {
      handleMultiSelect(selectOption, toValue);
    }
  },
  registerOption(option: SelectOptionT) {
    // 写入 optionInfoMap
    optionInfoMap.set(option.value, { ...option });
    // 若该 option 已选，同步写入 cachedOptionMap
    if (valueList.value.includes(option.value)) {
      cachedOptionMap.set(option.value, { ...option });
    }
  },
  unregisterOption(option: SelectOptionT) {
    // 只从 optionInfoMap 删除，保留 cachedOptionMap
    optionInfoMap.delete(option.value);
  },
});

const onOptionVisibleChange = (visible: boolean) => {
  emits('options-visible-change', visible);
};

/**
 * 移除 tag 的核心逻辑（不依赖 MouseEvent，供 renderTag 的 onClose 回调使用）
 * @param value 待移除的值
 */
const removeTag = (value: SelectInternalValue) => {
  if (isDisabled.value) return;
  const idx = valueList.value.indexOf(value);
  if (idx > -1) {
    valueList.value.splice(idx, 1);
    // 从 cachedOptionMap 删除
    cachedOptionMap.delete(value);
    // 触发 remove-tag 事件
    emits('remove-tag', value);

    emitChange(valueList.value);
    emitUpdateValue(valueList.value);
  }
};

/**
 * 多选 tag 删除按钮点击处理
 * @param value 待移除的值
 * @param e 鼠标点击事件，用于阻止冒泡
 */
const onRemoveTag = (value: SelectInternalValue, e: MouseEvent) => {
  e.stopPropagation();
  removeTag(value);
};
const onFoldTagClick = (e: MouseEvent) => {
  if (foldTrigger === 'click') {
    e.stopPropagation();
  }
};
const beforeTagPopoverShow = () => !isSelecting.value;

/**
 * 根元素点击处理
 * @description 响应式模式下打开弹窗；非响应式模式下，filterable/allowCreate 开启时：
 *   - 气泡已展开：阻止 click 冒泡触发 OPopup toggle 关闭（排除箭头、tag 等小控件），并聚焦 input
 *   - 气泡未展开（第一次点击）：让 OPopup 正常展开，nextTick 后自动聚焦 input
 * 由于 Vue @click 先于 OPopup 的 addEventListener 注册，stopImmediatePropagation 可阻止 OPopup 的 toggle。
 * @param e 点击事件对象
 */
const onSelectClick = (e: MouseEvent) => {
  if (isResponding.value) {
    if (!isDisabled.value) {
      isSelecting.value = true;
    }
    return;
  }
  if (!props.filterable && !effectiveAllowCreate.value) return;

  const target = e.target as HTMLElement;
  // 排除箭头、tag（含折叠 tag）— 这些元素点击时应正常 toggle 关闭气泡
  if (target.closest('.o-select-arrow, .o-select-tag, .o-select-tag-popover')) return;

  if (isSelecting.value) {
    // 气泡已展开：阻止 toggle 关闭，聚焦 input
    e.stopImmediatePropagation();
    inputRef.value?.focus();
  } else {
    // 气泡未展开（第一次点击）：让 OPopup 正常展开，等 DOM 渲染后自动聚焦 input
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
};

const onSelectDlgChange = (visible: boolean) => {
  onOptionVisibleChange(visible);
};

const onselectDlgCancelClick = () => {
  isSelecting.value = false;
  valueList.value = [...finalValueList.value];
};

const onselectDlgOkClick = () => {
  isSelecting.value = false;

  finalValueList.value = [...valueList.value];

  emitChange(valueList.value);
  emitUpdateValue(valueList.value);
};

// ============================================================================
// 虚拟滚动内置集成
// virtual=true 时将 filteredOptions + createOption 展平为统一列表，
// 传给 SelectOption 内的 OVirtualList 渲染
// ============================================================================

/**
 * 虚拟滚动模式下的扁平化列表数据
 * 将 filteredOptions（含分组）+ createOption 展平为 SelectVirtualItem[]
 */
const virtualItems = computed<SelectVirtualItem[]>(() => {
  if (!props.virtual) return [];
  const items: SelectVirtualItem[] = [];
  // 创建项
  if (createOption.value) {
    items.push({
      id: `__create_${createOption.value.value}`,
      type: 'option',
      value: createOption.value.value,
      label: createOption.value.label,
      raw: createOption.value,
    });
  }
  // 展平 filteredOptions
  for (const item of filteredOptions.value) {
    if (isOptionGroup(item)) {
      items.push({ id: `__group_${item.key}`, type: 'group-header', label: item.label, groupKey: item.key });
      for (const child of item.children) {
        items.push({
          id: child.value,
          type: 'option',
          value: child.value,
          label: child.label,
          disabled: child.disabled,
          raw: child,
        });
      }
    } else {
      items.push({
        id: item.value,
        type: 'option',
        value: item.value,
        label: item.label,
        disabled: item.disabled,
        raw: item,
      });
    }
  }
  return items;
});

/** SelectOption 实例引用，用于间接访问其暴露的 virtualListRef */
const selectOptionRef = ref<InstanceType<typeof SelectOption> | null>(null);

/** 虚拟列表实例引用（通过 SelectOption 间接获取） */
const virtualListRef = computed<VirtualListExpose | null>(() => {
  return selectOptionRef.value?.virtualListRef ?? null;
});

// ============================================================================
// focus / blur / scrollTo 实例方法
// scrollTo 提取至 composables/use-scroll-to.ts
// ============================================================================

/**
 * 编程式聚焦内部 input 元素
 */
const focus = () => {
  inputRef.value?.focus();
};

/**
 * 编程式移除内部 input 元素焦点
 */
const blur = () => {
  inputRef.value?.blur();
};

const { flattenOptions, scrollTo } = useScrollTo({
  resolvedOptions,
  isOptionGroup,
  virtualListRef,
  optionsRef,
  warn: (msg: string) => logger.warn(msg),
});

/**
 * 将首个已选值滚动至可见区域
 * @description 展开下拉面板时，若已有选中项则滚动至首个选中值所在位置
 */
const scrollToSelectedValue = () => {
  if (valueList.value.length === 0) return;
  const key = valueList.value[0];
  const idx = flattenOptions().findIndex((o) => o.value === key);
  if (idx >= 0) {
    scrollTo(idx);
  }
};

/**
 * 下拉展开时处理
 * @description 响应式折叠重算（reserve 56→136，input wrapper 进入 DOM）；
 * 滚动至已选值；多选且有选中项时自动聚焦搜索输入框
 */
const handleDropdownOpen = () => {
  nextTick(() => {
    // 响应式折叠：展开时 reserve 从 56→136，input wrapper 进入 DOM，需重算
    if (isResponsiveTag.value) {
      calculateResponsiveTags(true);
    }
    scrollToSelectedValue();
    // 多选有选中项时，展开后自动聚焦 input wrapper 内的 input
    if (props.multiple && valueList.value.length > 0) {
      inputRef.value?.focus();
    }
  });
};

/**
 * 下拉收起时处理
 * @description 不保留搜索词时清空 input；响应式折叠重算（input wrapper 从 DOM 移除，reserve 136→56）
 */
const handleDropdownClose = () => {
  if (!props.retainInputValue && innerInputValue.value) {
    innerInputValue.value = '';
    emits('update:inputValue', '');
  }
  // 响应式折叠：收起时 input wrapper 从 DOM 移除，reserve 从 136→56，需重算
  if (isResponsiveTag.value) {
    nextTick(() => calculateResponsiveTags(true));
  }
};

// 展开/收起时联动处理：搜索词清空、滚动至已选值、多选自动聚焦、响应式折叠重算
watch(
  () => isSelecting.value,
  (visible) => {
    if (visible) handleDropdownOpen();
    else handleDropdownClose();
  },
);

// 多选首次选中（v-if→v-else 分支切换）后重新聚焦新挂载的 input
watch(
  () => valueList.value.length,
  (newLen, oldLen) => {
    // 仅在 0→1 转换（首次选中）且展开状态且非响应式模式时触发
    if (props.multiple && oldLen === 0 && newLen > 0 && isSelecting.value && !isResponding.value) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  },
);

defineExpose({
  /**
   * @zh-CN 选择器根元素引用
   * @en-US Reference to the select root element
   */
  selectRef,
  /**
   * @zh-CN 是否正在选择中
   * @en-US Whether the select is in selecting state
   */
  isSelecting,
  /**
   * @zh-CN 虚拟列表实例引用，可调用 scrollToView 等方法
   * @en-US Virtual list instance ref, can call scrollToView etc.
   * @since 1.2.7
   */
  virtualListRef,
  /**
   * @zh-CN 编程式聚焦内部 input 元素
   * @en-US Programmatically focus the internal input element
   * @since 1.2.7
   */
  focus,
  /**
   * @zh-CN 编程式移除内部 input 元素焦点
   * @en-US Programmatically blur the internal input element
   * @since 1.2.7
   */
  blur,
  /**
   * @zh-CN 编程式滚动到指定选项
   * @en-US Programmatically scroll to a specific option
   * @since 1.2.7
   */
  scrollTo,
});
</script>
<template>
  <div
    ref="selectRef"
    class="o-select"
    :class="[
      `o-select-${color}`,
      `o-select-${props.variant}`,
      `o-select-${currentSize}`,
      round.class.value,
      {
        'is-selecting': isSelecting,
        'is-multiple': props.multiple && valueList.length > 0,
        'o-select-disabled': isDisabled,
        'o-select-clearable': isClearable,
        'o-select-is-loading': props.loading,
      },
    ]"
    :style="round.style.value"
    @click="onSelectClick"
  >
    <div v-if="!isEmptySlot(slots.prefix)" class="o-select-prefix">
      <slot name="prefix"></slot>
    </div>
    <input
      v-if="!props.multiple || (props.multiple && valueList.length === 0)"
      :ref="setMainInputRef"
      :value="displayInputValue"
      type="text"
      :placeholder="props.placeholder"
      class="o-select-input"
      :class="{ 'o-select-input--overlay': labelOverlayState !== 'hidden' }"
      :readonly="!showTagInput"
      :inputmode="isResponding ? 'none' : undefined"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isSelecting"
      :aria-controls="optionsId"
      :aria-autocomplete="!isResponding && props.filterable ? 'list' : undefined"
      :aria-disabled="isDisabled || undefined"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
      @focus="onInputFocus"
      @blur="onInputBlur"
    />
    <OScroller v-else class="o-select-tags-scroller" wrap-class="o-select-value-list" show-type="hover" size="small" disabled-x>
      <div ref="tagsWrapRef" class="o-select-tags-wrap" :class="{ 'is-responsive': isResponsiveTag, 'is-measuring': isMeasuring }">
        <div v-for="item in valueListDisplay" :key="item" class="o-select-tag">
          <template v-if="props.renderTag">
            <component :is="props.renderTag({ value: item, label: optionLabels[item] ?? '' }, () => removeTag(item))" />
          </template>
          <template v-else>
            {{ optionLabels[item] ?? '' }}
            <div v-if="!isDisabled" class="o-select-tag-remove" @click="(e: MouseEvent) => onRemoveTag(item, e)">
              <IconClose />
            </div>
          </template>
        </div>
        <OPopover
          v-if="showFoldTags && valueListFold.length > 0"
          v-model:visible="tagPopoverVisible"
          :trigger="foldTrigger"
          class="o-select-tag-popover"
          position="bottom"
          :before-show="beforeTagPopoverShow"
        >
          <template #target>
            <div class="o-select-tag" @click="onFoldTagClick">
              <slot name="tag-fold">{{ foldLabel }}</slot>
            </div>
          </template>
          <div class="o-select-tags">
            <div v-for="item in valueListFold" :key="item" class="o-select-tag">
              {{ optionLabels[item] ?? '' }}
              <div v-if="!isDisabled" class="o-select-tag-remove" @click="(e: MouseEvent) => onRemoveTag(item, e)">
                <IconClose />
              </div>
            </div>
          </div>
        </OPopover>
        <!-- 多选有 tag 时，dropdown 展开渲染内联搜索 input，支持搜索过滤与创建 -->
        <div v-if="isSelecting && showTagInput" class="o-select-tag-input-wrap">
          <span class="o-select-input-mirror" aria-hidden="true">{{ displayInputValue || '\u200B' }}</span>
          <input
            ref="inputRef"
            :value="displayInputValue"
            type="text"
            class="o-select-input o-select-input--tag"
            :readonly="!showTagInput"
            @input="onInput"
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
            @focus="onInputFocus"
            @blur="onInputBlur"
          />
        </div>
      </div>
    </OScroller>
    <!-- renderLabel overlay：覆盖在 input 之上渲染选中值，左右边界由 JS 测量注入（--_overlay-left / --_overlay-right）。
         绝对定位且边界与 input 区域对齐（不覆盖 prefix/suffix），DOM 位置在 OScroller 之后不影响绘制 -->
    <div v-if="labelOverlayState !== 'hidden'" class="o-select-label-overlay" :class="{ 'is-faded': labelOverlayState === 'faded' }">
      <slot name="option-label" :option="overlayOptionData!" :selected="true">
        <component :is="() => props.renderLabel!(overlayOptionData!, true)" v-if="props.renderLabel" />
        <template v-else>{{ overlayOptionData?.label ?? '' }}</template>
      </slot>
    </div>
    <!-- o-sr-only 选中值文本（SSR 与客户端均输出，视觉零变化） -->
    <span class="o-sr-only" aria-hidden="false">{{ selectedLabel }}</span>
    <!-- data-value 属性（始终渲染，供 DOM 可读性/测试） -->
    <div :data-value="valueList.join(',')" class="o-sr-only" aria-hidden="true"></div>
    <!-- 原生 select 兜底（始终渲染，用于表单提交 / GEO / 结构化数据） -->
    <select :name="props.name" :itemprop="props.itemprop" :multiple="props.multiple || undefined" hidden class="o-select-native-fallback">
      <template v-for="item in resolvedOptions" :key="getOptionKey(item)">
        <optgroup v-if="isOptionGroup(item)" :label="item.label">
          <option v-for="child in getOptionChildren(item)" :key="child.value" :value="child.value" :selected="selectedKeySet.has(child.value) || undefined">
            {{ child.label }}
          </option>
        </optgroup>
        <option v-else :value="getOptionValue(item)" :selected="selectedKeySet.has(getOptionValue(item) as string | number) || undefined">
          {{ item.label }}
        </option>
      </template>
    </select>
    <div class="o-select-suffix">
      <div class="o-select-suffix-icon">
        <div v-if="props.loading" class="o-select-loading">
          <IconLoading class="o-rotating" />
        </div>
        <div v-else-if="isClearable" class="o-select-clear" @click="clearClick">
          <IconClose class="o-select-clear-icon" />
        </div>
        <div class="o-select-arrow" :class="{ active: isSelecting }">
          <slot name="arrow" :active="isSelecting">
            <IconChevronDown />
          </slot>
        </div>
      </div>
      <slot name="suffix" :active="isSelecting"></slot>
    </div>
    <ClientOnly>
      <teleport :to="optionsRef" :disabled="!optionsRef">
        <div v-if="!props.virtual" v-show="optionsRef" class="o-select-option-wrap">
          <!-- 插槽优先：有默认插槽时走插槽（options 被忽略） -->
          <slot v-if="!isEmptySlot(slots.default)"></slot>
          <!-- 无插槽时走 options prop 数据驱动（创建项 + 过滤后选项） -->
          <template v-else-if="filteredOptions.length > 0 || createOption">
            <!-- 创建项（allowCreate 模式，输入不存在的值时显示） -->
            <OOption v-if="createOption" :value="createOption.value" :label="createOption.label" :raw="createOption" class="o-select-create-option" />
            <template v-for="opt in filteredOptions" :key="getOptionKey(opt)">
              <OOptionGroup v-if="isOptionGroup(opt)">
                <template #name>
                  <slot name="group-label" :item="opt">
                    <div class="o-option-group-name">{{ opt.label }}</div>
                  </slot>
                </template>
                <template v-for="child in getOptionChildren(opt)" :key="child.value">
                  <OOption :value="child.value" :label="child.label" :disabled="child.disabled" :raw="child" />
                </template>
              </OOptionGroup>
              <OOption v-else :value="getOptionValue(opt)" :label="opt.label" :disabled="getOptionDisabled(opt)" :raw="getOptionRaw(opt)" />
            </template>
          </template>
          <!-- 无插槽且无 options 时渲染 empty -->
          <div v-else class="o-select-empty">
            <slot name="empty">
              <span>{{ t('common.empty') }}</span>
            </slot>
          </div>
        </div>
      </teleport>
      <template v-if="isResponding">
        <ODialog
          v-model:visible="isSelecting"
          :before-show="props.beforeOptionsShow"
          :before-hide="props.beforeOptionsHide"
          hide-close
          class="o-select-dlg"
          :mask-close="!props.multiple"
          :class="{
            'is-loading': props.loading,
          }"
          size="small"
          :scrollbar="false"
          @change="onSelectDlgChange"
        >
          <template v-if="props.optionTitle" #header>
            <div class="o-select-options-head">{{ props.optionTitle }}</div>
          </template>
          <template v-if="props.multiple" #actions>
            <OButton class="o-dlg-btn" variant="text" size="large" @click="onselectDlgCancelClick">
              {{ t('select.cancel') }}
            </OButton>
            <OButton class="o-dlg-btn" variant="text" size="large" @click="onselectDlgOkClick">
              {{ t('select.confirm') }}
            </OButton>
          </template>
          <template #default>
            <SelectOption
              ref="selectOptionRef"
              :size="currentSize"
              :wrap-class="props.optionWrapClass"
              :loading="props.loading"
              class="o-select-options-dlg"
              :option-title="props.optionTitle"
              :multiple="props.multiple"
              :listbox-id="optionsId"
              :virtual="props.virtual"
              :virtual-list-props="props.virtualListProps"
              :virtual-items="virtualItems"
              @scroll="onOptionScroll"
            >
              <template v-for="name in filterSlots(slots, slot.option.names)" #[name]>
                <slot :name="name"></slot>
              </template>

              <!-- 虚拟模式：选项渲染插槽 -->
              <template #virtual-item="{ item }">
                <OOptionGroup v-if="item.type === 'group-header'">
                  <template #name>
                    <slot name="group-label" :item="item">
                      <div class="o-option-group-name">{{ item.label }}</div>
                    </slot>
                  </template>
                </OOptionGroup>
                <OOption v-else :value="item.value" :label="item.label" :disabled="item.disabled" :raw="item.raw" />
              </template>
              <!-- 虚拟模式：空状态 -->
              <template #empty-content>
                <slot name="empty">
                  <span>{{ t('common.empty') }}</span>
                </slot>
              </template>
              <!-- 非虚拟模式：option 选项单独处理 -->
              <template v-if="!props.virtual" #option-target>
                <div ref="optionsRef"></div>
              </template>
            </SelectOption>
          </template>
        </ODialog>
      </template>
      <template v-else>
        <OPopup
          v-if="!isDisabled"
          v-model:visible="isSelecting"
          wrap-class="o-options-popup"
          :transition="props.transition"
          :unmount-on-hide="props.unmountOnHide"
          :position="props.optionPosition"
          :wrapper="props.optionsWrapper"
          :target="selectRef"
          :trigger="props.trigger"
          :offset="4"
          :adjust-min-width="props.optionWidthMode === 'min-width'"
          :adjust-width="props.optionWidthMode === 'width'"
          :before-show="props.beforeOptionsShow"
          :before-hide="props.beforeOptionsHide"
          @change="onOptionVisibleChange"
        >
          <SelectOption
            ref="selectOptionRef"
            :size="currentSize"
            :wrap-class="props.optionWrapClass"
            :loading="props.loading"
            :multiple="props.multiple"
            :listbox-id="optionsId"
            :virtual="props.virtual"
            :virtual-list-props="props.virtualListProps"
            :virtual-items="virtualItems"
            @scroll="onOptionScroll"
          >
            <template v-for="name in filterSlots(slots, slot.option.names)" #[name]>
              <slot :name="name"></slot>
            </template>
            <!-- 虚拟模式：选项渲染插槽 -->
            <template #virtual-item="{ item }">
              <OOptionGroup v-if="item.type === 'group-header'">
                <template #name>
                  <slot name="group-label" :item="item">
                    <div class="o-option-group-name">{{ item.label }}</div>
                  </slot>
                </template>
              </OOptionGroup>
              <OOption v-else :value="item.value" :label="item.label" :disabled="item.disabled" :raw="item.raw" />
            </template>
            <!-- 虚拟模式：空状态 -->
            <template #empty-content>
              <slot name="empty">
                <span>{{ t('common.empty') }}</span>
              </slot>
            </template>
            <!-- 非虚拟模式：option 选项单独处理 -->
            <template v-if="!props.virtual" #option-target>
              <div ref="optionsRef"></div>
            </template>
          </SelectOption>
        </OPopup>
      </template>
    </ClientOnly>
  </div>
</template>
