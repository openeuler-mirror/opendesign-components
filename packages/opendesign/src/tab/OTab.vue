<script setup lang="ts">
import { provide, ref, nextTick, watch, computed, toValue, onMounted } from 'vue';
import { useMutationObserver, createReusableTemplate, useElementBounding, useCssVar, until } from '@vueuse/core';

import { OOption, OOptionList } from '../option';
import { ODialog } from '../dialog';
import { OPopup } from '../popup';
import { IconAdd, IconClose, IconChevronDown } from '../_utils/icons';
import { vOnResize } from '../directives';
import { debounceRAF } from '../_utils/helper';
import { defaultSize } from '../_utils/global';
import { isUndefined } from '../_utils/is';
import { useScreen } from '../hooks';
import { mergeClass } from '../_utils/vue-utils';
import { getRoundClass } from '../_utils/style-class';
import { useI18n } from '../locale';

import { TabChildData, tabInjectKey } from './provide';
import { tabProps } from './types';

type ChildDataT = TabChildData & {
  /** 导航item显示的元素，用于计算指示器的定位 */
  navEl?: HTMLDivElement;
  /** 导航item的测量元素，用于计算和测量item的宽度 */
  navMeasureEl?: HTMLDivElement;
  navElWidth?: number;
};

const props = defineProps(tabProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number, oldValue?: string | number): void;
  (e: 'delete', value: string | number): void;
  (e: 'add', evt: MouseEvent): void;
}>();

const round = getRoundClass(props, 'tab-btn');

const { isPhonePad } = useScreen();

const { t } = useI18n();
const moreLabel = computed(() => props.moreLabel || t('common.more'));

const activeKey = ref(props.modelValue);
const anchorStyle = ref<Record<string, string>>({});

const navsContainerRef = ref<HTMLDivElement>();
const { width: navsContainerWidth } = useElementBounding(navsContainerRef);
const navGapString = useCssVar('--tab-nav-gap', navsContainerRef, { initialValue: '32px' });
const navGapNumber = computed(() => {
  return Number.parseInt(navGapString.value);
});
const tabNavMeasurementRef = ref<HTMLDivElement>();
const { width: tabNavMeasurementWidth } = useElementBounding(tabNavMeasurementRef);
const ellipsisRef = ref<HTMLDivElement>();
const { width: ellipsisWidth } = useElementBounding(ellipsisRef);
const bodyRef = ref<HTMLDivElement>();

const childrenMap = ref<Record<string, ChildDataT>>({});
/** 通过遍历dom获取的顺序正确的value列表，但都是字符串 */
const stringValueSet = ref<string[]>([]);
const showStringValueList = ref<string[]>([]);
const hiddenStringValueList = ref<string[]>([]);

watch(stringValueSet, () => {
  showStringValueList.value = showStringValueList.value.filter((v) => stringValueSet.value.includes(v));
  hiddenStringValueList.value = hiddenStringValueList.value.filter((v) => stringValueSet.value.includes(v));
});

const prevContainerWidth = ref(navsContainerWidth.value);
const prevMaxShow = ref(props.maxShow);

