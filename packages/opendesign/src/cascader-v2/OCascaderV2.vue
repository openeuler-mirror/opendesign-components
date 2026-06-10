<script setup lang="ts">
import { computed, provide, ref, watch, inject, nextTick } from 'vue';
import { IconChevronDown, IconClose, IconLoading } from '../_utils/icons';
import { OPopup } from '../popup';
import { OPopover } from '../popover';
import { OScroller } from '../scrollbar';
import ClientOnly from '../_components/client-only';
import { InBox } from '../_components/in-box';
import OCascaderV2Panel from './OCascaderV2Panel.vue';

import { isArray, isFunction, isArrayEqual, isUndefined } from '../_utils/is';

import { formItemInjectKey } from '../form/provide';
import { cascaderV2InjectKey } from './provide';

import { SelectOptionT } from '../select/types';
import { cascaderV2Props, type CascaderV2NodePathT, type CascaderV2NodeValueT, type CascaderV2LazyNodeT } from './types';

const props = defineProps(cascaderV2Props);
const emits = defineEmits<{
  /**
   * @zh-CN v-model 双向绑定的更新事件，选中值变化时触发，值形态受 pathMode / multiple 影响
   * @en-US v-model update event, emitted when the selected value changes, value form depends on pathMode / multiple
   */
  (e: 'update:modelValue', value: CascaderV2NodeValueT | CascaderV2NodePathT | Array<CascaderV2NodeValueT | CascaderV2NodePathT> | undefined): void;
  /**
   * @zh-CN 选中值变化时触发，参数与 update:modelValue 一致，便于不使用 v-model 的场景监听
   * @en-US Emitted when the selected value changes, same params as update:modelValue, for non-v-model scenarios
   */
  (e: 'change', value: CascaderV2NodeValueT | CascaderV2NodePathT | Array<CascaderV2NodeValueT | CascaderV2NodePathT> | undefined): void;
  /**
   * @zh-CN 选项浮层显示/隐藏切换时触发，true 表示打开，false 表示关闭
   * @en-US Emitted when the options panel visibility changes, true for open, false for close
   */
  (e: 'options-visible-change', value: boolean): void;
  /**
   * @zh-CN 点击清除按钮时触发，参数为原始 DOM 事件
   * @en-US Emitted when the clear button is clicked, parameter is the original DOM event
   */
  (e: 'clear', evt: Event): void;
  /**
   * @zh-CN 懒加载子节点失败时触发，参数为加载失败的节点信息
   * @en-US Emitted when lazy loading fails, parameter is the failed node info
   */
  (e: 'lazyload-error', node: CascaderV2LazyNodeT): void;
}>();

defineSlots<{
  /**
   * @zh-CN 默认面板内容，可自定义整个下拉面板
   * @en-US Default panel content, can customize the entire dropdown panel
   */
  default(): any;
  /**
   * @zh-CN 折叠标签自定义文本
   * @en-US Custom text for folded tags
   */
  tagFold(): any;
  /**
   * @zh-CN 下拉箭头图标，参数 active 表示面板是否展开
   * @en-US Dropdown arrow icon, param active indicates whether the panel is open
   */
  arrow(props: { active: boolean }): any;
  /**
   * @zh-CN 后缀区域内容，参数 active 表示面板是否展开
   * @en-US Suffix area content, param active indicates whether the panel is open
   */
  suffix(props: { active: boolean }): any;
}>();

const cascaderV2Ref = ref<InstanceType<typeof InBox>>();
const cascaderV2El = computed(() => cascaderV2Ref.value?.$el as HTMLElement | undefined);
const cascaderv2Panel = ref<HTMLElement>();
const inputRef = ref<HTMLInputElement>();
const inputMirrorRef = ref<HTMLSpanElement>();
const inputWidth = ref(12);

const isSelecting = ref(false);
const lazyRootLoading = ref(false);
// 记录最近一次点击是否在 InBox 内部
const lastClickWasInside = ref(false);
// trigger 图标只响应外部 props.loading，懒加载状态在面板内部处理
const effectiveLoading = computed(() => props.loading);

