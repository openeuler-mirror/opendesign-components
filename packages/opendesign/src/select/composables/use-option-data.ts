import { computed, reactive, ref, type ComputedRef, type Ref } from 'vue';
import type { SelectFieldNames, SelectMixedOption, SelectOptionData, SelectOptionGroupData, SelectOptionT } from '../types';

/**
 * 选项数据归一化所需的 props 子集
 * @description Vue props 为 reactive proxy，传入 composable 后访问其属性仍保持响应式追踪
 */
interface UseOptionDataProps {
  /** options prop 数据驱动模式的选项数据数组（selectProps 中 default: undefined → 类型可选） */
  options?: SelectMixedOption[] | undefined;
  /** 自定义选项数据字段名（selectProps 中 default: undefined → 类型可选） */
  fieldNames?: SelectFieldNames | undefined;
  /** 值不在选项列表时的兜底显示（selectProps 中 default: false → 类型必填） */
  fallbackOption: false | ((value: string | number) => SelectOptionData);
}

/**
 * 选项数据归一化的外部依赖
 */
interface UseOptionDataDeps {
  /** 检查默认插槽是否有内容（插槽优先于 options prop） */
  hasDefaultSlot: () => boolean;
  /** 选中值列表（供 fallbackOption label 补充使用） */
  valueList: Ref<Array<string | number>>;
}

/**
 * 选项数据归一化 + Label 派生 composable
 * @description 管理 optionInfoMap / cachedOptionMap / createdOptions 三组状态容器，
 * 从 props.options 按 fieldNames 解析为标准化选项列表（resolvedOptions），
 * 并从多个来源派生 value → label 映射（optionLabels）。
 *
 * 优先级：optionInfoMap（已注册选项）→ resolvedOptions（props.options 直接派生，SSR 友好）
 * → cachedOptionMap（已选缓存）→ fallbackOption（用户兜底）
 *
 * @param props 响应式 props 子集
 * @param deps 外部依赖
 * @returns optionInfoMap, cachedOptionMap, createdOptions, resolvedOptions, optionLabels, isOptionGroup, getOptionKey, getOptionValue, getOptionDisabled, getOptionRaw, getOptionChildren
 */
export function useOptionData(props: UseOptionDataProps, deps: UseOptionDataDeps) {
  const { hasDefaultSlot, valueList } = deps;

  // ============================================================================
  // 状态容器
  // optionInfoMap：当前已注册的选项（OOption 挂载时写入，卸载时删除）
  // cachedOptionMap：已选值的选项缓存（选项卸载后保留，供 label 显示）
  // createdOptions：用户通过 allowCreate 创建的选项，合并到 resolvedOptions
  // ============================================================================

  /** 当前已注册的选项 Map（OOption 挂载时写入，卸载时删除） */
  const optionInfoMap = reactive(new Map<string | number, SelectOptionT>());

  /** 已选值的选项缓存 Map（选项卸载后保留，防止 label 丢失） */
  const cachedOptionMap = reactive(new Map<string | number, SelectOptionT>());

  /** 用户通过 allowCreate 创建的选项列表，合并到 resolvedOptions 使后续展开面板可见 */
  const createdOptions = ref<SelectOptionData[]>([]);

  // ============================================================================
  // options prop 数据驱动 + fieldNames 字段名定制
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
    if (hasDefaultSlot()) {
      return [];
    }
    const result = parsePropsOptions(mergedFieldNames.value);
    appendCreatedOptions(result);
    return result;
  });

  // ============================================================================
  // value → label 映射派生
  // ============================================================================

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

  return {
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
  };
}
