<script setup lang="ts">
import { computed, h, inject, nextTick, provide, reactive, ref, useId, watch, watchEffect } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { defaultSize } from '../_utils/global';
import { IconChevronDown, IconClose, IconLoading } from '../_utils/icons';
import { OPopup } from '../popup';
import { OPopover } from '../popover';
import { ODialog } from '../dialog';
import { selectOptionInjectKey } from './provide';
import {
  SelectFieldNames,
  SelectMixedOption,
  SelectOptionData,
  SelectOptionGroupData,
  SelectOptionT,
  selectProps,
  SelectValueT,
  SelectVirtualItem,
} from './types';
import { getRoundClass } from '../_utils/style-class';
import ClientOnly from '../_components/client-only';
import { OScroller } from '../scrollbar';
import { isArray, isArrayEqual, isFunction, isUndefined } from '../_utils/is';
import { Log } from '../_utils/log';
import { filterSlots, isEmptySlot } from '../_utils/vue-utils';
import SelectOption from './SelectOption.vue';
import { OOption, OOptionGroup } from '../option';
import slot from './slot';
import { formItemInjectKey } from '../form/provide';
import { useI18n } from '../locale';
import { OButton } from '../button';
import { useScreen } from '../hooks';
import { useComposition } from '../hooks/use-composition';
import type { VirtualListExpose } from '../virtual-list';

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
   * @since NEXT
   */
  (e: 'update:inputValue', value: string): void;
  /**
   * @zh-CN 搜索时触发（filterable=true 时）
   * @en-US Triggered on search (when filterable=true)
   * @since NEXT
   */
  (e: 'search', value: string): void;
  /**
   * @zh-CN 创建新选项时触发（allowCreate=true 时点击创建项）
   * @en-US Triggered when creating a new option (clicking create option when allowCreate=true)
   * @since NEXT
   */
  (e: 'create', value: string): void;
  /**
   * @zh-CN 多选超过 limit 上限时触发，参数为被尝试选中的值
   * @en-US Triggered when multiple selection exceeds limit, parameter is the attempted value
   * @since NEXT
   */
  (e: 'exceed-limit', value: string | number): void;
  /**
   * @zh-CN 多选删除 tag 时触发，参数为被删除的值
   * @en-US Triggered when removing a tag in multiple mode, parameter is the removed value
   * @since NEXT
   */
  (e: 'remove-tag', value: string | number): void;
  /**
   * @zh-CN input 聚焦时触发，参数为原生 FocusEvent
   * @en-US Triggered when input is focused, parameter is native FocusEvent
   * @since NEXT
   */
  (e: 'focus', evt: FocusEvent): void;
  /**
   * @zh-CN input 失焦时触发，参数为原生 FocusEvent
   * @en-US Triggered when input is blurred, parameter is native FocusEvent
   * @since NEXT
   */
  (e: 'blur', evt: FocusEvent): void;
  /**
   * @zh-CN 选项列表滚动时触发，参数为原生 Event
   * @en-US Triggered when option list scrolls, parameter is native Event
   * @since NEXT
   */
  (e: 'scroll', evt: Event): void;
  /**
   * @zh-CN 选项列表滚动到底部时触发
   * @en-US Triggered when option list scrolls to bottom
   * @since NEXT
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
   * @since NEXT
   */
  'group-label'(props: { item: SelectOptionGroupData | SelectVirtualItem }): any;
  /**
   * 自定义选项 label 插槽，与 renderLabel prop 同时存在时插槽优先
   * @description 用于自定义下拉选项和输入框中选中值的 label 渲染，保留 OOption 的点击/选中/无障碍能力
   * @since NEXT
   */
  'option-label'?(props: { option: SelectOptionData; selected: boolean }): any;
}>();

const logger = new Log('OSelect');
const { isPhonePadSize } = useScreen();

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
  return !props.noResponsive && isPhonePadSize.value;
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

// 表单注入，用于规则校验
const formItemInjection = inject(formItemInjectKey, null);

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type;
  } else {
    return props.color;
  }
});

// ============================================================================
// optionLabels 派生机制
// optionInfoMap：当前已注册的选项（OOption 挂载时写入，卸载时删除）
// cachedOptionMap：已选值的选项缓存（选项卸载后保留，供 label 显示）
// optionLabels：从两个 Map 派生的 computed
// ============================================================================

/** 当前已注册的选项 Map（OOption 挂载时写入，卸载时删除） */
const optionInfoMap = reactive(new Map<string | number, SelectOptionT>());

