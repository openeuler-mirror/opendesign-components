<script setup lang="ts">
import { provide, ref, watch, computed, toValue, onMounted, getCurrentInstance } from 'vue';
import { createReusableTemplate, useElementBounding, until, useMutationObserver } from '@vueuse/core';

import { OOption, OOptionList } from '../option';
import { ODialog } from '../dialog';
import { OPopup } from '../popup';
import { IconAdd, IconClose, IconChevronDown } from '../_utils/icons';
import { vOnResize } from '../directives';
import { debounceRAF } from '../_utils/helper';
import { defaultSize } from '../_utils/global';
import { isUndefined } from '../_utils/is';
import ClientOnly from '../_components/client-only.ts';
import { useScreen, useResponseCssVar, useSortedTeleportChildren } from '../hooks';
import { mergeClass } from '../_utils/vue-utils';
import { getRoundClass } from '../_utils/style-class';
import { checkElementOverflowHorizontal } from '../_utils/dom.ts';
import { useI18n } from '../locale';

import { TabChildData, SortedChildData, tabInjectKey } from './provide';
import { tabProps } from './types';
import OTabPaneComp from './OTabPane.vue';

type ChildDataT = TabChildData & {
  /** 导航item显示的元素，用于计算指示器的定位 */
  navEl?: HTMLDivElement;
  /** 导航item的测量元素，用于计算和测量item的宽度 */
  navMeasureEl?: HTMLDivElement;
  navElWidth?: number;
};

const props = defineProps(tabProps);

const emits = defineEmits<{
  /**
   * @zh-CN 页签选中值变化时触发
   * @en-US Triggered when the tab selected value changes
   */
  (e: 'update:modelValue', value: string | number): void;
  /**
   * @zh-CN 页签选中值变化后触发
   * @en-US Triggered after the tab selected value changes
   */
  (e: 'change', value: string | number, oldValue?: string | number): void;
  /**
   * @zh-CN 页签被删除时触发
   * @en-US Triggered when a tab is deleted
   */
  (e: 'delete', value: string | number): void;
  /**
   * @zh-CN 新增页签按钮被点击时触发
   * @en-US Triggered when the add tab button is clicked
   */
  (e: 'add', evt: MouseEvent): void;
}>();

const round = getRoundClass(props, 'tab-btn');

const { lePadV } = useScreen();

const { t } = useI18n();
const moreLabel = computed(() => props.moreLabel || t('common.more'));

const activeKey = ref(props.modelValue);
const anchorStyle = ref<Record<string, string>>({});

const navsContainerRef = ref<HTMLDivElement>();
const { width: navsContainerWidth } = useElementBounding(navsContainerRef);
const navGapNumber = useResponseCssVar('--tab-nav-gap', navsContainerRef, {
  initialValue: '32px',
  transform(value) {
    return Number.parseInt(value);
  },
});
const tabNavMeasurementRef = ref<HTMLDivElement>();
const { width: tabNavMeasurementWidth } = useElementBounding(tabNavMeasurementRef);
const ellipsisRef = ref<HTMLDivElement>();
const { width: ellipsisWidth } = useElementBounding(ellipsisRef);
const navEllipsisShadowWidthNumber = useResponseCssVar('--tab-nav-ellipsis-shadow-width', navsContainerRef, {
  initialValue: '8px',
  transform(value) {
    return Number.parseInt(value);
  },
});

const navListStyle = computed(() => {
  if (props.variant === 'button' || lePadV.value) {
    return;
  }
  if (props.maxShow && props.maxShow > 0) {
    return { width: `${navsContainerWidth.value}px` };
  }
  if (ellipsisWidth.value) {
    return { width: `${navsContainerWidth.value - ellipsisWidth.value - navEllipsisShadowWidthNumber.value}px` };
  }
  return undefined;
});

const tabNavRef = ref<HTMLDivElement>();
const tabNavLeftOverflown = ref(false);
const tabNavRightOverflown = ref(false);
const checkOverflow = debounceRAF(() => {
  if (!lePadV.value || !tabNavRef.value) {
    return;
  }
  const result = checkElementOverflowHorizontal({ element: tabNavRef.value, threshold: 1 });
  tabNavLeftOverflown.value = result.isOverflowLeft;
  tabNavRightOverflown.value = result.isOverflowRight;
});
until(tabNavRef).toBeTruthy().then(checkOverflow);

const instance = getCurrentInstance()!;
const { children: sortedChildren, childMap, addChild, OTeleportWrapper } = useSortedTeleportChildren<SortedChildData>(instance, OTabPaneComp);

