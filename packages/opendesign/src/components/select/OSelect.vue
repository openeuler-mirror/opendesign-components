<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { defaultSize } from '../_shared/global';
import { IconChevronDown, IconClose, IconLoading } from '../_shared/icons';
import { OPopup } from '../popup';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT, selectProps } from './types';
import { getRoundClass } from '../_shared/style-class';
import ClientOnly from '../_shared/components/client-only';
import { OScroller } from '../scroller';
import { isFunction } from '../_shared/is';

const props = defineProps(selectProps);
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number | Array<string | number>): void;
  (e: 'change', value: string | number | Array<string | number>): void;
  (e: 'options-visible-change', value: boolean): void;
  (e: 'clear', evt: Event): void;
}>();

const Labels = {
  empty: '暂无数据',
};

// 存储每个value对应的label
const currentLabels = ref<Record<string | number, string>>({});

// 使用数组存储当前value
const valueList = ref<Array<string | number>>([]);
if (props.multiple) {
  valueList.value = ((props.modelValue || props.defaultValue) as Array<string | number>) || [];
} else {
  valueList.value = [((props.modelValue || props.defaultValue) as string | number) || ''];
}

const optionsRef = ref<HTMLElement | null>(null);

const round = getRoundClass(props, 'select');

watch(
  () => props.modelValue,
  (v) => {
    if (props.multiple) {
      if (Array.isArray(v)) {
        valueList.value = v;
      } else {
        valueList.value = [];
      }
    } else {
      valueList.value = [v as string | number];
    }
  }
);

const isClearable = computed(() => props.clearable && !props.disabled && valueList.value.length > 0);

// 清除值
const clearClick = (e: Event) => {
  e.stopPropagation();

  valueList.value = [];
  emits('clear', e);
};

const selectRef = ref<HTMLElement>();

const isSelecting = ref(false);
provide(selectOptionInjectKey, {
  multiple: props.multiple,
  selectValue: valueList,
  select: async (option: SelectOptionT, userSelect?: boolean) => {
    console.log('select option', option.value, userSelect);
    if (userSelect) {
      let toOption: SelectOptionT | boolean = option;
      if (isFunction(props.beforeSelect)) {
        const rlt = await props.beforeSelect(option.value, props.multiple ? valueList.value : valueList.value[0]);
        if (rlt === false) {
          return;
        }
        if (typeof rlt !== 'boolean') {
          toOption = rlt;
        }
      }
      if (!props.multiple) {
        //单选

        if (valueList.value[0] !== toOption.value) {
          emits('change', toOption.value);

          valueList.value[0] = toOption.value;
        }

        emits('update:modelValue', toOption.value);
        isSelecting.value = false;
      } else {
        // 多选

        const idx = valueList.value.indexOf(toOption.value);
        if (idx > -1) {
          valueList.value.splice(idx, 1);
        } else {
          valueList.value.push(toOption.value);
        }
        emits('change', valueList.value);

        emits('update:modelValue', valueList.value);
      }
    } else {
      currentLabels.value[option.value] = isFunction(props.formatLabel) ? props.formatLabel(option) : option.label;
    }
  },
});

const onOptionPopupChange = (visible: boolean) => {
  emits('options-visible-change', visible);
};

const onRemoveTag = (value: string | number, e: MouseEvent) => {
  e.stopPropagation();

  const idx = valueList.value.indexOf(value);
  if (idx > -1) {
    valueList.value.splice(idx, 1);
  }
};
</script>
<template>
  <div
    ref="selectRef"
    class="o-select"
    :class="[
      `o-select-${props.color}`,
      `o-select-${props.variant}`,
      `o-select-${props.size || defaultSize}`,
      round.class.value,
      {
        'is-selecting': isSelecting,
        'is-multiple': props.multiple,
        'o-select-disabled': props.disabled,
        'o-select-clearable': isClearable,
        'o-select-is-loading': props.loading,
      },
    ]"
    :style="round.style.value"
  >
    <input
      v-if="!props.multiple || (props.multiple && valueList.length === 0)"
      :value="currentLabels[valueList[0]]"
      type="text"
      :placeholder="props.placeholder"
      class="o-select-input"
      readonly
    />
    <div v-else class="o-select-value-list">
      <div v-for="item in valueList" :key="item" class="o-select-value-item">
        {{ currentLabels[item] }}
        <div class="o-select-tag-remove" @click="(e) => onRemoveTag(item, e)"><IconClose /></div>
      </div>
    </div>
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
        <div v-show="optionsRef" class="o-select-option-wrap">
          <slot>
            <div class="o-select-empty">
              <slot name="empty">
                <span>{{ Labels.empty }}</span>
              </slot>
            </div>
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
        :target="selectRef"
        :trigger="props.trigger"
        :offset="4"
        :adjust-min-width="props.optionWidthMode === 'min-width'"
        :adjust-width="props.optionWidthMode === 'width'"
        :before-show="props.beforeOptionsShow"
        :before-hide="props.beforeOptionsHide"
        @change="onOptionPopupChange"
      >
        <div class="o-select-options" :class="`o-select-options-${props.size || defaultSize}`">
          <OScroller class="o-select-options-container" size="small" show-type="hover" :wrap-class="props.optionWrapClass">
            <div v-if="props.loading" class="o-select-options-loading"><IconLoading class="o-rotating" /></div>
            <div v-else ref="optionsRef"></div>
          </OScroller>
          <div class="o-select-actions">
            <slot name="action"></slot>
          </div>
        </div>
      </OPopup>
    </ClientOnly>
  </div>
</template>