const tagPopoverVisible = ref(false);

// 表单注入，用于规则校验
const formItemInjection = inject(formItemInjectKey, null);

const foldTrigger = typeof props.showFoldTags === 'string' ? props.showFoldTags : 'hover';

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type || 'normal';
  }
  return props.color;
});

// 存储每个value对应的label
const optionLabels = ref<Record<string | number, string>>({});

// 选项选中的记录
const valueList = ref<Array<string | number>>([]);
// 最终选择值
const finalValueList = ref<Array<string | number>>([]);
// 搜索过滤值
const filterValue = ref();
// 存储每个叶子节点value对应的完整路径（emitPath使用）
const pathMap = ref<Record<string | number, CascaderV2NodePathT>>({});

/**
 * 解析多选模式下的 modelValue：emitPath 时每项为路径数组，否则为单值
 * @param v 多选 modelValue（数组）
 * @returns 叶子节点列表与路径映射
 */
const parseMultipleModelValue = (v: unknown) => {
  const leaves: Array<string | number> = [];
  const paths: Record<string | number, CascaderV2NodePathT> = {};
  if (!isArray(v)) {
    return { leaves, paths };
  }
  (v as Array<unknown>).forEach((item) => {
    if (props.emitPath && isArray(item)) {
      const path = item as CascaderV2NodePathT;
      const leaf = path[path.length - 1];
      leaves.push(leaf);
      paths[leaf] = path;
      return;
    }
    leaves.push(item as string | number);
  });
  return { leaves, paths };
};

/**
 * 解析单选模式下的 modelValue：emitPath 时为路径数组，否则为单值
 * @param v 单选 modelValue
 * @returns 叶子节点列表与路径映射
 */
const parseSingleModelValue = (v: unknown) => {
  const leaves: Array<string | number> = [];
  const paths: Record<string | number, CascaderV2NodePathT> = {};
  if (props.emitPath && isArray(v) && (v as Array<unknown>).length > 0) {
    const path = v as CascaderV2NodePathT;
    const leaf = path[path.length - 1];
    leaves.push(leaf);
    paths[leaf] = path;
    return { leaves, paths };
  }
  if (isArray(v)) {
    const arr = v as Array<string | number>;
    if (arr.length > 0) leaves.push(arr[arr.length - 1]);
    return { leaves, paths };
  }
  if (!isUndefined(v)) {
    leaves.push(v as string | number);
  }
  return { leaves, paths };
};

// 从modelValue解析出叶子节点列表和路径映射
const parseModelValue = (v: typeof props.modelValue) => {
  return props.multiple ? parseMultipleModelValue(v) : parseSingleModelValue(v);
};

// 初始化valueList
const { leaves: initLeaves, paths: initPaths } = parseModelValue(props.modelValue);
valueList.value = initLeaves;
Object.assign(pathMap.value, initPaths);
finalValueList.value = [...valueList.value];

const valueListDisplay = computed(() => {
  if (!props.maxTagCount) {
    return finalValueList.value;
  }
  return finalValueList.value.slice(0, props.maxTagCount);
});

const valueListFold = computed(() => {
  if (!props.maxTagCount) {
    return [];
  }
  return finalValueList.value.slice(props.maxTagCount);
});

const foldLabel = computed(() => {
  if (props.foldLabel) {
    const tags = valueListFold.value.map((item) => ({
      value: item,
      label: optionLabels.value[item],
    }));
    return props.foldLabel(tags);
  }
  return `+${valueListFold.value.length}`;
});

const isClearable = computed(
  () => props.clearable && !props.disabled && (valueList.value.some((v) => v !== '' && !isUndefined(v)) || Boolean(filterValue.value)),
);

watch(
  () => props.modelValue,
  (v) => {
    const { leaves, paths } = parseModelValue(v);
    if (props.multiple) {
      // 判断是否值相等 #I9IJT2
      if (!isArrayEqual(leaves, valueList.value)) {
        valueList.value = leaves;
      }
    } else {
      valueList.value = leaves;
    }
    Object.assign(pathMap.value, paths);
    finalValueList.value = [...valueList.value];
  },
);