/** DOM 顺序的 uid 列表，由 useSortedTeleportChildren 保证按模板书写顺序排列 */
const uidSet = computed(() => sortedChildren.value.map((c) => c.uid));
const showUids = ref<number[]>([]);
const hiddenUids = ref<number[]>([]);

/** paneKey → uid 反向索引，用于通过 modelValue 定位对应子组件 */
const paneKeyToUid = computed(() => {
  const map = new Map<string | number, number>();
  sortedChildren.value.forEach((c) => {
    map.set(toValue(c.paneKey), c.uid);
  });
  return map;
});

watch(uidSet, () => {
  showUids.value = showUids.value.filter((uid) => uidSet.value.includes(uid));
  hiddenUids.value = hiddenUids.value.filter((uid) => uidSet.value.includes(uid));
});

const getChildData = (uid: number) => childMap[uid] as unknown as ChildDataT;

/** 当能再塞下的时候塞，操作本地数组而非响应式 ref */
const pushShowUid = (localShow: number[], uid: number, widthCount: number) => {
  const item = getChildData(uid);
  const { navElWidth } = item;
  const gap = widthCount > 0 ? navGapNumber.value : 0;
  const isWidthWillExceed = widthCount + gap + navElWidth! > navsContainerWidth.value;
  const isShowNumWillExceed = isUndefined(props.maxShow) ? false : localShow.length + 1 > props.maxShow;
  if (!isWidthWillExceed && !isShowNumWillExceed) {
    localShow.push(uid);
    return widthCount + gap + navElWidth!;
  }
  return widthCount;
};
const sortUidList = debounceRAF(() => {
  if (props.variant === 'button' || lePadV.value) {
    showUids.value = uidSet.value;
    hiddenUids.value = [];
    return;
  }

  uidSet.value.forEach((uid) => {
    const item = getChildData(uid);
    if (item?.navMeasureEl) {
      item.navElWidth = item.navMeasureEl.clientWidth;
    }
  });

  let localShow: number[] = [...showUids.value];
  let widthCount = 0;

  if (!localShow.length) {
    uidSet.value.forEach((uid) => {
      widthCount = pushShowUid(localShow, uid, widthCount);
    });
  }

  widthCount = localShow.reduce((count, uid) => {
    const item = getChildData(uid);
    return count + item.navElWidth! + navGapNumber.value;
  }, -navGapNumber.value);

  const isTotalWidthExceed = tabNavMeasurementWidth.value > navsContainerWidth.value;
  const isTotalNumExceed = isUndefined(props.maxShow) ? false : uidSet.value.length > props.maxShow;
  if (isTotalWidthExceed || isTotalNumExceed) {
    widthCount += isUndefined(props.maxShow) ? navEllipsisShadowWidthNumber.value : navGapNumber.value;
    widthCount += ellipsisWidth.value;
  }

  const activeUid = activeKey.value != null ? paneKeyToUid.value.get(activeKey.value) : undefined;
  let activeItemIndex = localShow.findIndex((uid) => uid === activeUid);
  if (activeItemIndex === -1 && activeUid != null) {
    const activeItemIndexInTotal = uidSet.value.findIndex((uid) => uid === activeUid);
    const targetIndex =
      activeItemIndexInTotal === 0
        ? 0
        : localShow.findIndex((uid, i) => {
            if (i === localShow.length - 1) {
              return true;
            }
            const curIndexInTotal = uidSet.value.findIndex((v) => v === uid);
            const nextIndexInTotal = uidSet.value.findIndex((v) => v === localShow[i + 1]);
            if (curIndexInTotal < activeItemIndexInTotal && nextIndexInTotal > activeItemIndexInTotal) {
              return true;
            }
            return false;
          }) + 1;
    const activeItem = getChildData(activeUid);
    localShow.splice(targetIndex, 0, activeUid);
    widthCount += activeItem.navElWidth!;
    widthCount += navGapNumber.value;
    activeItemIndex = localShow.length - 1;
  }
  const getIsShowWidthExceed = () => widthCount > navsContainerWidth.value;
  const getIsShowNumExceed = () => (isUndefined(props.maxShow) ? false : localShow.length > props.maxShow);
  while ((getIsShowWidthExceed() || getIsShowNumExceed()) && localShow.length > 1) {
    activeItemIndex = localShow.findIndex((uid) => uid === activeUid);
    const removedUid = activeItemIndex === localShow.length - 1 ? localShow.shift()! : localShow.pop()!;
    const shiftedItem = getChildData(removedUid);
    widthCount -= shiftedItem.navElWidth!;
    widthCount -= navGapNumber.value;
  }
  let localHidden = uidSet.value.filter((uid) => !localShow.includes(uid));
  localHidden.forEach((uid) => {
    widthCount = pushShowUid(localShow, uid, widthCount);
  });
  localHidden = uidSet.value.filter((uid) => !localShow.includes(uid));
  localShow.sort((a, b) => {
    return uidSet.value.findIndex((v) => v === a) - uidSet.value.findIndex((v) => v === b);
  });
  localHidden.sort((a, b) => {
    return uidSet.value.findIndex((v) => v === a) - uidSet.value.findIndex((v) => v === b);
  });
  showUids.value = localShow;
  hiddenUids.value = localHidden;
});

