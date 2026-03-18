<script setup lang="ts">
import { computed, ref, inject, watch, type ComponentPublicInstance, nextTick } from 'vue';
import { OSelect } from '../select';
import { OOption } from '../option';
import { OInput } from '../input';
import { isArray } from '../_utils/is';
import { splitByMatch } from '../_utils/string';
import { debounce } from '../_utils/helper';
import { OIconSearch } from '../icon-components';
import { formItemInjectKey } from '../form/provide';
import { vOutClick } from '../directives';
import { searchProps } from './types';

const props = defineProps(searchProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event, value: string): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'prefix-selected', value: string | undefined): void;
  (e: 'suffix-selected', value: string | undefined): void;
  (e: 'suggesstion-selected', value: string | undefined): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
  (e: 'options-visible-change', value: boolean): void;
}>();

const formItemInjection = inject(formItemInjectKey, null);

const searchInputRef = ref<ComponentPublicInstance>();
const searchSelectRef = ref<InstanceType<typeof OSelect>>();
const selectedValOfPrefix = ref(props.prefixSelectedVal);
const selectedValOfSuffix = ref(props.suffixSelectedVal);

const inputValue = ref(props.modelValue ?? (props.defaultValue || ''));

let previousValue = inputValue.value;

const isOutClick = ref(false);

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type || undefined;
  } else {
    return props.color;
  }
});

// 因存在xlarge尺寸 为避免编辑器警告 做映射处理
const size = computed(() => {
  if (props.size === 'medium') {
    return props.size;
  }
  return 'large';
});

const optionsOfPrefixSelect = computed(() => {
  return isArray(props.optionsOfPrefixSelect) ? props.optionsOfPrefixSelect : [];
});

const optionsOfSuffixSelect = computed(() => {
  return isArray(props.optionsOfSuffixSelect) ? props.optionsOfSuffixSelect : [];
});

const showPrefixSelect = computed(() => {
  return props.showPrefixSelect && optionsOfPrefixSelect.value.length;
});

const showSuffixSelect = computed(() => {
  return props.showSuffixSelect && optionsOfSuffixSelect.value.length;
});

const suggesstions = computed(() => {
  return isArray(props.suggesstions) ? props.suggesstions : [];
});

const formatOptions = (options: Array<{ label: string; value: string | number }>, keyword: string) => {
  return options
    .map((item) => {
      return {
        ...item,
        labelSegments: splitByMatch(item.label, keyword),
      };
    })
    .filter((v) => v.labelSegments.length > 1); // 长度大于1才说明label与关键词相匹配
};

const realSuggesstions = ref(formatOptions(suggesstions.value, inputValue.value));

// 有联想面板且当前处于选择中的状态 表明联想面板正在显示
const isShowingSuggesstiongs = computed(() => {
  return realSuggesstions.value?.length && searchSelectRef.value?.isSelecting;
});

const updateSuggesstions = async (keyword: string) => {
  realSuggesstions.value = formatOptions(suggesstions.value, keyword);

  if (realSuggesstions.value.length) {
    await nextTick();

    searchSelectRef.value?.selectRef?.click();
  }
};

const formatSuggesstions = debounce(updateSuggesstions, 200, false);

const emitUpdateValue = () => {
  emits('update:modelValue', inputValue.value);
};

const onInput = (evt: Event, value: string) => {
  emits('input', evt, value);
  formatSuggesstions(value);
  formItemInjection?.fieldHandlers.onInput?.();
};

const onFocus = (evt: FocusEvent) => {
  emits('focus', evt);
  formItemInjection?.fieldHandlers.onFocus?.();
};

const onBlur = (evt: FocusEvent) => {
  emits('blur', evt);
  formItemInjection?.fieldHandlers.onBlur?.();
};

const onPressEnter = (evt: KeyboardEvent): void => {
  emits('pressEnter', evt);
};

const onClear = (evt?: Event) => {
  emits('clear', evt);
  updateSuggesstions(inputValue.value);
};

const emitChange = () => {
  if (inputValue.value !== previousValue) {
    emits('change', inputValue.value);
    previousValue = inputValue.value;
    formItemInjection?.fieldHandlers.onChange?.();
  }
};