/** 当能再塞下的时候塞 */
const pushShowStringValue = (stringValue: string, widthCount: number) => {
  const item = childrenMap.value[stringValue];
  const { navElWidth } = item;
  const isWidthWillExceed = widthCount + navGapNumber.value + navElWidth! > navsContainerWidth.value;
  const isShowNumWillExceed = isUndefined(props.maxShow) ? false : showStringValueList.value.length + 1 > props.maxShow;
  if (!isWidthWillExceed && !isShowNumWillExceed) {
    const paneKey = toValue(item.paneKey);
    showStringValueList.value.push(paneKey.toString());
    widthCount += navGapNumber.value;
    widthCount += navElWidth!;
  }
  return widthCount;
};
const sortStringValueList = debounceRAF(() => {
  if (props.variant === 'button') {
    showStringValueList.value = stringValueSet.value;
    hiddenStringValueList.value = [];
    return;
  }
  let widthCount = 0;
  const containerWidthChanged = prevContainerWidth.value !== navsContainerWidth.value;
  const maxShowChanged = prevMaxShow.value !== props.maxShow;

  prevContainerWidth.value = navsContainerWidth.value;
  prevMaxShow.value = props.maxShow;

  if (!showStringValueList.value.length) {
    // 如果是空显示列表先按顺序填满
    stringValueSet.value.forEach((stringValue) => {
      widthCount = pushShowStringValue(stringValue, widthCount);
    });
  }
  /**
   * 如果激活元素包含在内且[容器宽度、数量限制]没有变化，或没有激活元素，则不做处理
   */
  if (
    isUndefined(activeKey.value) ||
    (!containerWidthChanged && !maxShowChanged && showStringValueList.value.some((stringValue) => stringValue === activeKey.value?.toString()))
  ) {
    hiddenStringValueList.value = stringValueSet.value.filter((v) => !showStringValueList.value.includes(v));
    return;
  }

  widthCount = showStringValueList.value.reduce((count, stringValue) => {
    const item = childrenMap.value[stringValue];
    return count + item.navElWidth! + navGapNumber.value;
  }, 0);

  const isTotalWidthExceed = tabNavMeasurementWidth.value > navsContainerWidth.value;
  const isTotalNumExceed = isUndefined(props.maxShow) ? false : stringValueSet.value.length > props.maxShow;
  // 如果有溢出的，则还要把溢出指示器的宽度算上
  if (isTotalWidthExceed || isTotalNumExceed) {
    widthCount += isUndefined(props.maxShow) ? navGapNumber.value : 8; // 间距或阴影宽度
    widthCount += ellipsisWidth.value;
  }

  let activeItemIndex = showStringValueList.value.findIndex((stringValue) => stringValue === activeKey.value?.toString());
  if (activeItemIndex === -1) {
    const activeItemIndexInTotal = stringValueSet.value.findIndex((v) => v === activeKey.value?.toString());
    const targetIndex =
      activeItemIndexInTotal === 0
        ? 0
        : showStringValueList.value.findIndex((stringValue, i) => {
            if (i === showStringValueList.value.length - 1) {
              return true;
            }

            const curIndexInTotal = stringValueSet.value.findIndex((v) => v === stringValue);
            const nextIndexInTotal = stringValueSet.value.findIndex((v) => v === showStringValueList.value[i + 1]);
            if (curIndexInTotal < activeItemIndexInTotal && nextIndexInTotal > activeItemIndexInTotal) {
              return true;
            }
            return false;
          }) + 1;
    const activeItem = childrenMap.value[activeKey.value];
    showStringValueList.value.splice(targetIndex, 0, toValue(activeItem.paneKey).toString());
    widthCount += activeItem.navElWidth!;
    widthCount += navGapNumber.value;
    activeItemIndex = showStringValueList.value.length - 1;
  }
  const getIsShowWidthExceed = () => widthCount > navsContainerWidth.value;
  const getIsShowNumExceed = () => (isUndefined(props.maxShow) ? false : showStringValueList.value.length > props.maxShow);
  // 如果超出了宽度
  while ((getIsShowWidthExceed() || getIsShowNumExceed()) && showStringValueList.value.length > 1) {
    activeItemIndex = showStringValueList.value.findIndex((stringValue) => stringValue === activeKey.value?.toString());
    // 如果激活项在最后则去掉最前面，否则去掉最后面
    const removedStringValue = activeItemIndex === showStringValueList.value.length - 1 ? showStringValueList.value.shift()! : showStringValueList.value.pop()!;
    const shiftedItem = childrenMap.value[removedStringValue];
    widthCount -= shiftedItem.navElWidth!;
    widthCount -= navGapNumber.value;
  }
  hiddenStringValueList.value = stringValueSet.value.filter((v) => !showStringValueList.value.includes(v));
  // 如果屏幕宽度变宽需要用右侧的填充
  hiddenStringValueList.value.forEach((stringValue) => {
    widthCount = pushShowStringValue(stringValue, widthCount);
  });
  hiddenStringValueList.value = stringValueSet.value.filter((v) => !showStringValueList.value.includes(v));
  showStringValueList.value.sort((a, b) => {
    return stringValueSet.value.findIndex((v) => v === a) - stringValueSet.value.findIndex((v) => v === b);
  });
  hiddenStringValueList.value.sort((a, b) => {
    return stringValueSet.value.findIndex((v) => v === a) - stringValueSet.value.findIndex((v) => v === b);
  });
  return;
});

watch(
  () => [stringValueSet.value, activeKey.value, navsContainerWidth.value, props.maxShow],
  () => {
    sortStringValueList();
  },
  {
    immediate: true,
    deep: true,
  },
);
const gatherChildren = () => {
  if (!bodyRef.value) {
    return;
  }
  stringValueSet.value = [];
  Array.from(bodyRef.value.children).forEach((el) => {
    if (!el.classList.contains('o-tab-pane')) {
      return;
    }
    const paneKey = el.getAttribute('data-tab-pane-key');
    if (paneKey) {
      stringValueSet.value.push(paneKey);
    }
  });
};
useMutationObserver(
  bodyRef,
  async (mutations) => {
    if (!mutations[0]) {
      return;
    }
    await nextTick();
    gatherChildren();
  },
  {
    childList: true,
  },
);
onMounted(() => gatherChildren());

