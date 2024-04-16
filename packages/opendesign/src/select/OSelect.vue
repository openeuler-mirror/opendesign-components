<script setup lang="ts">
import { computed, provide, ref, watch, watchEffect, inject } from 'vue';
import { defaultSize, isPhonePad } from '../_utils/global';
import { IconChevronDown, IconClose, IconLoading } from '../_utils/icons';
import { OPopup } from '../popup';
import { OPopover } from '../popover';
import { ODialog } from '../dialog';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT, selectProps, SelectValueT } from './types';
import { getRoundClass } from '../_utils/style-class';
import ClientOnly from '../_components/client-only';
import { OScroller } from '../scroller';
import { isArray, isFunction, isArrayEqual } from '../_utils/is';
import SelectOption from './SelectOption.vue';
import slot from './slot';
import { filterSlots } from '../_utils/vue-utils';
import { formItemInjectKey } from '../form/provide';
import { useI18n } from '../locale';
import { OButton } from '../button';

// TODO 下拉展开时，选中值默认在视口里
const props = defineProps(selectProps);
const emits = defineEmits<{
  (e: 'update:modelValue', value: SelectValueT): void;
  (e: 'change', value: SelectValueT): void;
  (e: 'options-visible-change', value: boolean): void;
  (e: 'clear', evt: Event): void;
}>();

const { t } = useI18n();

const selectRef = ref<HTMLElement>();
const optionsRef = ref<HTMLElement | null>(null);

const isSelecting = ref(false);
const isResponding = computed(() => {
  return !props.noResponsive && isPhonePad.value;
});

const tagPopoverVisible = ref(false);
watch(
  () => isSelecting.value,
  () => {
    if (isSelecting.value) {
      tagPopoverVisible.value = false;
    }
  }
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

// 存储每个value对应的label
const optionLabels = ref<Record<string | number, string>>({});

// 使用数组存储当前value
const valueList = ref<Array<string | number>>([]); // 选项选中的记录
const finalValueList = ref<Array<string | number>>([]); // 最终选择值
// 初始化valuelist
if (isArray(props.modelValue)) {
  valueList.value = [...props.modelValue];
} else if (isArray(props.defaultValue)) {
  valueList.value = [...props.defaultValue];
} else {
  const mrValue = props.modelValue ?? props.defaultValue;
  if (mrValue) {
    valueList.value = [mrValue];
  } else {
    valueList.value = [];
  }
}
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
  return `+${valueListFold.value.length}...`;
});
const foldTrigger = typeof props.showFoldTags === 'string' ? props.showFoldTags : 'hover';

const round = getRoundClass(props, 'select');

watch(
  () => props.modelValue,
  (v) => {
    if (props.multiple) {
      // 多选

      if (isArray(v)) {
        // 判断是否值相等
        if (isArrayEqual(v, valueList.value)) {
          valueList.value = [...v];
        }
      } else {
        valueList.value = [];
      }
    } else if (valueList.value[0] !== v) {
      // 单选
      valueList.value = [v as string | number];
    }
    finalValueList.value = [...valueList.value];
  }
);

watchEffect(() => {
  if (!isResponding.value) {
    finalValueList.value = [...valueList.value];
  }
});

const isClearable = computed(() => props.clearable && !props.disabled && valueList.value.length > 0);

const emitChange = (value: Array<string | number>) => {
  if (props.multiple) {
    emits('change', [...value]);
  } else {
    emits('change', value[0]);
  }
  formItemInjection?.fieldHandlers.onChange?.();
};
const emitUpdateValue = (value: Array<string | number>) => {
  if (props.multiple) {
    emits('update:modelValue', [...value]);
  } else {
    emits('update:modelValue', value[0]);
  }
};
// 清除值
const clearClick = (e: Event) => {
  e.stopPropagation();

  valueList.value = [];
  emits('clear', e);

  emitChange(valueList.value);
  emitUpdateValue(valueList.value);
};
const beforeSelect = async (value: string | number) => {
  if (isFunction(props.beforeSelect)) {
    const rlt = await props.beforeSelect(value, props.multiple ? valueList.value : valueList.value[0]);
    return rlt;
  }
  return true;
};