const getEmitValue = (value: Array<string | number>) => {
  if (props.emitPath) {
    if (props.multiple) {
      return value.map((v) => pathMap.value[v] ?? [v]);
    } else {
      const leaf = value[0];
      return leaf !== undefined ? (pathMap.value[leaf] ?? [leaf]) : undefined;
    }
  } else {
    if (props.multiple) {
      return [...value];
    } else {
      return value[0];
    }
  }
};

const emitChange = (value: Array<string | number>) => {
  emits('change', getEmitValue(value));
  formItemInjection?.fieldHandlers.onChange?.();
};

const emitUpdateValue = (value: Array<string | number>) => {
  emits('update:modelValue', getEmitValue(value));
};

// 清除值
const clearClick = (e: Event) => {
  e.stopPropagation();

  valueList.value = [];
  finalValueList.value = [];
  pathMap.value = {};
  filterValue.value = '';
  emits('clear', e);

  emitChange(valueList.value);
  emitUpdateValue(valueList.value);
};

/**
 * 调用 props.beforeSelect 决定最终落库的选中值
 * @param value 用户当前操作想要选中的节点值
 * @returns 最终选中值；返回 null 表示被拦截、不应落库
 */
const resolveSelectValue = async (value: string | number): Promise<string | number | null> => {
  if (!isFunction(props.beforeSelect)) return value;
  const rlt = await props.beforeSelect(value, props.multiple ? valueList.value : valueList.value[0]);
  if (rlt === false) return null;
  return typeof rlt === 'boolean' ? value : rlt;
};

/**
 * 单选模式下写入新选中值，仅在变化时触发事件
 * @param toValue 最终选中值
 */
const applySingleSelect = (toValue: string | number) => {
  if (valueList.value[0] === toValue) return;
  valueList.value[0] = toValue;
  emitUpdateValue(valueList.value);
  emitChange(valueList.value);
};

/**
 * 多选模式下切换选中状态，并在可筛选时清空搜索输入
 * @param toValue 最终选中值
 */
const applyMultipleSelect = (toValue: string | number) => {
  const idx = valueList.value.indexOf(toValue);
  if (idx > -1) {
    valueList.value.splice(idx, 1);
  } else {
    valueList.value.push(toValue);
  }
  emitUpdateValue(valueList.value);
  emitChange(valueList.value);
  if (props.filterable) {
    filterValue.value = '';
  }
};

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  filterValue.value = input.value;
};

provide(cascaderV2InjectKey, {
  multiple: props.multiple,
  allowSelectAnyNode: props.allowSelectAnyNode,
  selectValue: valueList,
  filterValue,
  isSelecting,
  loading: computed(() => props.loading),
  doSelectBatch(toAdd: Array<{ value: string | number; label: string; path: CascaderV2NodePathT }>, toRemove: Array<string | number>) {
    toAdd.forEach((item) => {
      if (!valueList.value.includes(item.value)) {
        valueList.value.push(item.value);
        optionLabels.value[item.value] = item.label;
        pathMap.value[item.value] = item.path;
      }
    });
    toRemove.forEach((v) => {
      const idx = valueList.value.indexOf(v);
      if (idx > -1) valueList.value.splice(idx, 1);
    });
    emitUpdateValue(valueList.value);
    emitChange(valueList.value);
  },
  doSelect: async (option: SelectOptionT, path?: CascaderV2NodePathT) => {
    const toValue = await resolveSelectValue(option.value);
    if (toValue === null) return;

    // beforeSelect 改写了值时，原 path 不再对应新值，跳过映射写入，让 getEmitValue 回退到 [toValue]
    if (path && toValue === option.value) {
      pathMap.value[toValue] = path;
    }

    if (props.multiple) {
      applyMultipleSelect(toValue);
      return;
    }
    applySingleSelect(toValue);
  },
  registerOption(option: SelectOptionT) {
    if (optionLabels.value[option.value] !== option.label) {
      optionLabels.value[option.value] = option.label;
    }
  },
  registerPath(value: string | number, path: CascaderV2NodePathT) {
    pathMap.value[value] = path;
  },
  hidePanel() {
    isSelecting.value = false;
  },
  showPanel() {
    isSelecting.value = true;
  },
  setRootLoading(v: boolean) {
    lazyRootLoading.value = v;
  },
  onLazyloadError(node: CascaderV2LazyNodeT) {
    emits('lazyload-error', node);
  },
});