/** 是否所有的子节点已调用注册程序 */
const allRegistered = computed(() => {
  return stringValueSet.value.every((stringValue) => !!childrenMap.value[stringValue]);
});

const [DefineTabNavTemplate, ReuseTabNavTemplate] = createReusableTemplate();

const isEllipsisOptionShow = ref(false);

const updateAnchor = async () => {
  if (isUndefined(activeKey.value)) {
    return;
  }
  await until(allRegistered).toBeTruthy();
  const activeItem = childrenMap.value[activeKey.value];
  await until(() => activeItem.navEl && activeItem.navMeasureEl).toBeTruthy();

  const { clientWidth, offsetLeft } = activeItem.navEl!;
  anchorStyle.value = {
    transform: `translate3d(${offsetLeft}px, 0px, 0px)`,
    width: `${clientWidth}px`,
  };
};
watch(
  () => [showStringValueList.value, activeKey.value],
  () => {
    updateAnchor();
  },
  { immediate: true, deep: true },
);

const setNavEl = async (el: any, stringValue: string) => {
  await until(allRegistered).toBeTruthy();
  const item = childrenMap.value[stringValue];
  item.navEl = el as HTMLDivElement;
};
const setNavMeasureEl = async (el: any, stringValue: string) => {
  await until(allRegistered).toBeTruthy();
  const item = childrenMap.value[stringValue];
  item.navMeasureEl = el as HTMLDivElement;
  if (el) {
    item.navElWidth = el.clientWidth;
  }
};

// 更新tab当前选中值
const updateValue = async (value: string | number) => {
  const { paneKey } = childrenMap.value[value];
  const _value = toValue(paneKey);
  emits('update:modelValue', _value);
  if (activeKey.value !== _value) {
    emits('change', _value, activeKey.value);
    activeKey.value = _value;
  }
  isEllipsisOptionShow.value = false;
};
watch(
  () => props.modelValue,
  (v) => {
    activeKey.value = v;
    if (v) {
      updateValue(v);
    }
  },
);

// 删除页签
const onDeletePane = (e: MouseEvent, value: string) => {
  e.stopImmediatePropagation();
  const { paneKey } = childrenMap.value[value];
  const _value = toValue(paneKey);
  emits('delete', _value);
  const idx = stringValueSet.value.indexOf(value);

  if (activeKey.value === _value) {
    const targetStringValue = stringValueSet.value[idx > 0 ? idx - 1 : 0];
    activeKey.value = toValue(childrenMap.value[targetStringValue].paneKey);
    emits('change', activeKey.value, _value);
  }
  stringValueSet.value.splice(idx, 1);
};