provide(selectOptionInjectKey, {
  multiple: props.multiple,
  selectValue: valueList,
  select: async (option: SelectOptionT, userSelect?: boolean) => {
    if (userSelect) {
      let toValue: string | number = option.value;

      const rlt = await beforeSelect(option.value);

      if (rlt === false) {
        return;
      }
      if (typeof rlt !== 'boolean') {
        toValue = rlt;
      }

      if (!props.multiple) {
        //单选
        isSelecting.value = false;

        if (valueList.value[0] !== toValue) {
          valueList.value[0] = toValue;
          emitUpdateValue(valueList.value);
          emitChange(valueList.value);
        }
      } else {
        // 多选
        const idx = valueList.value.indexOf(toValue);
        if (idx > -1) {
          valueList.value.splice(idx, 1);
        } else {
          valueList.value.push(toValue);
        }

        if (!isResponding.value) {
          emitUpdateValue(valueList.value);
          emitChange(valueList.value);
        }
      }
    } else {
      if (optionLabels.value[option.value] !== option.label) {
        optionLabels.value[option.value] = option.label;
      }
    }
  },
});

const onOptionVisibleChange = (visible: boolean) => {
  emits('options-visible-change', visible);
};

const onRemoveTag = (value: string | number, e: MouseEvent) => {
  e.stopPropagation();

  const idx = valueList.value.indexOf(value);
  if (idx > -1) {
    valueList.value.splice(idx, 1);

    emitChange(valueList.value);
    emitUpdateValue(valueList.value);
  }
};
const onFoldTagClick = (e: MouseEvent) => {
  if (foldTrigger === 'click') {
    e.stopPropagation();
  }
};
const beforeTagPopoverShow = () => {
  if (isSelecting.value) {
    return false;
  }
  return true;
};

const onSelectClick = () => {
  if (isResponding.value) {
    if (!props.disabled) {
      isSelecting.value = true;
    }
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
    <input
      v-if="!props.multiple || (props.multiple && valueList.length === 0)"
      :value="optionLabels[valueList[0]]"
      type="text"
      :placeholder="props.placeholder"
      class="o-select-input"
      readonly
    />
    <OScroller v-else class="o-select-tags-scroller" wrap-class="o-select-value-list" show-type="hover" size="small" disabled-x>
      <div class="o-select-tags-wrap">
        <div v-for="item in valueListDisplay" :key="item" class="o-select-tag">
          {{ optionLabels[item] }}
          <div class="o-select-tag-remove" @click="(e:MouseEvent) => onRemoveTag(item, e)"><IconClose /></div>
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
              {{ optionLabels[item] }}
              <div class="o-select-tag-remove" @click="(e:MouseEvent) => onRemoveTag(item, e)"><IconClose /></div>
            </div>
          </div>
        </OPopover>
      </div>
    </OScroller>
    <div class="o-select-suffix">
      <div class="o-select-suffix-icon">
        <div v-if="props.loading" class="o-select-loading"><IconLoading class="o-rotating" /></div>
        <div v-else-if="isClearable" class="o-select-clear" @click="clearClick"><IconClose class="o-select-clear-icon" /></div>
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
        <div v-show="optionsRef">
          <slot>
            <div class="o-select-empty">
              <slot name="empty">
                <span>{{ t('common.empty') }}</span>
              </slot>
            </div>
          </slot>
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
          @change="onSelectDlgChange"
        >
          <template v-if="props.optionTitle" #header>
            <div class="o-select-options-head">{{ props.optionTitle }}</div>
          </template>
          <template #actions v-if="props.multiple">
            <OButton class="o-dlg-btn" variant="text" size="large" @click="onselectDlgCancelClick">
              {{ t('select.cancel') }}
            </OButton>
            <OButton class="o-dlg-btn" variant="text" size="large" @click="onselectDlgOkClick">
              {{ t('select.confirm') }}
            </OButton>
          </template>
          <SelectOption
            :size="props.size"
            :wrap-class="props.optionWrapClass"
            :loading="props.loading"
            class="o-select-options-dlg"
            :option-title="props.optionTitle"
            :multiple="props.multiple"
          >
            <template v-for="name in filterSlots($slots, slot.option.names)" #[name]>
              <slot :name="name"></slot>
            </template>

            <!-- option选项单独处理 -->
            <template #option-target><div ref="optionsRef"></div></template>
          </SelectOption>
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
          <SelectOption :size="props.size" :wrap-class="props.optionWrapClass" :loading="props.loading" :multiple="props.multiple" scroller>
            <template v-for="name in filterSlots($slots, slot.option.names)" #[name]>
              <slot :name="name"></slot>
            </template>

            <!-- option选项单独处理 -->
            <template #option-target><div ref="optionsRef"></div></template>
          </SelectOption>
        </OPopup>
      </template>
    </ClientOnly>
  </div>
</template>
