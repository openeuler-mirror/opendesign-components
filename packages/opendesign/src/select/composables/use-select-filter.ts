import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { SelectMixedOption, SelectOptionData, SelectOptionGroupData } from '../types';

/**
 * 搜索/过滤所需的 props 子集
 * @description Vue props 为 reactive proxy，传入 composable 后访问其属性仍保持响应式追踪
 */
interface UseSelectFilterProps {
  /** 开启搜索/过滤能力 */
  filterable: boolean;
  /** 受控搜索词（可选，配合 update:inputValue 事件使用） */
  inputValue?: string | undefined;
  /** 过滤函数，true 为内置默认，false 为不过滤，也可传入自定义函数 */
  filterOption: boolean | ((inputValue: string, option: SelectOptionData) => boolean);
  /** 完全自定义过滤方法，优先级高于 filterOption */
  filterMethod?: ((query: string) => void) | undefined;
  /** 搜索结果排序函数 */
  filterSort?: ((optionA: SelectOptionData, optionB: SelectOptionData) => number) | undefined;
  /** 支持多选 */
  multiple: boolean;
}

/**
 * 搜索/过滤的外部依赖
 * @description 这些 Ref / ComputedRef / 函数由 OSelect 上游逻辑提供
 */
interface UseSelectFilterDeps {
  /** IME 组合输入状态 */
  isComposing: Ref<boolean>;
  /** 是否正在展开选择面板 */
  isSelecting: Ref<boolean>;
  /** 选中值列表 */
  valueList: Ref<Array<string | number>>;
  /** value → label 的映射 */
  optionLabels: ComputedRef<Record<string | number, string>>;
  /** 解析后的选项数据（含分组） */
  resolvedOptions: ComputedRef<SelectMixedOption[]>;
  /** 类型守卫：判断 SelectMixedOption 是否为分组选项 */
  isOptionGroup: (item: SelectMixedOption) => item is SelectOptionGroupData;
  /** 表单继承后的有效禁用状态（来自 useFormField） */
  effectiveDisabled: ComputedRef<boolean | undefined>;
  /** 表单继承后的有效可清除状态（来自 useFormField） */
  effectiveClearable: ComputedRef<boolean | undefined>;
}

/**
 * 搜索/过滤 composable
 * @description filterable=true 时 input 可编辑，内置/自定义过滤，受控/非受控搜索词管理。
 * - filterable=false 或无搜索词：返回 resolvedOptions（不过滤）
 * - IME 组合输入期间：返回 resolvedOptions（不过滤，避免组合中间值触发过滤）
 * - filterMethod 存在：调用 filterMethod（自行处理），OSelect 不做过滤
 * - filterOption=false：不过滤（远程搜索）
 * - filterOption=true（默认）或函数：按 filterOption 过滤
 * @param props 响应式 props 子集
 * @param deps 外部依赖
 * @returns innerInputValue, mergedInputValue, isClearable, displayInputValue, filteredOptions
 */
export function useSelectFilter(props: UseSelectFilterProps, deps: UseSelectFilterDeps) {
  const { isComposing, isSelecting, valueList, optionLabels, resolvedOptions, isOptionGroup, effectiveDisabled, effectiveClearable } = deps;

  /** 内部搜索词（非受控） */
  const innerInputValue = ref('');

  /** 合并后的搜索词（受控优先，非受控兜底） */
  const mergedInputValue = computed(() => props.inputValue ?? innerInputValue.value);

  /**
   * 是否可清除
   * @description 有选中值或搜索词时显示清除按钮；clearable 和 disabled 取自表单继承后的 effective 值
   */
  const isClearable = computed(() => effectiveClearable.value && !effectiveDisabled.value && (valueList.value.length > 0 || !!mergedInputValue.value));

  /**
   * input 的显示值
   * - 多选模式：返回搜索词或空（tag 负责展示选中值，input 不回填 label）
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
      if (isOptionGroup(item)) {
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

  return {
    innerInputValue,
    mergedInputValue,
    isClearable,
    displayInputValue,
    filteredOptions,
  };
}
