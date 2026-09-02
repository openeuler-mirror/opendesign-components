import { computed, type ComputedRef, type Ref } from 'vue';
import type { SelectMixedOption, SelectOptionData, SelectOptionGroupData, SelectOptionT } from '../types';

/**
 * 创建选项所需的 props 子集
 */
interface UseCreateOptionProps {
  /** 创建项的显示文案生成函数，不传时走 i18n 默认文案 */
  createLabel?: (input: string) => string;
  /** 分词符数组，输入或粘贴含分隔符时拆分为多个值 */
  tokenSeparators: string[];
  /** 支持多选 */
  multiple: boolean;
}

/**
 * 创建选项的外部依赖
 */
interface UseCreateOptionDeps {
  /** 解析后的选项数据（含分组） */
  resolvedOptions: ComputedRef<SelectMixedOption[]>;
  /** 类型守卫：判断 SelectMixedOption 是否为分组选项 */
  isOptionGroup: (item: SelectMixedOption) => item is SelectOptionGroupData;
  /** 实际是否开启创建：allowCreate 或（autoTagInMultiple && multiple） */
  effectiveAllowCreate: ComputedRef<boolean>;
  /** 合并后的搜索词（受控优先，非受控兜底） */
  mergedInputValue: ComputedRef<string>;
  /** IME 组合输入状态 */
  isComposing: Ref<boolean>;
  /** 是否为响应式模式（pad/phone） */
  isResponding: ComputedRef<boolean>;
  /** 内部搜索词（非受控） */
  innerInputValue: Ref<string>;
  /** 选中值列表 */
  valueList: Ref<Array<string | number>>;
  /** 用户通过 allowCreate 创建的选项列表 */
  createdOptions: Ref<SelectOptionData[]>;
  /** 已选值的选项缓存 Map（选项卸载后保留） */
  cachedOptionMap: Map<string | number, SelectOptionT>;
  /** i18n 翻译函数 */
  t: (key: string, params?: Record<string, unknown>) => string;
  /** emit('create', value) 回调 */
  emitCreate: (value: string) => void;
  /** emit('update:inputValue', value) 回调 */
  emitUpdateInputValue: (value: string) => void;
  /** emit('update:modelValue', value) 回调 */
  emitUpdateValue: (value: Array<string | number>) => void;
  /** emit('change', ...) 回调（含表单校验触发） */
  emitChange: (value: Array<string | number>) => void;
}

/**
 * 创建选项 + 分词 composable
 * @description allowCreate=true 时输入不存在的值，下拉首项显示「创建 xxx」；
 * tokenSeparators 支持输入或粘贴含分隔符时拆分为多个值（仅 multiple + allowCreate 模式生效）。
 * @param props 响应式 props 子集
 * @param deps 外部依赖
 * @returns createOption, handleTokenSeparators, valueExistsInOptions
 */
function UseCreateOption(props: UseCreateOptionProps, deps: UseCreateOptionDeps) {
  const {
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
    emitCreate,
    emitUpdateInputValue,
    emitUpdateValue,
    emitChange,
  } = deps;

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
   * 处理单个 token：如果不在已选列表中则添加
   * @param token 输入的分词片段
   */
  const processToken = (token: string) => {
    const trimmed = token.trim();
    if (!trimmed || valueList.value.some((v) => v === trimmed)) return;
    if (!valueExistsInOptions(trimmed)) {
      emitCreate(trimmed);
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
    emitUpdateInputValue('');
    return true;
  };

  return {
    createOption,
    handleTokenSeparators,
    valueExistsInOptions,
  };
}

export { UseCreateOption as useCreateOption };