const isAdding = ref(false);
// 添加页签
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
  if (!props.addInactive) {
    isAdding.value = true;
  }
};
provide(tabInjectKey, {
  lazy: props.lazy,
  activeValue: activeKey,
  registerChild(child) {
    childrenMap.value[toValue(child.paneKey).toString()] = child;
  },
  handleChildMounted(paneKey) {
    // 初始化tab，如果没有选中项，默认第一个
    if (activeKey.value === undefined || isAdding.value) {
      updateValue(paneKey);
      isAdding.value = false;
      return;
    }
  },
});
const onHeadItemResize = debounceRAF((stringValue) => {
  const item = childrenMap.value[stringValue];
  item.navElWidth = item.navMeasureEl!.clientWidth;
});
const onHeadResize = debounceRAF(() => {
  updateAnchor();
});
</script>
<template>
  <div class="o-tab" :class="[`o-tab-${props.variant}`, `o-tab-${props.size || defaultSize}`, round.class.value]" :style="round.style.value">
    <DefineTabNavTemplate v-slot="{ stringValue, measurement }">
      <div
        v-on-resize="measurement ? () => onHeadItemResize(stringValue) : () => {}"
        :ref="(el) => (measurement ? setNavMeasureEl(el, stringValue) : setNavEl(el, stringValue))"
        :class="[
          'o-tab-nav',
          {
            'o-tab-nav-active': activeKey?.toString() === stringValue,
            'o-tab-nav-disabled': childrenMap[stringValue].props.disabled,
            'o-tab-nav-closable': childrenMap[stringValue].props.closable,
          },
        ]"
        @click="() => updateValue(stringValue)"
      >
        <component v-if="childrenMap[stringValue].navRenderer" :is="childrenMap[stringValue].navRenderer" />
        <template v-else>{{ childrenMap[stringValue].props.label || childrenMap[stringValue].props.value }}</template>
        <div v-if="childrenMap[stringValue].props.closable" class="o-tab-nav-close" @click="(e) => onDeletePane(e, stringValue)"><IconClose /></div>
      </div>
    </DefineTabNavTemplate>
    <div
      class="o-tab-head"
      :class="
        mergeClass(
          {
            'with-act': !!$slots.suffix || !!$slots.prefix,
            'show-line': !!props.line && props.variant !== 'button',
          },
          props.headerClass,
        )
      "
    >
      <div v-if="$slots.prefix" class="o-tab-head-prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="o-tab-navs">
        <div ref="navsContainerRef" v-on-resize="onHeadResize" :class="{ 'o-tab-navs-container': true, overflown: !!hiddenStringValueList.length }">
          <!-- 渲染一个全宽但是零高度的节点来测量每个节点的宽度，以计算溢出情况 -->
          <div ref="tabNavMeasurementRef" v-on-resize="onHeadResize" class="o-tab-nav-list width-measurement">
            <template v-for="stringValue in stringValueSet" :key="stringValue">
              <ReuseTabNavTemplate v-if="childrenMap[stringValue]" :string-value="stringValue" :measurement="true" />
            </template>
          </div>
          <div class="o-tab-nav-list">
            <template v-for="stringValue in showStringValueList" :key="stringValue">
              <ReuseTabNavTemplate v-if="childrenMap[stringValue]" :string-value="stringValue" />
            </template>

            <div
              v-if="props.variant !== 'button'"
              ref="ellipsisRef"
              v-show="hiddenStringValueList.length"
              :class="[
                'o-tab-nav',
                {
                  'o-tab-nav-active': props.maxShow && isEllipsisOptionShow,
                  'o-tab-nav-ellipsis': isUndefined(props.maxShow),
                },
              ]"
              @click="() => (isEllipsisOptionShow = true)"
            >
              <template v-if="props.maxShow">
                {{ moreLabel }}
                <IconChevronDown :class="{ 'o-tab-nav-more-arrow': true, active: isEllipsisOptionShow }" />
              </template>
              <template v-else>...</template>
            </div>
          </div>
          <div v-if="props.variant === 'text'" class="o-tab-nav-anchor" :style="anchorStyle">
            <slot name="anchor">
              <div class="o-tab-nav-anchor-line"></div>
            </slot>
          </div>
        </div>

        <div v-if="props.addable" class="o-tab-nav-add" @click="onAddNav">
          <IconAdd />
        </div>
      </div>
      <div v-if="$slots.suffix" class="o-tab-head-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div ref="bodyRef" class="o-tab-body">
      <slot></slot>
    </div>

    <ODialog v-if="isPhonePad" v-model:visible="isEllipsisOptionShow" hide-close class="o-select-dlg" mask-close size="small" :scrollbar="false">
      <OOptionList wrap-class="o-scrollbar-container">
        <OOption
          v-for="stringValue in hiddenStringValueList"
          :key="stringValue"
          :value="toValue(childrenMap[stringValue].paneKey)"
          @click="updateValue(stringValue)"
        >
          <component v-if="childrenMap[stringValue].navRenderer" :is="childrenMap[stringValue].navRenderer" />
          <template v-else>{{ childrenMap[stringValue].props.label || childrenMap[stringValue].props.value }}</template>
        </OOption>
      </OOptionList>
    </ODialog>

    <OPopup
      v-else
      v-model:visible="isEllipsisOptionShow"
      wrap-class="o-options-popup o-tab-more-popup"
      body-class="o-popup-body"
      position="bl"
      wrapper="body"
      :target="ellipsisRef"
      trigger="hover"
      :offset="4"
    >
      <OOptionList wrap-class="o-scrollbar-container">
        <OOption
          v-for="stringValue in hiddenStringValueList"
          :key="stringValue"
          :value="toValue(childrenMap[stringValue].paneKey)"
          @click="updateValue(stringValue)"
        >
          <component v-if="childrenMap[stringValue].navRenderer" :is="childrenMap[stringValue].navRenderer" />
          <template v-else>{{ childrenMap[stringValue].props.label || childrenMap[stringValue].props.value }}</template>
        </OOption>
      </OOptionList>
    </OPopup>
  </div>
</template>