const onOptionVisibleChange = (visible: boolean) => {
  emits('options-visible-change', visible);
};

const onRemoveTag = (value: string | number, e: Event) => {
  if (props.disabled) {
    return;
  }

  e.stopPropagation();

  const idx = valueList.value.indexOf(value);
  if (idx > -1) {
    valueList.value.splice(idx, 1);

    emitChange(valueList.value);
    emitUpdateValue(valueList.value);
  }
};

const onFoldTagClick = (e: Event) => {
  if (foldTrigger === 'click') {
    e.stopPropagation();
  }
};

const beforeTagPopoverShow = () => {
  if (props.disabled) {
    return false;
  }
  return true;
};

const handleClickEvent = (e: Event) => {
  if (props.disabled) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  // 标记点击在 InBox 内部
  lastClickWasInside.value = true;

  // 点击 InBox 非 input 区域时聚焦 input；
  if (props.filterable && inputRef.value && e.target !== inputRef.value) {
    inputRef.value.focus();
  }
};

// 鼠标离开 InBox 时重置标记
const handleMouseLeave = () => {
  lastClickWasInside.value = false;
};

const beforeOptionsHide = () => {
  // filterable 模式下，如果点击的是 InBox 内部，不关闭面板
  if (props.filterable && lastClickWasInside.value) {
    return false;
  }

  if (isFunction(props.beforeOptionsHide)) {
    return props.beforeOptionsHide();
  }
  return true;
};

watch(filterValue, async () => {
  await nextTick();
  if (props.filterable && valueListDisplay.value.length > 0 && inputMirrorRef.value) {
    inputWidth.value = Math.max(12, inputMirrorRef.value.offsetWidth + 2);
  } else {
    inputWidth.value = 12;
  }
});

