<script setup lang="ts">
import { provide, ref, watch, computed, toValue, onMounted, getCurrentInstance } from 'vue';
import { createReusableTemplate, useElementBounding, until, useMutationObserver } from '@vueuse/core';

import { OOption, OOptionList } from '../option';
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

const navListStyle = computed(() => {
  if (props.variant === 'button' || lePadV.value) {
    return;
  }
  if (!isUndefined(props.maxShow) && props.maxShow > 0) {
    // maxShow 路径：可见列表固定为容器宽（回归隔离墙，行为保持不变）
    return { width: `${navsContainerWidth.value}px` };
  }
  // 几何路径：页签全量渲染，溢出由容器裁切，不再注入收缩内联宽度
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

/**
 * @description 获取当前激活 pane 对应的 uid
 * @returns 激活项 uid；无激活值或映射不到子项时返回 undefined
 */
const getActiveUid = (): number | undefined =>
  activeKey.value != null ? paneKeyToUid.value.get(activeKey.value) : undefined;

/**
 * @description 判断当前是否走溢出几何路径：桌面端（非 lePadV）+ 非 button 变体 + 未设置 maxShow
 * @returns 是否为几何路径（全量渲染 + 容器裁切 + 编程滚动）
 */
const isGeometryPath = () => !lePadV.value && props.variant !== 'button' && isUndefined(props.maxShow);

/**
 * @description 溢出统一判据：内容总宽（全量测量列表宽度）> 容器宽
 * 布局值判定，与滚动位置、隐藏名单均解耦；+1px 为测量链亚像素容差
 */
const isOverflown = computed(() => tabNavMeasurementWidth.value > navsContainerWidth.value + 1);

/**
 * @description 折叠态统一开关，同时驱动省略号 v-show 与容器溢出 class（grid 居中 ↔ 流式切换）
 * 几何路径判「内容是否溢出」；maxShow/button/移动端路径沿用「隐藏名单非空」
 */
const isCollapseActive = computed(() => (isGeometryPath() ? isOverflown.value : hiddenUids.value.length > 0));

/**
 * @description 从零高度测量列表（.width-measurement）同步每个页签项的实测宽度到 childMap
 * 测量列表渲染全量页签，是两条溢出折叠路径共同的宽度数据源
 */
const syncNavElWidths = () => {
  uidSet.value.forEach((uid) => {
    const item = getChildData(uid);
    if (item?.navMeasureEl) {
      item.navElWidth = item.navMeasureEl.clientWidth;
    }
  });
};

/**
 * @description 累加可见列表的总宽度（相邻项之间计入一个 gap，首尾不重复）
 * @param localShow 本地可见 uid 数组
 * @returns 可见列表累计宽度
 */
const sumShowWidth = (localShow: number[]) =>
  localShow.reduce((count, uid) => count + getChildData(uid).navElWidth! + navGapNumber.value, -navGapNumber.value);

/**
 * @description 激活项不在可见列表时，按模板书写顺序"就近"插回可见列表
 * 就近规则：插到模板序恰好跨过激活项的两个相邻可见项之间（激活项居首/居尾时插到对应端点）
 * @param localShow 本地可见 uid 数组（命中时原地插入）
 * @returns 应累加到宽度记账的增量（激活项宽度 + 一个 gap）；无需插入时为 0
 */
const insertActiveUidNearby = (localShow: number[]): number => {
  const activeUid = getActiveUid();
  if (activeUid == null || localShow.includes(activeUid)) {
    return 0;
  }
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
  // 原地插入激活项，宽度记账由调用方累加返回的增量
  localShow.splice(targetIndex, 0, activeUid);
  return activeItem.navElWidth! + navGapNumber.value;
};

/**
 * @description 回填：溢出缓解（如容器变宽）后按模板顺序把隐藏项重新尝试塞回可见列表
 * @param localShow 本地可见 uid 数组（塞入成功时原地更新）
 * @param widthCount 当前宽度记账
 * @param pushUid 当前路径的"尝试塞入"实现（见 pushShowUidWithMaxShow）
 * @returns 更新后的宽度记账
 */
const backfillHiddenUids = (
  localShow: number[],
  widthCount: number,
  pushUid: (localShow: number[], uid: number, widthCount: number) => number,
) => {
  const localHidden = uidSet.value.filter((uid) => !localShow.includes(uid));
  // 用局部累加器承接每轮塞入后的宽度记账，避免改写入参
  let count = widthCount;
  localHidden.forEach((uid) => {
    count = pushUid(localShow, uid, count);
  });
  return count;
};

/**
 * @description 将可见/隐藏 uid 列表按模板书写顺序排序后写回响应式状态
 * @param localShow 本地可见 uid 列表（原地排序后写回 showUids）
 * @param localHidden 本地隐藏 uid 列表（原地排序后写回 hiddenUids）
 */
const commitUidLists = (localShow: number[], localHidden: number[]) => {
  // 模板序索引：以 uid 在 uidSet 中的位置作为排序键，保证输出顺序与书写顺序一致
  const order = (uid: number) => uidSet.value.findIndex((v) => v === uid);
  localShow.sort((a, b) => order(a) - order(b));
  localHidden.sort((a, b) => order(a) - order(b));
  showUids.value = localShow;
  hiddenUids.value = localHidden;
};

/**
 * @description 有 maxShow 路径的"尝试塞入"：数量与宽度双判据
 * 塞入成功需同时满足：塞入后总宽不超过容器宽、可见数量不超过 maxShow
 * @param localShow 本地可见 uid 数组（塞入成功时原地 push）
 * @param uid 待塞入的页签 uid
 * @param widthCount 当前宽度记账
 * @returns 更新后的宽度记账（塞入失败时原值返回）
 */
const pushShowUidWithMaxShow = (localShow: number[], uid: number, widthCount: number) => {
  const { navElWidth } = getChildData(uid);
  // 首个塞入项不计 gap（前面没有相邻项）
  const gap = widthCount > 0 ? navGapNumber.value : 0;
  const isWidthWillExceed = widthCount + gap + navElWidth! > navsContainerWidth.value;
  const isNumWillExceed = localShow.length + 1 > props.maxShow!;
  if (!isWidthWillExceed && !isNumWillExceed) {
    localShow.push(uid);
    return widthCount + gap + navElWidth!;
  }
  return widthCount;
};

/**
 * @description 有 maxShow 的溢出折叠路径：数量与宽度双上限（回归隔离墙，行为保持不变）
 * 与无 maxShow 路径互不共享判据：同时受"可见数量 ≤ maxShow"与"总宽 ≤ 容器宽"约束，
 * 溢出项折叠进"更多"按钮弹层
 */
const sortUidListWithMaxShow = () => {
  /** 数量上限判据：给定可见数量超出 maxShow 即视为溢出 */
  const isNumExceed = (showNum: number) => showNum > props.maxShow!;

  let localShow: number[] = [...showUids.value];
  let widthCount = 0;

  // 首次分配：按模板顺序逐项尝试塞入，同时受数量与宽度约束
  if (!localShow.length) {
    uidSet.value.forEach((uid) => {
      widthCount = pushShowUidWithMaxShow(localShow, uid, widthCount);
    });
  }
  // 依据当前可见项重新累加宽度，避免沿用上一轮的陈旧记账
  widthCount = sumShowWidth(localShow);

  // 总量溢出（宽度或数量）时为"更多"按钮预留：一个 gap + 省略号宽度
  if (tabNavMeasurementWidth.value > navsContainerWidth.value || isNumExceed(uidSet.value.length)) {
    widthCount += navGapNumber.value + ellipsisWidth.value;
  }

  // 激活项不在可见列表时按模板序就近插回
  widthCount += insertActiveUidNearby(localShow);

  // 尾部裁剪：数量或宽度超限时从列表两端移除项（激活项贴尾时改从头部移除以保住激活项）
  const activeUid = getActiveUid();
  while ((widthCount > navsContainerWidth.value || isNumExceed(localShow.length)) && localShow.length > 1) {
    const activeItemIndex = localShow.findIndex((uid) => uid === activeUid);
    const removedUid = activeItemIndex === localShow.length - 1 ? localShow.shift()! : localShow.pop()!;
    widthCount -= getChildData(removedUid).navElWidth! + navGapNumber.value;
  }

  // 回填：溢出缓解后把隐藏项重新塞回可见列表，再按模板序提交
  widthCount = backfillHiddenUids(localShow, widthCount, pushShowUidWithMaxShow);
  commitUidLists(localShow, uidSet.value.filter((uid) => !localShow.includes(uid)));
};

/**
 * @description 有 maxShow 的折叠状态机入口（回归隔离墙，行为保持不变）
 * button 变体与移动端（lePadV）走全量渲染早退；无 maxShow 桌面端已分流到几何路径，
 * 不再进入宽度状态机（本函数仅供 layout 管线的非几何分支调用）
 */
const sortUidList = () => {
  if (props.variant === 'button' || lePadV.value) {
    showUids.value = uidSet.value;
    hiddenUids.value = [];
    return;
  }
  // maxShow 路径的宽度数据来源：测量列表 DOM（节点保留，仅此处同步实测值）
  syncNavElWidths();
  sortUidListWithMaxShow();
};

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
 * @description 收口管线的逻辑最大滚动量：内容宽度（可见列表布局宽）− 容器可视宽
 * @remarks 省略号钉住右缘的平移会随滚动位置扩大容器可滚动溢出区（变换后的
 * 盒子计入 scrollWidth），滚动发生后 scrollWidth − clientWidth 会虚高，
 * 因此 clamp 与滚动入视均以可见列表自身的布局宽度为内容宽度来源
 * @returns 逻辑最大滚动量（内容不超过容器宽时为 0）
 */
const getMaxScrollLeft = () => {
  const container = navsContainerRef.value;
  if (!container) {
    return 0;
  }
  const contentWidth = tabNavRef.value?.offsetWidth ?? container.scrollWidth;
  return Math.max(0, contentWidth - container.clientWidth);
};

/**
 * @description 将当前激活页签滚动到容器可视区域内（水平居中，边缘 clamp）
 * 滚动宿主统一为 navsContainerRef 本身：移动端滚动模式与桌面端几何路径
 * （容器 overflow-x 裁切 + 编程滚动）共用本入口；maxShow/button 桌面路径
 * 无滚动语义，直接返回。仅操作容器的 scrollLeft，避免触发页面级垂直滚动
 */
const scrollActiveIntoView = async () => {
  const scrollable = lePadV.value || isGeometryPath();
  if (!scrollable || !navsContainerRef.value) {
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

  const container = navsContainerRef.value;
  const activeEl = activeItem.navEl;
  if (!container || !activeEl) {
    return;
  }

  // 计算激活 tab 相对容器左边缘的偏移量
  const containerRect = container.getBoundingClientRect();
  const activeRect = activeEl.getBoundingClientRect();
  const offsetLeft = activeRect.left - containerRect.left;
  // 居中位置 = 当前 scrollLeft + 偏移量 - 半容器宽 + 半 tab 宽
  const targetScrollLeft = container.scrollLeft + offsetLeft - containerRect.width / 2 + activeRect.width / 2;

  container.scrollTo({
    // 目标同样 clamp 到逻辑最大滚动量：省略号钉住的平移会随滚动位置虚高
    // 容器的可滚动区（scrollWidth），不经 clamp 的目标会被浏览器带回越界位置
    left: Math.min(targetScrollLeft, getMaxScrollLeft()),
    behavior: 'smooth',
  });
};
/**
 * @description 将省略号钉在容器可视右缘
 * 省略号是容器 padding box 上的 absolute 子元素（right:0），随内容一起滚动；
 * 编程滚动后按当前 scrollLeft 平移回视口右缘，保证任意滚动位置都能点击展开弹层
 * @param container 滚动宿主（.o-tab-navs-container）
 */
const pinEllipsisToViewport = (container: HTMLElement) => {
  const ellipsis = ellipsisRef.value;
  if (!ellipsis) {
    return;
  }
  ellipsis.style.transform = container.scrollLeft > 0 ? `translateX(${container.scrollLeft}px)` : '';
};

/**
 * @description 仅在内联样式值变化时写入，避免逐帧重算期间触发无谓的样式失效
 * @param el 目标 DOM 节点
 * @param prop 内联样式属性名（camelCase）
 * @param value 目标值，空字符串即移除内联声明
 */
const setStyleIfChanged = (el: HTMLElement, prop: 'clipPath' | 'visibility', value: string) => {
  if (el.style[prop] !== value) {
    el.style[prop] = value;
  }
};

/**
 * @description 省略号覆盖区遮蔽：对单个页签注入/清除内联遮蔽样式
 * 边界线与隐藏名单同一条线（visibleRight，±1px 容差）三分支：
 * - 右缘越界且左缘仍在边界内（部分可见）→ clip-path 右侧裁切，可见区恰止于边界线；
 * - 左缘越过边界线（整体落入覆盖区）→ visibility 隐藏，保留布局占位；
 * - 右缘未越界（含左侧滚出、渐变阴影区）→ 无遮蔽样式。
 * 省略号盒背景透明，未遮蔽时覆盖区会透出下层页签文字；裁切不依赖任何颜色假设
 * @param navEl 页签 DOM 节点
 * @param rect 页签当前视口矩形
 * @param visibleRight 可见边界线（容器右缘 − 省略号本体宽）
 */
const applyCoverageMask = (navEl: HTMLElement, rect: DOMRect, visibleRight: number) => {
  if (rect.right > visibleRight + 1) {
    if (rect.left >= visibleRight - 1) {
      setStyleIfChanged(navEl, 'visibility', 'hidden');
      setStyleIfChanged(navEl, 'clipPath', '');
    } else {
      setStyleIfChanged(navEl, 'clipPath', `inset(0 ${rect.right - visibleRight}px 0 0)`);
      setStyleIfChanged(navEl, 'visibility', '');
    }
    return;
  }
  setStyleIfChanged(navEl, 'clipPath', '');
  setStyleIfChanged(navEl, 'visibility', '');
};

/**
 * @description 清除全部页签的覆盖区遮蔽内联样式（离开几何路径清场）
 * 未挂载的页签（如 maxShow 折叠出可见列表）无 navEl，无需处理
 */
const clearNavMasks = () => {
  uidSet.value.forEach((uid) => {
    const navEl = getChildData(uid)?.navEl;
    if (navEl) {
      setStyleIfChanged(navEl, 'clipPath', '');
      setStyleIfChanged(navEl, 'visibility', '');
    }
  });
};

/**
 * @description 几何路径隐藏名单重算：不完全可见（左/右任一缘越界）的页签进入省略号弹层名单
 * 同步 getBoundingClientRect 计算。右缘可见边界 = 容器右缘 − 省略号本体宽度
 * （渐变阴影区计为可见、省略号本体覆盖区计为不可见），边界容差 1px。
 * 同循环内逐页签同步覆盖区遮蔽：越界右缘裁切、覆盖区整体隐藏（见 applyCoverageMask）
 */
const updateHiddenListGeometry = () => {
  if (!isGeometryPath()) {
    return;
  }
  const container = navsContainerRef.value;
  if (!container) {
    return;
  }
  pinEllipsisToViewport(container);
  const containerRect = container.getBoundingClientRect();
  // 省略号显示时右缘内退一个省略号本体宽度；隐藏时不占用可见区
  const reservedWidth = isCollapseActive.value && ellipsisRef.value ? ellipsisRef.value.getBoundingClientRect().width : 0;
  const visibleRight = containerRect.right - reservedWidth;
  const hidden: number[] = [];
  uidSet.value.forEach((uid) => {
    const navEl = getChildData(uid)?.navEl;
    if (!navEl) {
      // 尚未挂载的页签暂不判隐藏，等待下一帧测量补齐
      return;
    }
    const rect = navEl.getBoundingClientRect();
    if (rect.left < containerRect.left - 1 || rect.right > visibleRight + 1) {
      hidden.push(uid);
    }
    // 覆盖区遮蔽与名单同线同步：右缘越界裁切、整体覆盖隐藏、未越界清场
    applyCoverageMask(navEl, rect, visibleRight);
  });
  hiddenUids.value = hidden;
};

/** 隐藏名单测量的 RAF 防抖入口：布局管线与滚动事件共用（平滑滚动期间逐帧重算） */
const scheduleHiddenMeasure = debounceRAF(updateHiddenListGeometry);

/**
 * @description 几何路径布局管线：全量渲染 → clamp scrollLeft → 滚动激活入视 → 更新指示器 → 下一帧重算名单
 * @remarks 溢出判定由 isOverflown/isCollapseActive 响应式承担，本函数只做布局收口
 */
const layoutGeometry = () => {
  const container = navsContainerRef.value;
  if (!container) {
    return;
  }
  // 全量渲染：可见列表即全部页签，溢出由容器 overflow-x 裁切
  showUids.value = uidSet.value;
  // clamp：内容收缩后 scrollLeft 可能越界，先收回合法区间再滚动入视
  // （用逻辑最大滚动量而非 scrollWidth，避免被省略号平移虚高的可滚动区抵消）
  const maxScrollLeft = getMaxScrollLeft();
  if (container.scrollLeft > maxScrollLeft) {
    container.scrollLeft = maxScrollLeft;
  }
  // 新触发到来时 scrollTo 直接重滚，进行中的平滑滚动被新滚动自然打断
  scrollActiveIntoView();
  // 指示器定位：anchor 随容器内容一起滚动，稳态天然对齐，无需滚动补偿
  updateAnchor();
  scheduleHiddenMeasure();
};

/**
 * @description 布局单一收口管线（layout），所有触发源统一进入
 * 触发源：容器 resize（v-on-resize）/ 页签增删（MutationObserver + uidSet）/ 断点切换（lePadV）/
 * 激活变化 / 省略号宽度变化 / 容器与内容测量宽度变化（onMounted watch）
 * - 几何路径：几何布局管线；
 * - 其余路径（maxShow 状态机 / button / 移动端）：状态机 + 指示器 + 移动端入视滚动，行为保持不变
 */
const layout = debounceRAF(() => {
  // 移动端两侧渐变 class（内部自带 lePadV 守卫，桌面端为空操作）
  checkOverflow();
  if (isGeometryPath()) {
    layoutGeometry();
    return;
  }
  sortUidList();
  updateAnchor();
  scrollActiveIntoView();
  // 离开几何路径（断点切换/变更 maxShow）时清除省略号钉住的平移与页签遮蔽内联样式，避免残留
  if (ellipsisRef.value) {
    ellipsisRef.value.style.transform = '';
  }
  clearNavMasks();
});

/**
 * @description 容器滚动回调：移动端刷新两侧渐变 class；几何路径逐帧重算隐藏名单
 * 平滑滚动期间 scroll 事件逐帧触发，覆盖滚动全程的名单正确性（不依赖 scrollend）
 */
const onContainerScroll = () => {
  checkOverflow();
  scheduleHiddenMeasure();
};

onMounted(() => {
  watch(
    [uidSet, activeKey, navsContainerWidth, tabNavMeasurementWidth, () => props.maxShow, () => props.variant, ellipsisWidth, navGapNumber],
    () => {
      // 布局单一收口入口：页签增删/激活变化/断点内容器与内容宽度变化/省略号宽度变化
      layout();
    },
    {
      immediate: true,
      deep: true,
    },
  );
});

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
  if (!item?.navMeasureEl) {
    return;
  }
  item.navElWidth = item.navMeasureEl.clientWidth;
});
/** 头部元素 resize 统一触发布局收口管线（layout 自带 RAF 防抖） */
const onHeadResize = () => {
  layout();
};
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
watch(lePadV, () => {
  onHeadResize();
});
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
            overflown: isCollapseActive,
            'o-tab-navs-container-mb-overflown': tabNavLeftOverflown || tabNavRightOverflown,
          }"
          @scroll="onContainerScroll"
        >
          <!-- 渲染一个全宽但是零高度的节点来测量每个节点的宽度，以计算溢出情况 -->
          <div v-show="!lePadV" ref="tabNavMeasurementRef" v-on-resize="onHeadResize" class="o-tab-nav-list width-measurement">
            <ReuseTabNavTemplate v-for="uid in uidSet" :key="childMap[uid].paneKey" :uid="uid" :measurement="true" />
          </div>
          <div ref="tabNavRef" v-on-resize="onHeadResize" class="o-tab-nav-list" :style="navListStyle">
            <ReuseTabNavTemplate v-for="uid in showUids" :key="childMap[uid].paneKey" :uid="uid" />
            <div
              v-if="props.variant !== 'button'"
              v-show="isCollapseActive"
              ref="ellipsisRef"
              :class="[
                'o-tab-nav',
                {
                  'o-tab-nav-active': props.maxShow && isEllipsisOptionShow,
                  'o-tab-nav-ellipsis': isUndefined(props.maxShow),
                },
              ]"
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
      <OPopup
        v-model:visible="isEllipsisOptionShow"
        wrap-class="o-options-popup o-tab-more-popup"
        body-class="o-popup-body"
        position="bl"
        wrapper="body"
        :target="ellipsisRef"
        :trigger="['click-outclick', 'hover']"
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