/** 已选值的选项缓存 Map（选项卸载后保留，防止 label 丢失） */
const cachedOptionMap = reactive(new Map<string | number, SelectOptionT>());

/** 用户通过 allowCreate 创建的选项列表，合并到 resolvedOptions 使后续展开面板可见 */
const createdOptions = ref<SelectOptionData[]>([]);

// ============================================================================
// options prop 数据驱动 + fieldNames 字段名定制
// 插槽优先：有默认插槽时忽略 options；无插槽时按 fieldNames 解析 options
// ============================================================================

/** 默认字段名，与 OOption 的固定 props 一致 */
const DEFAULT_FIELD_NAMES: Required<SelectFieldNames> = {
  value: 'value',
  label: 'label',
  disabled: 'disabled',
  children: 'children',
  options: 'options',
};

/** 合并后的字段名（默认值 + 使用者传入的 fieldNames） */
const mergedFieldNames = computed<Required<SelectFieldNames>>(() => ({
  ...DEFAULT_FIELD_NAMES,
  ...props.fieldNames,
}));

/**
 * 按字段名从原始数据解析标准化选项
 * @param raw 原始选项数据
 * @returns 标准化的 { value, label, disabled }
 */
const resolveOptionData = (raw: Record<string, unknown>): SelectOptionData => {
  const fn = mergedFieldNames.value;
  const value = raw[fn.value] as string | number;
  return {
    ...raw, // 保留原始字段，供对象值模式查找原始对象
    value,
    label: (raw[fn.label] as string | undefined) ?? `${value}`,
    disabled: raw[fn.disabled] as boolean | undefined,
  };
};

/**
 * 类型守卫：判断 SelectMixedOption 是否为分组选项
 * @description SelectOptionData 的索引签名导致内联 `'type' in item` 检查无法收窄，
 * 使用 `is` 类型谓词强制收窄为 SelectOptionGroupData
 */
const isOptionGroup = (item: SelectMixedOption): item is SelectOptionGroupData => 'type' in item && item.type === 'group';

/** 获取选项 key（分组用 key，普通用 value），供模板使用 */
const getOptionKey = (item: SelectMixedOption): string | number => (isOptionGroup(item) ? item.key : item.value);

/** 获取选项 value（仅非分组项有值），供模板使用 */
const getOptionValue = (item: SelectMixedOption): string | number | undefined => (isOptionGroup(item) ? undefined : item.value);

/** 获取选项 disabled（仅非分组项），供模板使用 */
const getOptionDisabled = (item: SelectMixedOption): boolean | undefined => (isOptionGroup(item) ? undefined : item.disabled);

/** 获取原始选项数据（仅非分组项），供模板透传 :raw，保留自定义字段供 renderLabel 访问 */
const getOptionRaw = (item: SelectMixedOption): SelectOptionData | undefined => (isOptionGroup(item) ? undefined : item);

/** 获取分组 children（非分组返回空数组），供模板使用 */
const getOptionChildren = (item: SelectMixedOption): SelectOptionData[] => (isOptionGroup(item) ? item.children : []);

/**
 * 按 fieldNames 解析 props.options 为标准化选项列表（含分组处理）
 * @param fn 合并后的字段名映射
 * @returns 标准化后的选项数组（含分组结构）
 */
const parsePropsOptions = (fn: typeof mergedFieldNames.value): SelectMixedOption[] => {
  const result: SelectMixedOption[] = [];
  if (!props.options || props.options.length === 0) return result;
  for (const item of props.options) {
    if (isOptionGroup(item)) {
      const rawGroup = item as unknown as Record<string, unknown>;
      const children = (rawGroup[fn.children] as SelectOptionData[] | undefined) ?? item.children ?? [];
      result.push({
        type: 'group' as const,
        key: item.key ?? result.length,
        label: (rawGroup[fn.label] as string | undefined) ?? item.label ?? '',
        children: children.map((child) => resolveOptionData(child as Record<string, unknown>)),
      });
    } else {
      result.push(resolveOptionData(item as Record<string, unknown>));
    }
  }
  return result;
};

/**
 * 追加已创建的选项（去重：不在 result 中的才追加）
 * @param result 已解析的选项数组，函数会原地追加
 */