// 下拉面板展开时 隐藏tag popover并聚焦输入框，关闭时取消聚焦
watch(
  () => isSelecting.value,
  (newVal) => {
    if (newVal) {
      tagPopoverVisible.value = false;
      // 可搜索状态下聚焦输入框
      if (props.filterable) {
        nextTick(() => {
          if (inputRef.value) {
            inputRef.value.focus();
          }
        });
      }
    } else {
      // 面板真正关闭后再清空过滤值，避免 hover 触发场景下被推测性关闭误清空
      filterValue.value = '';
    }
  },
);
</script>
<template>
  <InBox
    ref="cascaderV2Ref"
    v-bind="{
      size: props.size,
      variant: props.variant,
      color: color,
      disabled: props.disabled,
      round: props.round,
      focused: isSelecting,
    }"
    class="o-cascader-v2"
    :class="[
      `o-cascader-v2-${props.size}`,
      {
        'is-selecting': isSelecting,
        'is-multiple': props.multiple && valueList.length > 0,
        'o-cascader-v2-clearable': isClearable,
        'o-cascader-v2-is-loading': effectiveLoading,
      },
    ]"
    @click="handleClickEvent"
    @mouseleave="handleMouseLeave"
  >
    <OScroller class="o-cascader-v2-tags-scroller" wrap-class="o-cascader-v2-value-list" show-type="hover" size="small" :disabled-y="props.disabled" disabled-x>
      <input
        v-if="!props.multiple || (props.multiple && valueList.length === 0)"
        ref="inputRef"
        :disabled="props.disabled"
        :value="filterValue || optionLabels[valueList[0]]"
        :placeholder="props.placeholder"
        :readonly="!props.filterable"
        type="text"
        class="o-cascader-v2-input"
        @input="handleInput"
      />
      <div v-else class="o-cascader-v2-tags-wrap">
        <div v-for="item in valueListDisplay" :key="item" class="o-cascader-v2-tag">
          <span class="o-cascader-v2-tag-text">{{ optionLabels[item] }}</span>
          <div class="o-cascader-v2-tag-remove" :class="{ 'o-cascader-v2-tag-remove-disabled': props.disabled }" @click="(e: Event) => onRemoveTag(item, e)">
            <IconClose />
          </div>
        </div>
        <OPopover
          v-if="showFoldTags && valueListFold.length > 0"
          v-model:visible="tagPopoverVisible"
          :trigger="foldTrigger"
          :before-show="beforeTagPopoverShow"
          :disabled="props.disabled"
          wrap-class="o-cascader-v2-tag-popover"
          position="top"
        >
          <template #target>
            <div class="o-cascader-v2-tag" @click="onFoldTagClick">
              <slot name="tag-fold">{{ foldLabel }}</slot>
            </div>
          </template>
          <div class="o-cascader-v2-tags">
            <div v-for="item in valueListFold" :key="item" class="o-cascader-v2-tag">
              <span class="o-cascader-v2-tag-text">{{ optionLabels[item] }}</span>
              <div
                class="o-cascader-v2-tag-remove"
                :class="{ 'o-cascader-v2-tag-remove-disabled': props.disabled }"
                @click="(e: Event) => onRemoveTag(item, e)"
              >
                <IconClose />
              </div>
            </div>
          </div>
        </OPopover>

        <!-- 镜像元素，可搜索模式下用于动态测量输入框宽度 -->
        <span v-if="props.filterable && valueListDisplay.length > 0" ref="inputMirrorRef" class="o-cascader-v2-input-mirror" aria-hidden="true">{{
          filterValue || ''
        }}</span>
        <!-- 多选搜索框 -->
        <input
          v-if="props.filterable"
          ref="inputRef"
          :value="filterValue"
          :readonly="!props.filterable"
          :disabled="props.disabled"
          type="text"
          class="o-cascader-v2-input"
          :style="props.filterable && valueListDisplay.length > 0 ? { width: `${inputWidth}px` } : { width: '100%' }"
          @input="handleInput"
        />
      </div>
      <div class="o-cascader-v2-suffix">
        <div class="o-cascader-v2-suffix-icon">
          <div v-if="effectiveLoading" class="o-cascader-v2-loading">
            <IconLoading class="o-rotating" />
          </div>
          <div v-else-if="isClearable" class="o-cascader-v2-clear" @click="clearClick">
            <IconClose class="o-cascader-v2-clear-icon" />
          </div>
          <div class="o-cascader-v2-arrow" :class="{ active: isSelecting }">
            <slot name="arrow" :active="isSelecting">
              <IconChevronDown />
            </slot>
          </div>
        </div>
        <slot name="suffix" :active="isSelecting"></slot>
      </div>
    </OScroller>
    <ClientOnly>
      <teleport :to="cascaderv2Panel" :disabled="!cascaderv2Panel">
        <div v-show="cascaderv2Panel">
          <slot>
            <OCascaderV2Panel
              :options="props.options"
              :model-value="props.modelValue"
              :path-mode="props.pathMode"
              :expand-trigger="props.expandTrigger"
              :size="props.size"
              :show-all-levels="props.showAllLevels"
              :filterable="props.filterable"
              :lazy="props.lazy"
              :lazyload="props.lazyload"
            />
          </slot>
        </div>
      </teleport>
      <OPopup
        v-if="!props.disabled"
        v-model:visible="isSelecting"
        :transition="props.transition"
        :unmount-on-hide="props.unmountOnHide"
        :position="props.optionPosition"
        :wrapper="props.optionsWrapper"
        :target="cascaderV2El"
        :trigger="props.trigger"
        :adjust-min-width="props.optionWidthMode === 'min-width'"
        :adjust-width="props.optionWidthMode === 'width'"
        :before-show="props.beforeOptionsShow"
        :before-hide="beforeOptionsHide"
        :offset="4"
        wrap-class="o-cascader-v2-panel-popup"
        @change="onOptionVisibleChange"
      >
        <div ref="cascaderv2Panel"></div>
      </OPopup>

      <!-- TODO 移动端 -->
    </ClientOnly>
  </InBox>
</template>