onMounted(() => {
  watch(
    [
      uidSet,
      activeKey,
      navsContainerWidth,
      tabNavMeasurementWidth,
      () => props.maxShow,
      () => props.variant,
      ellipsisWidth,
      navGapNumber,
      navEllipsisShadowWidthNumber,
    ],
    () => {
      sortUidList();
    },
    {
      immediate: true,
      deep: true,
    },
  );
});

const [DefineTabNavTemplate, ReuseTabNavTemplate] = createReusableTemplate();

const isEllipsisOptionShow = ref(false);

const updateAnchor = async () => {
  if (isUndefined(activeKey.value)) {
    return;
  }
  const activeUid = paneKeyToUid.value.get(activeKey.value);
  if (activeUid == null) {
    return;
  }
  const activeItem = getChildData(activeUid);
  await until(() => activeItem?.navEl && activeItem.navMeasureEl).toBeTruthy();

  const { clientWidth, offsetLeft } = activeItem.navEl!;
  anchorStyle.value = {
    transform: `translate3d(${offsetLeft}px, 0px, 0px)`,
    width: `${clientWidth}px`,
  };
};

/**
 * @description 移动端横向滚动模式下，将当前激活页签滚动到可视区域内
 * 仅在 lePadV（屏幕宽度 ≤ pad_v 断点）时执行，桌面端无横向滚动无需处理
 */
const scrollActiveIntoView = async () => {
  if (!lePadV.value || !navsContainerRef.value) {
    return;
  }
  if (isUndefined(activeKey.value)) {
    return;
  }
  const activeUid = paneKeyToUid.value.get(activeKey.value);
  if (activeUid == null) {
    return;
  }
  const activeItem = getChildData(activeUid);
  await until(() => activeItem?.navEl).toBeTruthy();
  activeItem.navEl?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
};
onMounted(() => {
  scrollActiveIntoView();
});
watch(
  [showUids, activeKey],
  () => {
    updateAnchor();
    scrollActiveIntoView();
  },
  { immediate: true, deep: true },
);

const setNavEl = (el: any, uid: number) => {
  if (el == null) {
    return;
  }
  const item = getChildData(uid);
  item.navEl = el as HTMLDivElement;
};
const setNavMeasureEl = async (el: any, uid: number) => {
  if (el == null) {
    return;
  }
  const item = getChildData(uid);
  item.navMeasureEl = el as HTMLDivElement;
  if (el) {
    item.navElWidth = el.clientWidth;
  }
};

const updateValue = async (uid: number) => {
  const child = childMap[uid];
  if (child.props.disabled) {
    return;
  }
  const _value = toValue(child.paneKey);
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
    if (v != null) {
      const uid = paneKeyToUid.value.get(v);
      if (uid != null) {
        updateValue(uid);
      }
    }
  },
);

const onDeletePane = (e: MouseEvent, uid: number) => {
  e.stopImmediatePropagation();
  const child = childMap[uid];
  const _value = toValue(child.paneKey);
  emits('delete', _value);
  const idx = uidSet.value.indexOf(uid);

  if (activeKey.value === _value) {
    const targetUid = uidSet.value[idx > 0 ? idx - 1 : idx + 1];
    activeKey.value = toValue(childMap[targetUid]?.paneKey);
    emits('change', activeKey.value, _value);
  }
};