const appendCreatedOptions = (result: SelectMixedOption[]) => {
  const existingValues = new Set<string | number>();
  for (const item of result) {
    if (!isOptionGroup(item)) {
      existingValues.add(item.value);
    }
  }
  for (const created of createdOptions.value) {
    if (!existingValues.has(created.value)) {
      result.push(created);
    }
  }
};

/**
 * 解析后的选项数据
 * 有默认插槽时返回空数组（插槽优先，options 被忽略）
 * 无插槽时按 fieldNames 解析 props.options 为标准化选项，并追加已创建的选项
 */
const resolvedOptions = computed<SelectMixedOption[]>(() => {
  if (!isEmptySlot(slots.default)) {
    return [];
  }
  const result = parsePropsOptions(mergedFieldNames.value);
  appendCreatedOptions(result);
  return result;
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

// ============================================================================
// 值归一化
// ============================================================================

/** 内部值类型 */
type SelectInternalValue = string | number;

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

/** 从 resolvedOptions 收集 label 到 result（跳过已存在的 key），SSR 友好 */
const collectResolvedOptionLabels = (result: Record<string | number, string>) => {
  for (const item of resolvedOptions.value) {
    if (isOptionGroup(item)) {
      for (const child of item.children) {
        if (!(child.value in result)) {
          result[child.value] = child.label;
        }
      }
    } else if (!(item.value in result)) {
      result[item.value] = item.label;
    }
  }
};

/** 从 fallbackOption 补充未匹配值的 label */
const collectFallbackLabels = (result: Record<string | number, string>) => {
  if (!props.fallbackOption) return;
  for (const v of valueList.value) {
    if (!(v in result)) {
      const fb = props.fallbackOption(v);
      if (fb) {
        result[v] = fb.label;
      }
    }
  }
};

/**
 * value → label 的映射（从 optionInfoMap + resolvedOptions + cachedOptionMap + fallbackOption 派生）
 * 优先级：optionInfoMap（已注册选项）→ resolvedOptions（props.options 直接派生，SSR 友好）
 * → cachedOptionMap（已选缓存）→ fallbackOption（用户兜底）
 */
const optionLabels = computed<Record<string | number, string>>(() => {
  const result: Record<string | number, string> = {};
  // 1. optionInfoMap：当前已注册的选项（OOption 挂载时写入）
  optionInfoMap.forEach((option, key) => {
    result[key] = option.label;
  });
  // 2. resolvedOptions：从 props.options 直接派生（SSR 友好，无需等 OOption 挂载）
  collectResolvedOptionLabels(result);
  // 3. cachedOptionMap：已选值缓存（选项卸载后保留）
  cachedOptionMap.forEach((option, key) => {
    if (!(key in result)) {
      result[key] = option.label;
    }
  });
  // 4. fallbackOption：用户提供的兜底函数
  collectFallbackLabels(result);
  return result;
});

/** 实际是否开启创建：allowCreate 或（autoTagInMultiple && multiple） */
const effectiveAllowCreate = computed(() => props.allowCreate || (props.autoTagInMultiple && props.multiple));

/**
 * 多选 Tag 状态下是否需要渲染内联搜索 input
 * @description filterable 或 allowCreate 任一开启时才需要 input；两者均关闭时不渲染，避免无意义的 readonly input 撑宽导致 tag 换行
 */
const showTagInput = computed(() => props.filterable || effectiveAllowCreate.value);

// ============================================================================
// maxTagCount='responsive' 容器宽度自适应
// 使用 VueUse useResizeObserver 自动管理监听生命周期（target 为 null 时不观察，
// 变为非 null 时自动开始观察）；重置-测量-设置策略确保容器宽度变化时可恢复
// ============================================================================

/** 是否为响应式折叠模式 */
const isResponsiveTag = computed(() => props.maxTagCount === 'responsive');
/** 响应式折叠：实际可显示的 tag 数量，null 表示全部显示（SSR 阶段或全部可放下时） */
const responsiveTagCount = ref<number | null>(null);
/** tags 容器引用，供 useResizeObserver 监听与 DOM 查询使用 */
const tagsWrapRef = ref<HTMLElement | null>(null);
/** 上次测量的容器宽度，防止 ResizeObserver 因高度变化振荡 */
let lastContainerWidth = 0;
/**
 * 是否正在执行异步测量（防止重入）
 * @description ref 类型，驱动模板 .is-measuring class，使 input wrapper 在测量期间脱离 flex 流，
 * 避免 tag 被 flex 压缩导致 offsetWidth 偏小
 */
const isMeasuring = ref(false);
/** 折叠指示器（+N…）的预留宽度，确保指示器不被 overflow:hidden 裁剪 */
const FOLD_INDICATOR_RESERVE = 56;
/** 多选 Tag 状态下展开时 input wrapper 的最小宽度，折叠计算需预留此空间 */
const INPUT_MIN_WIDTH = 80;

/**
 * 计算折叠指示器与内联 input 的预留宽度
 * @description dropdown 展开且需要搜索/创建时 input wrapper 占用 INPUT_MIN_WIDTH，折叠计算需一并预留
 * @returns 预留宽度（px）
 */
const getTagReserveWidth = (): number => (isSelecting.value && showTagInput.value ? FOLD_INDICATOR_RESERVE + INPUT_MIN_WIDTH : FOLD_INDICATOR_RESERVE);

/**
 * 在 nextTick 后测量 tag 实际宽度并设置 responsiveTagCount
 * @description responsiveTagCount=null 时 DOM 中出现全部 tag，逐个累加 offsetWidth，超出容器宽度则停止
 * @param containerWidth 测量时的容器宽度
 */
const measureTags = (containerWidth: number) => {
  isMeasuring.value = false;
  if (!tagsWrapRef.value) return;

  const tags = tagsWrapRef.value.querySelectorAll('.o-select-tag');
  if (tags.length === 0 || containerWidth === 0) {
    responsiveTagCount.value = null;
    return;
  }

  let totalWidth = 0;
  let count = 0;
  const reserve = getTagReserveWidth();
  for (const tag of tags) {
    totalWidth += (tag as HTMLElement).offsetWidth + 4; // 4px margin
    // 预留折叠指示器 + input 空间：已有至少 1 个 tag 且加上预留后超出容器则停止
    if (totalWidth + reserve > containerWidth && count > 0) break;
    count++;
  }

  // 全部 tag 都能放下（含折叠指示器预留空间）则不折叠
  responsiveTagCount.value = count >= tags.length ? null : Math.max(1, count);
};

/**
 * 计算响应式 tag 数量
 * @description 先重置为全部显示（responsiveTagCount=null），在 nextTick 后 DOM 中出现全部 tag，
 * 逐个累加 offsetWidth，超过容器宽度则停止。通过宽度变化检测防止 ResizeObserver 振荡。
 * @param force 是否强制重新计算（tag 数量变化时为 true，宽度未变也重算）
 */
const calculateResponsiveTags = (force = false) => {
  if (!tagsWrapRef.value || isMeasuring.value) return;
  const containerWidth = tagsWrapRef.value.clientWidth;

  // 非强制模式下，仅当容器宽度变化时才重新计算（防止高度变化引起的振荡）
  if (!force && containerWidth === lastContainerWidth) return;
  lastContainerWidth = containerWidth;

  // 重置为全部显示，以便在 DOM 中测量所有 tag 的真实宽度
  responsiveTagCount.value = null;
  isMeasuring.value = true;

  nextTick(() => measureTags(containerWidth));
};

// VueUse useResizeObserver：自动管理生命周期，target 变化时自动重新观察
useResizeObserver(tagsWrapRef, () => {
  if (isResponsiveTag.value) calculateResponsiveTags(false);
});

// tag 数量变化时强制重新计算
watch(
  () => finalValueList.value.length,
  () => {
    if (isResponsiveTag.value) {
      nextTick(() => calculateResponsiveTags(true));
    }
  },
);

const valueListDisplay = computed(() => {
  if (!props.maxTagCount) {
    return finalValueList.value;
  }
  if (props.maxTagCount === 'responsive') {
    const count = responsiveTagCount.value;
    if (count === null) return finalValueList.value; // SSR: 显示全部
    return finalValueList.value.slice(0, count);
  }
  return finalValueList.value.slice(0, props.maxTagCount);
});
const valueListFold = computed(() => {
  if (!props.maxTagCount) {
    return [];
  }
  if (props.maxTagCount === 'responsive') {
    const count = responsiveTagCount.value;
    if (count === null) return []; // SSR: 无折叠
    return finalValueList.value.slice(count);
  }
  return finalValueList.value.slice(props.maxTagCount);
});
const foldLabel = computed(() => {
  if (props.foldLabel) {
    const tags = valueListFold.value.map((item) => ({
      value: item,
      label: optionLabels.value[item] ?? '',
    }));
    return props.foldLabel(tags);
  }
  return `+${valueListFold.value.length}...`;
});
const foldTrigger = typeof props.showFoldTags === 'string' ? props.showFoldTags : 'hover';

const round = getRoundClass(props, 'select');

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

// ============================================================================
// 搜索/过滤能力
// filterable=true 时 input 可编辑，内置/自定义过滤，search 事件
// ============================================================================

/** 内部搜索词（非受控） */
const innerInputValue = ref('');

/** IME 组合输入状态（compositionstart → compositionend 期间为 true），compositionend 时主动派发合成 input 事件确保跨浏览器一致 */
const { isComposing, onCompositionStart, onCompositionEnd } = useComposition();

/** 合并后的搜索词（受控优先，非受控兜底） */
const mergedInputValue = computed(() => props.inputValue ?? innerInputValue.value);

/**
 * 是否可清除
 * @description 有选中值或搜索词时显示清除按钮
 */
const isClearable = computed(() => props.clearable && !props.disabled && (valueList.value.length > 0 || !!mergedInputValue.value));

/**
 * input 的显示值
 * - 多选模式：始终返回空（tag 负责展示选中值，input 不回填 label）
 *   - filterable=true + 有搜索词：返回搜索词
 *   - filterable=true/false + 无搜索词：返回空
 * - 单选 filterable=false：显示已选值 label
 * - 单选 filterable=true + 有搜索词：显示搜索词
 * - 单选 filterable=true + 下拉展开 + 无搜索词：显示空
 * - 单选 filterable=true + 下拉收起 + 无搜索词：显示已选值 label
 */
const displayInputValue = computed(() => {
  if (props.multiple) {
    return mergedInputValue.value ?? '';
  }
  if (props.filterable) {
    if (mergedInputValue.value) return mergedInputValue.value;
    // 下拉展开时空搜索词显示空，避免用户删除搜索词后被 label 回填
    if (isSelecting.value) return '';
    return valueList.value.length > 0 ? (optionLabels.value[valueList.value[0]] ?? '') : '';
  }
  return valueList.value.length > 0 ? (optionLabels.value[valueList.value[0]] ?? '') : '';
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

/**
 * overlay 渲染状态：visible 正常显示 | faded 半透明 | hidden 不渲染
 * - renderLabel / #option-label 模式：非搜索时 visible（自定义渲染蒙层），搜索展开时 faded
 * - 非自定义模式（filterable）：搜索展开时 faded（纯文本蒙层），其余 hidden（input 直接显示）
 */
const labelOverlayState = computed<'visible' | 'faded' | 'hidden'>(() => {
  if (props.multiple || valueList.value.length === 0) return 'hidden';
  if (props.filterable && mergedInputValue.value) return 'hidden';
  if (props.filterable && isSelecting.value) return 'faded';
  // 自定义渲染模式：renderLabel prop 或 #option-label 插槽存在时用自定义渲染替换 input 文本
  if (props.renderLabel || slots['option-label']) return 'visible';
  // 非自定义模式：input 直接显示文本，不需要蒙层
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

/** 内置默认过滤：label 包含匹配，不区分大小写 */
const defaultFilterOption = (input: string, option: SelectOptionData): boolean => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

/**
 * 过滤分组选项的 children，保留有匹配子项的分组
 * @param item 分组选项
 * @param filterFn 过滤函数
 * @param query 搜索词
 * @returns 过滤后的分组选项，无匹配子项时返回 null
 */
const filterGroupOption = (
  item: SelectMixedOption,
  filterFn: (input: string, option: SelectOptionData) => boolean,
  query: string,
): SelectMixedOption | null => {
  if (!isOptionGroup(item)) return null;
  const filteredChildren = item.children.filter((child) => filterFn(query, child));
  if (filteredChildren.length === 0) return null;
  return { ...item, children: filteredChildren };
};

/**
 * 比较两个选项（非分组），用于 filterSort 排序
 * @param a 选项 A
 * @param b 选项 B
 * @returns 排序值
 */
const compareOptions = (a: SelectMixedOption, b: SelectMixedOption): number => {
  if (isOptionGroup(a) || isOptionGroup(b)) return 0;
  return props.filterSort!(a, b);
};

/**
 * 对分组项的 children 执行 filterSort 排序
 * @param item 选项（分组或普通）
 * @returns 排序后的选项
 */
const sortGroupChildren = (item: SelectMixedOption): SelectMixedOption => {
  if (!isOptionGroup(item)) return item;
  return { ...item, children: [...item.children].sort(props.filterSort) };
};

/**
 * 对过滤结果执行 filterSort 排序（仅搜索结果非空时生效）
 * @param result 过滤后的选项列表（原地修改）
 */
const sortFilteredOptions = (result: SelectMixedOption[]) => {
  if (!props.filterSort || result.length === 0) return;
  for (let i = 0; i < result.length; i++) {
    result[i] = sortGroupChildren(result[i]);
  }
  result.sort(compareOptions);
};

/**
 * 对 resolvedOptions 执行过滤，返回过滤后的列表
 * @param filterFn 过滤函数
 * @param query 搜索词
 * @returns 过滤后的选项数组
 */
const applyFilter = (filterFn: (input: string, option: SelectOptionData) => boolean, query: string): SelectMixedOption[] => {
  const result: SelectMixedOption[] = [];
  for (const item of resolvedOptions.value) {
    if ('type' in item && item.type === 'group') {
      const filtered = filterGroupOption(item, filterFn, query);
      if (filtered) result.push(filtered);
    } else if (filterFn(query, item as SelectOptionData)) {
      result.push(item);
    }
  }
  return result;
};

/**
 * 过滤后的选项列表
 * - filterable=false 或无搜索词：返回 resolvedOptions（不过滤）
 * - IME 组合输入期间：返回 resolvedOptions（不过滤，避免组合中间值触发过滤）
 * - filterMethod 存在：调用 filterMethod（自行处理），OSelect 不做过滤
 * - filterOption=false：不过滤（远程搜索）
 * - filterOption=true（默认）或函数：按 filterOption 过滤
 */
const filteredOptions = computed<SelectMixedOption[]>(() => {
  if (!props.filterable || !mergedInputValue.value || isComposing.value) {
    return resolvedOptions.value;
  }
  const query = mergedInputValue.value;
  // filterMethod 优先：业务自行处理过滤逻辑
  if (props.filterMethod) {
    props.filterMethod(query);
    return resolvedOptions.value;
  }
  // filterOption=false：不过滤
  if (props.filterOption === false) {
    return resolvedOptions.value;
  }
  // 确定过滤函数
  const filterFn = typeof props.filterOption === 'function' ? props.filterOption : defaultFilterOption;
  // 过滤
  const result = applyFilter(filterFn, query);
  // filterSort 排序
  sortFilteredOptions(result);
  return result;
});

/**
 * 触发 search 事件
 * @description 直接 emit，防抖由调用者通过 useDebounceFn 等方式自行控制
 */
const onSearch = (value: string) => {
  emits('search', value);
};

/**
 * 按分隔符拆分输入值
 * @param input 原始输入
 * @param separators 分隔符数组
 * @returns 拆分后的 token 数组
 */
const splitBySeparators = (input: string, separators: string[]): string[] => {
  let result = [input];
  for (const sep of separators) {
    const next: string[] = [];
    for (const piece of result) {
      next.push(...piece.split(sep));
    }
    result = next;
  }
  return result;
};

// ============================================================================
// focus / blur 事件（emit 仅在此处调用，其他位置不得触发）
// ============================================================================

/**
 * input 聚焦事件处理
 * ⚠️ 仅在此处调用 emit('focus')，其他任何地方均不得调用
 */
const onInputFocus = (evt: FocusEvent) => {
  emits('focus', evt);
};

/**
 * input 失焦事件处理
 * ⚠️ 仅在此处调用 emit('blur')，其他任何地方均不得调用
 */
const onInputBlur = (evt: FocusEvent) => {
  emits('blur', evt);
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

// ============================================================================
// 创建选项（tags 模式）
// allowCreate=true 时输入不存在的值，下拉首项显示「创建 xxx」
// effectiveAllowCreate / showTagInput 定义于响应式折叠区之前（被 calculateResponsiveTags 引用）
// ============================================================================

/** 检查 value 是否已存在于 resolvedOptions 中 */
const valueExistsInOptions = (value: string | number): boolean => {
  for (const item of resolvedOptions.value) {
    if (isOptionGroup(item)) {
      if (item.children.some((child) => child.value === value)) return true;
    } else {
      if (item.value === value) return true;
    }
  }
  return false;
};

/**
 * 创建项数据
 * 当 effectiveAllowCreate=true 且有搜索词且搜索词不在 options 中时，生成创建项
 */
const createOption = computed<SelectOptionData | null>(() => {
  if (!effectiveAllowCreate.value || !mergedInputValue.value) {
    return null;
  }
  const inputValue = mergedInputValue.value;
  // 搜索词已存在于 options 中时不显示创建项
  if (valueExistsInOptions(inputValue)) {
    return null;
  }
  return {
    value: inputValue,
    label: props.createLabel ? props.createLabel(inputValue) : t('select.create', { input: inputValue }),
  };
});

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
  formItemInjection?.fieldHandlers.onChange?.();
};
const emitUpdateValue = (value: Array<SelectInternalValue>) => {
  emits('update:modelValue', buildEmitValue(value));
};

/**
 * 处理单个 token：如果不在已选列表中则添加
 * @param token 输入的分词片段
 */
const processToken = (token: string) => {
  const trimmed = token.trim();
  if (!trimmed || valueList.value.some((v) => v === trimmed)) return;
  if (!valueExistsInOptions(trimmed)) {
    emits('create', trimmed);
    createdOptions.value = [...createdOptions.value, { value: trimmed, label: trimmed }];
  }
  cachedOptionMap.set(trimmed, { value: trimmed, label: trimmed });
  valueList.value.push(trimmed);
};

/**
 * 处理 tokenSeparators 分词输入（仅 multiple + allowCreate 模式生效）
 * @param value 原始输入值
 * @returns 是否已处理分词（true 时调用方应跳过后续逻辑）
 */
const handleTokenSeparators = (value: string): boolean => {
  if (isComposing.value || props.tokenSeparators.length === 0 || !props.multiple || !effectiveAllowCreate.value) {
    return false;
  }
  const tokens = splitBySeparators(value, props.tokenSeparators);
  if (tokens.length <= 1) return false;

  // 有分隔符：逐个 token 选中，清空 input
  for (const token of tokens) {
    processToken(token);
  }
  if (!isResponding.value) {
    emitUpdateValue(valueList.value);
    emitChange(valueList.value);
  }
  // 清空 input
  innerInputValue.value = '';
  emits('update:inputValue', '');
  return true;
};

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
  // 清空搜索词（仅 filterable 模式下有搜索词，避免非 filterable 时多余 emit）
  if (props.filterable && mergedInputValue.value) {
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
  if (props.disabled) return;
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
    if (!props.disabled) {
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

/**
 * 将 resolvedOptions 展平为 SelectOptionData[]
 * 分组选项的 children 被展开到顶层
 * @returns 展平后的选项数组
 */
const flattenOptions = (): SelectOptionData[] => {
  const flat: SelectOptionData[] = [];
  for (const item of resolvedOptions.value) {
    if (isOptionGroup(item)) {
      flat.push(...item.children);
    } else {
      flat.push(item);
    }
  }
  return flat;
};

/**
 * 解析 scrollTo 参数，返回目标索引
 * - number 类型直接返回
 * - 对象类型按 key/index 解析（key 与 index 互斥，同时传时以 key 为准）
 * @param index 选项索引或 { index, key } 对象
 * @returns 目标索引，无效时返回 undefined
 */
const resolveScrollTarget = (index: number | { index?: number; key?: string | number }): number | undefined => {
  if (typeof index === 'number') return index;

  let targetKey: string | number | undefined;
  if (index.key !== undefined && index.index !== undefined) {
    // index 与 key 互斥，同时传时 dev warn 并以 key 为准
    logger.warn('scrollTo 的 index 与 key 不应同时传入，以 key 为准');
    targetKey = index.key;
  } else if (index.key !== undefined) {
    targetKey = index.key;
  } else if (index.index !== undefined) {
    return index.index;
  }

  // key 模式：在 resolvedOptions 中查找 index
  if (targetKey !== undefined) {
    return flattenOptions().findIndex((o) => o.value === targetKey);
  }
  return undefined;
};

/**
 * 查找元素最近的可滚动祖先
 * @description 遍历父元素链，找到第一个 overflow 为 auto/scroll 且内容超出可视区域的元素。
 * 用于 scrollTo 中手动滚动 popup 内部容器，避免 scrollIntoView 滚动 window。
 * @param el 起始元素
 * @returns 可滚动祖先元素，未找到时返回 null
 */
const findScrollableAncestor = (el: HTMLElement): HTMLElement | null => {
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
};

/**
 * 编程式滚动到指定选项
 * - 虚拟模式：调用 virtualListRef.scrollToView
 * - 非虚拟模式：手动滚动选项列表的可滚动容器，将目标选项带入可见区域。
 *   不使用 scrollIntoView，因为 OPopup 通过 ResizeObserver 异步定位，
 *   在 nextTick 中调用 scrollIntoView 时 popup 可能尚未定位完成，
 *   导致 option 元素位于页面顶部，scrollIntoView 滚动 window 引起页面跳转。
 * @param index 选项索引或 { index, key } 对象（key 与 index 互斥，同时传时以 key 为准）
 */
const scrollTo = (index: number | { index?: number; key?: string | number }) => {
  const targetIndex = resolveScrollTarget(index);
  if (targetIndex === undefined || targetIndex < 0) return;

  // 虚拟模式：调用 virtualListRef.scrollToView
  const virtualList = virtualListRef.value;
  if (virtualList) {
    virtualList.scrollToView(targetIndex);
    return;
  }

  // 非虚拟模式：手动滚动可滚动容器（用 optionsRef 限定查询范围）
  const container = optionsRef.value;
  if (!container) return;
  const optionEls = container.querySelectorAll('.o-option');
  if (!optionEls[targetIndex]) return;

  const optionEl = optionEls[targetIndex] as HTMLElement;
  // 查找选项元素最近的可滚动祖先，仅滚动该容器而非 window
  const scrollContainer = findScrollableAncestor(optionEl);
  if (!scrollContainer) return;

  const optionRect = optionEl.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  // 选项在容器上方：向上滚动使选项顶部对齐容器顶部
  if (optionRect.top < containerRect.top) {
    scrollContainer.scrollTop -= containerRect.top - optionRect.top;
  } else if (optionRect.bottom > containerRect.bottom) {
    // 选项在容器下方：向下滚动使选项底部对齐容器底部
    scrollContainer.scrollTop += optionRect.bottom - containerRect.bottom;
  }
};

// 关闭下拉时根据 retainInputValue 决定是否清空搜索词
// 展开时自动 scrollIntoView 到已选值
// 多选有 tag 时展开后自动聚焦 input
// 展开/收起时强制重算响应式折叠（reserve 在 56↔136 间切换，容器宽度可能不变，需 force 触发）
watch(
  () => isSelecting.value,
  (visible) => {
    if (visible) {
      // 展开时滚动到已选值
      nextTick(() => {
        // 响应式折叠：展开时 reserve 从 56→136，input wrapper 进入 DOM，需重算
        if (isResponsiveTag.value) {
          calculateResponsiveTags(true);
        }
        if (valueList.value.length > 0) {
          const key = valueList.value[0];
          const idx = flattenOptions().findIndex((o) => o.value === key);
          if (idx >= 0) {
            scrollTo(idx);
          }
        }
        // 多选有选中项时，展开后自动聚焦 input wrapper 内的 input
        if (props.multiple && valueList.value.length > 0) {
          inputRef.value?.focus();
        }
      });
    } else {
      if (!props.retainInputValue && innerInputValue.value) {
        innerInputValue.value = '';
        emits('update:inputValue', '');
      }
      // 响应式折叠：收起时 input wrapper 从 DOM 移除，reserve 从 136→56，需重算
      if (isResponsiveTag.value) {
        nextTick(() => calculateResponsiveTags(true));
      }
    }
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
   * @since NEXT
   */
  virtualListRef,
  /**
   * @zh-CN 编程式聚焦内部 input 元素
   * @en-US Programmatically focus the internal input element
   * @since NEXT
   */
  focus,
  /**
   * @zh-CN 编程式移除内部 input 元素焦点
   * @en-US Programmatically blur the internal input element
   * @since NEXT
   */
  blur,
  /**
   * @zh-CN 编程式滚动到指定选项
   * @en-US Programmatically scroll to a specific option
   * @since NEXT
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
      `o-select-${props.size || defaultSize}`,
      round.class.value,
      {
        'is-selecting': isSelecting,
        'is-multiple': props.multiple && valueList.length > 0,
        'o-select-disabled': props.disabled,
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
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isSelecting"
      :aria-controls="optionsId"
      :aria-autocomplete="props.filterable ? 'list' : undefined"
      :aria-disabled="props.disabled || undefined"
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
            <div v-if="!props.disabled" class="o-select-tag-remove" @click="(e: MouseEvent) => onRemoveTag(item, e)">
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
              <div v-if="!props.disabled" class="o-select-tag-remove" @click="(e: MouseEvent) => onRemoveTag(item, e)">
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
              :size="props.size"
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
          v-if="!props.disabled"
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
            :size="props.size"
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
