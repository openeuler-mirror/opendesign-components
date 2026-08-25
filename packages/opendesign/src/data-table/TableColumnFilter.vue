<script setup lang="ts">
import { computed, MaybeRef, provide, reactive, ref, toValue, watch, watchEffect } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

import { OButton } from '../button';
import { OPopup } from '../popup';
import { ODialog } from '../dialog';
import { OIconSearch, OIconFilter } from '../icon-components';
import { ODivider } from '../divider';
import { OLink } from '../link';
import { OOption, OOptionList } from '../option';
import { OInput } from '../input';
import { useI18n } from '../locale';
import { isFunction, isNil } from '../_utils/is.ts';
import { selectOptionInjectKey } from '../select/provide';
import { useScreen } from '../hooks';

import { DataTableColumnFilterOption, EffectiveDataTableColumnT, TABLE_ALL_OPTION_VALUE, TABLE_EMPTY_OPTION_VALUE } from './types.ts';

type ValueT = number | string;
type OptionT = DataTableColumnFilterOption<string, ValueT>;

const props = defineProps<{
  column: EffectiveDataTableColumnT;
  disabled?: boolean;
}>();
const emits = defineEmits<{
  (e: 'confirm'): void;
}>();
const modelValue = defineModel<ValueT[]>('modelValue', { default: () => reactive([]) });

const [DefineBodyTemplate, ReuseBodyTemplate] = createReusableTemplate();
const targetIconRef = ref<HTMLElement>();
const { t } = useI18n();
const { isPhonePadSize } = useScreen();

const tempValue = ref<ValueT[]>([]);

const options = ref<OptionT[]>([]);
/**
 * 版本计数器，防止异步竞态：optionsFn 异步返回前若依赖再次变更，
 * 旧 Promise 的结果将被丢弃，不会覆盖最新数据。
 */
let optionsVersion = 0;

/**
 * @description 使用 watchEffect 自动追踪 optionsFn 内部的响应式依赖；
 *              当依赖变更时自动重新调用 optionsFn 获取最新选项。
 *              flush: 'post' 确保在 DOM 更新后执行，服务端不运行（SSR 兼容）。
 * @important optionsFn 同步段访问的 ref/reactive 会被自动追踪；
 *            async optionsFn 中 await 之后的依赖无法被追踪（Vue 限制）。
 */
watchEffect(
  async () => {
    const filter = props.column.filter;
    if (!filter?.optionsFn) {
      options.value = [];
      return;
    }

    const currentVersion = ++optionsVersion;
    const result = await filter.optionsFn({
      column: props.column,
      emptyOption: { label: t('table.filterEmptyOption'), value: TABLE_EMPTY_OPTION_VALUE },
    });

    if (currentVersion === optionsVersion) {
      options.value = result || [];
    }
  },
  { flush: 'post' },
);
const filterKeywords = ref('');
const showOptions = computed(() => {
  return filterKeywords.value
    ? options.value.filter((v) => v.label.toLocaleLowerCase().includes(filterKeywords.value.toLocaleLowerCase()))
    : [...options.value];
});

const visible = ref(false);
watch(visible, () => {
  tempValue.value = [...modelValue.value];
  if (tempValue.value.length === options.value.length || (props.column.filter?.multiple === false && !tempValue.value.length)) {
    tempValue.value.push(TABLE_ALL_OPTION_VALUE);
  }
});

const toExcludeAllOption = (arr: MaybeRef<ValueT[]>) => toValue(arr).filter((v) => v !== TABLE_ALL_OPTION_VALUE);

const indeterminate = computed(() => {
  return !!tempValue.value.length && toExcludeAllOption(tempValue).length < options.value.length;
});

const handleConfirm = () => {
  modelValue.value = tempValue.value.filter((v) => v !== TABLE_ALL_OPTION_VALUE);
  visible.value = false;
  emits('confirm');
};
const handleReset = () => {
  tempValue.value = [];
  modelValue.value = [];
  visible.value = false;
  emits('confirm');
};

