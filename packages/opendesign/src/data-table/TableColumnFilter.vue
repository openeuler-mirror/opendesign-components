<script setup lang="ts" generic="ValueT">
import { computed, onMounted, ref, watch } from 'vue';
import { type PopupPropsT, OPopup } from '../popup';
import { OIconSearch, OIconFilter } from '../icon-components';
import { OCheckbox } from '../checkbox';
import { OCheckboxGroup } from '../checkbox-group';
import { OInput } from '../input';
import { OButton } from '../button';
import { OScroller } from '../scrollbar';
import { DataTableColumnFilterOptionsFn, DataTableColumnFilterOption, EffectiveDataTableColumnT } from './types.ts';
import { useI18n } from '../locale';

const props = defineProps<{
  column: EffectiveDataTableColumnT;
  optionsFn?: DataTableColumnFilterOptionsFn<string, ValueT>;
  popupProps?: PopupPropsT;
}>();
const emits = defineEmits<{
  (e: 'confirm'): void;
}>();
const modelValue = defineModel<ValueT[]>('modelValue', { default: [] });

const { t } = useI18n();

const tempValue = ref<ValueT[]>([]);
const visible = ref(false);
watch(visible, () => {
  tempValue.value = modelValue.value;
});

const options = ref<DataTableColumnFilterOption<string, ValueT>[]>([]);
onMounted(async () => {
  options.value = (await props.optionsFn?.(props.column)) || [];
});
const filterKeywords = ref('');
const showOptions = computed(() => {
  const propOptions = filterKeywords.value ? options.value.filter((v) => v.label.includes(filterKeywords.value)) : options.value;
  return [
    ...propOptions,
    // TODO 约定空白文案与传参
    // { label: '空白', value: '$$_null' as ValueT }
  ];
});

const allChecked = ref<string[]>([]);
const indeterminate = computed(() => {
  return !!tempValue.value.length && tempValue.value.length < options.value.length + 1;
});
watch(tempValue, (newVal) => {
  allChecked.value = newVal.length ? ['1'] : [];
});
const handleChangeAll = () => {
  if (!tempValue.value.length || indeterminate.value) {
    tempValue.value = showOptions.value.map((v) => v.value as ValueT);
    return;
  }
  tempValue.value = [];
};

const handleConfirm = () => {
  modelValue.value = tempValue.value as ValueT[];
  visible.value = false;
  emits('confirm');
};
const handleReset = () => {
  tempValue.value = [];
  modelValue.value = [];
  allChecked.value = [];
  visible.value = false;
  emits('confirm');
};
</script>

<template>
  <OPopup v-bind="$attrs" v-model:visible="visible" class="o-data-table-column-filter">
    <template #target>
      <OIconFilter :class="{ 'o-data-table-column-filter__trigger': true, active: !!modelValue.length }" />
    </template>
    <template #default>
      <OInput v-model="filterKeywords" :placeholder="t('common.search')" clearable>
        <template #prefix><OIconSearch /></template>
      </OInput>
      <OCheckbox v-model="allChecked" value="1" :indeterminate="indeterminate" class="o-data-table-filter__all-checkbox" @change="handleChangeAll">
        {{ t('common.checkAll') }}
      </OCheckbox>
      <OScroller disabled-x size="small" show-type="always">
        <OCheckboxGroup v-model="tempValue as (string | number)[]" direction="v">
          <OCheckbox v-for="option in showOptions" :key="option.value as string" :value="option.value as string">{{ option.label }}</OCheckbox>
        </OCheckboxGroup>
      </OScroller>
      <div class="o-data-table-filter__footer">
        <OButton round="pill" color="primary" variant="solid" @click="handleConfirm">{{ t('common.confirm') }}</OButton>
        <OButton round="pill" color="primary" @click="handleReset">{{ t('common.reset') }}</OButton>
      </div>
    </template>
  </OPopup>
</template>
