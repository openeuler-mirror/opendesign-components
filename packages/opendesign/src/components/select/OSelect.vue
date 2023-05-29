<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { defaultSize } from '../_shared/global';
import { IconChevronDown, IconClose, IconLoading } from '../_shared/icons';
import { OPopup } from '../popup';
import { OPopover } from '../popover';
import { selectOptionInjectKey } from './provide';
import { SelectOptionT, selectProps } from './types';
import { getRoundClass } from '../_shared/style-class';
import ClientOnly from '../_shared/components/client-only';
import { OScroller } from '../scroller';
import { isFunction } from '../_shared/is';

// TODO 下拉展开时，选中值默认在视口里
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
const optionLabels = ref<Record<string | number, string>>({});

// 使用数组存储当前value
const valueList = ref<Array<string | number>>([]);

const valueListDisplay = computed(() => {
  if (!props.maxTagCount) {
    return valueList.value;
  }
  return valueList.value.slice(0, props.maxTagCount);
});
const valueListFold = computed(() => {
  if (!props.maxTagCount) {
    return [];
  }
  return valueList.value.slice(props.maxTagCount);
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
const foldTrigger = typeof props.showFoldTags === 'string' ? props.showFoldTags : 'hover';

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
    if (userSelect) {
      let toValue: string | number | Array<string | number> = option.value;
      if (isFunction(props.beforeSelect)) {
        const rlt = await props.beforeSelect(option.value, props.multiple ? valueList.value : valueList.value[0]);
        if (rlt === false) {
          return;
        }
        if (typeof rlt !== 'boolean') {
          toValue = rlt;
        }
      }
      if (!props.multiple) {
        //单选

        if (valueList.value[0] !== toValue) {
          emits('change', toValue);

          valueList.value[0] = toValue as string | number;
        }

        emits('update:modelValue', toValue);
        isSelecting.value = false;
      } else {
        // 多选

        if (!Array.isArray(toValue)) {
          toValue = [toValue];
        }

        toValue.forEach((item) => {
          const idx = valueList.value.indexOf(item);
          if (idx > -1) {
            valueList.value.splice(idx, 1);
          } else {
            valueList.value.push(item);
          }
        });

        emits('change', valueList.value);
        emits('update:modelValue', valueList.value);
      }
    } else {
      if (!optionLabels.value[option.value]) {
        optionLabels.value[option.value] = option.label;
      }
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
const onFoldTagClick = (e: MouseEvent) => {
  if (foldTrigger === 'click') {
    e.stopPropagation();
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
        'is-multiple': props.multiple && valueList.length > 0,
        'o-select-disabled': props.disabled,
        'o-select-clearable': isClearable,
        'o-select-is-loading': props.loading,
      },
    ]"
    :style="round.style.value"
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
      <div v-for="item in valueListDisplay" :key="item" class="o-select-tag">
        {{ optionLabels[item] }}
        <div class="o-select-tag-remove" @click="(e) => onRemoveTag(item, e)"><IconClose /></div>
      </div>
      <OPopover v-if="showFoldTags && valueListFold.length > 0" :disabled="isSelecting" :trigger="foldTrigger" class="o-select-tag-popover" position="bottom">
        <template #target>
          <div class="o-select-tag" @click="onFoldTagClick">{{ foldLabel }}</div>
        </template>
        <div class="o-select-tags">
          <div v-for="item in valueListFold" :key="item" class="o-select-tag">
            {{ optionLabels[item] }}
            <div class="o-select-tag-remove" @click="(e) => onRemoveTag(item, e)"><IconClose /></div>
          </div>
        </div>
      </OPopover>
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