const isAdding = ref(false);
const onAddNav = (e: MouseEvent) => {
  emits('add', e);
  if (!props.addInactive) {
    isAdding.value = true;
  }
};
provide(tabInjectKey, {
  lazy: props.lazy,
  activeValue: activeKey,
  addChild: (child: SortedChildData) => {
    addChild(child);
    if (activeKey.value === undefined || isAdding.value) {
      updateValue(child.uid);
    }
  },
});
const onHeadItemResize = debounceRAF((uid: number) => {
  const item = getChildData(uid);
  item.navElWidth = item.navMeasureEl!.clientWidth;
});
const onHeadResize = debounceRAF(() => {
  checkOverflow();
  updateAnchor();
  scrollActiveIntoView();
});
// 子项目数量变更后重新计算
useMutationObserver(
  tabNavRef,
  (mutations) => {
    if (mutations[0]) {
      onHeadResize();
    }
  },
  { childList: true },
);
</script>
<template>
  <div
    class="o-tab"
    :class="[
      `o-tab-${props.variant}`,
      { 'o-tab-button-inverse': props.variant === 'button' && props.buttonInverse },
      `o-tab-${props.size || defaultSize}`,
      round.class.value,
    ]"
    :style="round.style.value"
  >
    <DefineTabNavTemplate v-slot="{ uid, measurement }">
      <div
        :ref="(el) => (measurement ? setNavMeasureEl(el, uid) : setNavEl(el, uid))"
        v-on-resize="measurement ? () => onHeadItemResize(uid) : () => {}"
        :class="[
          'o-tab-nav',
          {
            'o-tab-nav-active': toValue(childMap[uid].paneKey) === activeKey,
            'o-tab-nav-disabled': childMap[uid].props.disabled,
            'o-tab-nav-closable': childMap[uid].props.closable,
          },
        ]"
        @click="() => updateValue(uid)"
      >
        <component :is="childMap[uid].navRenderer" v-if="childMap[uid].navRenderer" />
        <template v-else>{{ childMap[uid].props.label || childMap[uid].props.value }}</template>
        <div v-if="childMap[uid].props.closable" class="o-tab-nav-close" @click="(e) => onDeletePane(e, uid)">
          <IconClose />
        </div>
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
      <div :class="{ 'o-tab-navs': true, 'o-tab-navs-overflown-left': tabNavLeftOverflown, 'o-tab-navs-overflown-right': tabNavRightOverflown }">
        <div
          ref="navsContainerRef"
          v-on-resize="onHeadResize"
          :class="{
            'o-tab-navs-container': true,
            overflown: hiddenUids.length,
            'o-tab-navs-container-mb-overflown': tabNavLeftOverflown || tabNavRightOverflown,
          }"
          @scroll="checkOverflow"
        >
          <!-- 渲染一个全宽但是零高度的节点来测量每个节点的宽度，以计算溢出情况 -->
          <div v-show="!lePadV" ref="tabNavMeasurementRef" v-on-resize="onHeadResize" class="o-tab-nav-list width-measurement">
            <ReuseTabNavTemplate v-for="uid in uidSet" :key="childMap[uid].paneKey" :uid="uid" :measurement="true" />
          </div>
          <div ref="tabNavRef" v-on-resize="onHeadResize" class="o-tab-nav-list" :style="navListStyle">
            <ReuseTabNavTemplate v-for="uid in showUids" :key="childMap[uid].paneKey" :uid="uid" />
            <div
              v-if="props.variant !== 'button'"
              v-show="hiddenUids.length"
              ref="ellipsisRef"
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
    <div class="o-tab-body">
      <OTeleportWrapper>
        <slot></slot>
      </OTeleportWrapper>
    </div>
    <ClientOnly>
      <ODialog v-if="lePadV" v-model:visible="isEllipsisOptionShow" hide-close class="o-select-dlg" mask-close size="small" :scrollbar="false">
        <OOptionList wrap-class="o-scrollbar-container">
          <OOption v-for="uid in hiddenUids" :key="uid" :value="toValue(childMap[uid].paneKey)" @click="updateValue(uid)">
            <component :is="childMap[uid].navRenderer" v-if="childMap[uid].navRenderer" />
            <template v-else>{{ childMap[uid].props.label || childMap[uid].props.value }} </template>
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
          <OOption v-for="uid in hiddenUids" :key="uid" :value="toValue(childMap[uid].paneKey)" @click="updateValue(uid)">
            <component :is="childMap[uid].navRenderer" v-if="childMap[uid].navRenderer" />
            <template v-else>{{ childMap[uid].props.label || childMap[uid].props.value }} </template>
          </OOption>
        </OOptionList>
      </OPopup>
    </ClientOnly>
  </div>
</template>