const multiple = computed(() => props.column.filter?.multiple ?? true);
const showInput = computed(() => {
  if (isFunction(props.column.filter?.showInput)) {
    return props.column.filter.showInput(options.value.length);
  }
  if (!isNil(props.column.filter?.showInput)) {
    return !!props.column.filter?.showInput;
  }
  return options.value.length > 8;
});
provide(selectOptionInjectKey, {
  multiple,
  selectValue: tempValue,
  async select({ value }) {
    const isAdd = !tempValue.value.includes(value);
    if (!multiple.value) {
      modelValue.value = isAdd ? [value].filter((v) => v !== TABLE_ALL_OPTION_VALUE) : [];
      visible.value = false;
      emits('confirm');
      return;
    }
    if (value === TABLE_ALL_OPTION_VALUE) {
      tempValue.value = isAdd ? [...showOptions.value.map((v) => v.value), TABLE_ALL_OPTION_VALUE] : [];
      return;
    }
    if (isAdd) {
      tempValue.value.push(value);
    } else {
      tempValue.value = tempValue.value.filter((v) => v !== value);
    }
    if (!!tempValue.value.length && toExcludeAllOption(tempValue).length === options.value.length) {
      tempValue.value = Array.from(new Set([...tempValue.value, TABLE_ALL_OPTION_VALUE]));
    } else {
      tempValue.value = tempValue.value.filter((v) => v !== TABLE_ALL_OPTION_VALUE);
    }
  },
  registerOption() {},
});

const handleTriggerClick = () => {
  if (isPhonePadSize.value) {
    visible.value = true;
  }
};
</script>

<template>
  <OButton
    v-show="options.length"
    ref="targetIconRef"
    :disabled="props.disabled"
    :icon="OIconFilter"
    size="small"
    :class="{ 'o-data-table-column-filter__trigger': true, active: !!modelValue.length || visible, disabled: props.disabled }"
    :style="$attrs.style"
    @click="handleTriggerClick"
  />

  <DefineBodyTemplate>
    <div v-if="showInput" class="o-data-table-column-filter__input-container">
      <OInput v-model="filterKeywords" :placeholder="t('table.filterPlaceholder')" clearable size="medium">
        <template #prefix><OIconSearch class="o-data-table-column-filter__input-icon" /></template>
      </OInput>
    </div>

    <div class="o-data-table-column-filter__options-container">
      <OOptionList v-if="showOptions.length" :scrollbar="{ size: 'small', showType: 'hover' }">
        <OOption v-if="!filterKeywords" :value="TABLE_ALL_OPTION_VALUE" :label="t('common.checkAll')" :indeterminate="indeterminate" />
        <OOption v-for="option in showOptions" :key="option.value" :value="option.value" :label="option.label" />
      </OOptionList>

      <div v-else class="o-data-table-column-filter__empty">{{ t('common.empty') }}</div>
    </div>
  </DefineBodyTemplate>
  <ODialog
    v-if="isPhonePadSize"
    v-model:visible="visible"
    :mask-close="!multiple"
    size="small"
    :scrollbar="false"
    class="o-data-table-column-filter-dialog"
    main-class="o-data-table-column-filter-wrapper"
    :style="$attrs.style"
  >
    <template v-if="props.column.filter?.optionTitle" #header>
      <div class="o-data-table-column-filter-options-head">{{ props.column.filter.optionTitle }}</div>
    </template>
    <template #default>
      <ReuseBodyTemplate />
    </template>
    <template v-if="multiple" #actions>
      <OButton class="o-dlg-btn" variant="text" size="large" @click="handleReset">
        {{ t('common.reset') }}
      </OButton>
      <OButton class="o-dlg-btn" variant="text" size="large" :disabled="!tempValue.length" @click="handleConfirm">
        {{ t('common.filter') }}
      </OButton>
    </template>
  </ODialog>
  <OPopup
    v-else-if="!props.disabled"
    v-model:visible="visible"
    :offset="4"
    :target="targetIconRef"
    trigger="click"
    position="bl"
    class="o-data-table-column-filter-popup"
    wrap-class="o-data-table-column-filter-wrapper"
    :style="$attrs.style"
  >
    <template #default>
      <ReuseBodyTemplate />
      <template v-if="multiple">
        <ODivider class="o-data-table-column-filter__divider" />
        <div class="o-data-table-column-filter__footer">
          <OLink color="primary" :hover-underline="false" :disabled="!tempValue.length" @click="handleConfirm">{{ t('common.filter') }}</OLink>
          <OLink color="primary" :hover-underline="false" @click="handleReset">{{ t('common.reset') }}</OLink>
        </div>
      </template>
    </template>
  </OPopup>
</template>