const onChange = (value: string) => {
  inputValue.value = value;
  emitChange();
};

const onUpdateModelValue = (value: string) => {
  inputValue.value = value;
  emitUpdateValue();
};

const onSuggesstionSelected = (val: any) => {
  onUpdateModelValue(val);
  // 选择联想建议后 通知外部
  emits('suggesstion-selected', val);
};

const handleClick = () => {
  if (props.disabled) {
    return;
  }

  isOutClick.value = false;
  updateSuggesstions(inputValue.value);
};

// 外部点击 隐藏联想面板
const shouldHideOptions = () => {
  return isOutClick.value || !isShowingSuggesstiongs.value;
};

const onOutClick = () => {
  isOutClick.value = true;
};

watch(
  () => props.modelValue,
  (val?: string) => {
    if (inputValue.value !== val) {
      inputValue.value = val || '';
    }
  },
);

// 头部、尾部筛选框下拉值切换时 通知外部
watch(selectedValOfPrefix, (val?: string) => {
  emits('prefix-selected', val);
});

watch(selectedValOfSuffix, (val?: string) => {
  emits('suffix-selected', val);
});
</script>

<template>
  <div class="o-search" :class="[{ 'o-search-with-prefix': showPrefixSelect, 'o-search-with-suffix': showSuffixSelect }, `o-search-${props.size}`]">
    <!-- 头部筛选框 -->
    <OSelect
      v-if="props.showPrefixSelect"
      v-model="selectedValOfPrefix"
      class="o-search-prefix o-search-select"
      :placeholder="props.placeholderOfPrefixSelect"
      :size="size"
      :round="props.round"
      :color="color"
      :variant="props.variant"
      :disabled="props.disabled"
      :readonly="props.readonly"
    >
      <OOption v-for="item in optionsOfPrefixSelect" :key="item.value" :label="item.label" :value="item.value" />
      <!-- 筛选框头部插槽 -->
      <template #prefix>
        <slot name="prefix-of-search-prefix"></slot>
      </template>
    </OSelect>
    <div v-out-click="onOutClick" class="o-search-input-wrap" @click="handleClick">
      <OInput
        ref="searchInputRef"
        class="o-search-input"
        :model-value="inputValue"
        :placeholder="props.placeholder"
        :size="size"
        :round="props.round"
        :color="color"
        :variant="props.variant"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :clearable="props.clearable"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        @change="onChange"
        @clear="onClear"
        @press-enter="onPressEnter"
        @update:model-value="onUpdateModelValue"
        @click.prevent
      >
        <template #prefix>
          <OIconSearch class="o-search-icon" />
        </template>
      </OInput>

      <!-- 联想建议筛选框 -->
      <OSelect
        v-if="realSuggesstions.length"
        ref="searchSelectRef"
        class="o-search-select-placeholder"
        option-width-mode="width"
        trigger="click-outclick"
        :model-value="inputValue"
        :size="size"
        :round="props.round"
        :color="color"
        :variant="props.variant"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :before-options-hide="shouldHideOptions"
        :no-responsive="true"
        @update:model-value="onSuggesstionSelected"
        @click.stop
      >
        <OOption v-for="item in realSuggesstions" :key="item.value" :label="item.label" :value="item.value">
          <div class="o-search-option">
            <template v-for="(segment, idx) in item.labelSegments" :key="idx">
              <span class="o-search-label" :class="{ 'o-search-keyword-highlight': idx % 2 !== 0 }">{{ segment }}</span>
            </template>
          </div>
        </OOption>
      </OSelect>
    </div>
    <!-- 尾部筛选框 -->
    <OSelect
      v-if="props.showSuffixSelect"
      v-model="selectedValOfSuffix"
      class="o-search-suffix o-search-select"
      :placeholder="props.placeholderOfSuffixSelect"
      :size="size"
      :round="props.round"
      :color="color"
      :variant="props.variant"
      :disabled="props.disabled"
      :readonly="props.readonly"
    >
      <OOption v-for="item in optionsOfSuffixSelect" :key="item.value" :label="item.label" :value="item.value" />
      <!-- 筛选框头部插槽 -->
      <template #prefix>
        <slot name="prefix-of-search-suffix"></slot>
      </template>
    </OSelect>
  </div>
</template>
