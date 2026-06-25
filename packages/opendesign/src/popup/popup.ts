import { Ref } from 'vue';
import { getElementSize, getOffsetElement, getScroll } from '../_utils/dom';
import type { PositionT } from '../_utils/types';
import type { PopupPositionT, PopupTriggerT } from './types';

import { useOutClick } from '../hooks/use-out-click';

/**
 * popup 视口坐标 (builder 阶段输出 / flip 阶段修改 / clamp 阶段调整 / wrap 阶段输出 transform)。
 *
 * 12 个 position 统一语义:
 * - `left` = 视口坐标的弹层左边缘 X
 * - `top` = 视口坐标的弹层顶边 Y
 *
 * `transform` 字段仅在 `getPopupWrapOffset` 输出阶段存在 (wrapper 坐标系下的 transform 像素值),
 * builder 阶段不输出, flip/clamp 阶段不修改。
 */

interface Pos {
  /** 视口坐标的弹层左边缘 X */
  left: number;
  /** 视口坐标的弹层顶边 Y */
  top: number;
}
interface DomContentRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface AnchorPosition {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}

type ElementSize = ReturnType<typeof getElementSize>;

/** 视口坐标 → 弹层坐标的策略参数 (供 getPopupWrapOffset 等函数使用) */
interface WrapOffsetCtx {
  /** wrapper 元素, null 表示无 wrapper 上下文 */
  wrapperEl: HTMLElement | null;
  /** wrapper 的内容矩形, undefined 表示走 body 分支 */
  wrapperContentRect?: DomContentRect;
}

/** popup 方向坐标转换的上下文 (用于 adjustOffset / maybeFlipDirection 等) */
interface FlipCtx {
  /** popup 视口位置 (来自 viewOffsetBuilders) */
  popupPosition: Pos;
  /** popup 自身尺寸 */
  popupSize: ElementSize;
  /** target 元素视口矩形 */
  tRect: DOMRect;
  /** popup 允许的边缘范围 */
  edge: ReturnType<typeof getWrapperViewEdge>;
  /** popup 距离 target 的偏移 */
  offset: number | undefined;
}

/**
 * 获取 wrapper 作为 containing block 时的 client 区域范围
 * @param wrapperEl - wrapper 元素
 * @param wrapperRect - 预计算的 wrapper getBoundingClientRect, 可选
 * @returns wrapper 内容矩形
 */
function getWrapperContentRect(wrapperEl: HTMLElement, wrapperRect?: DOMRect): DomContentRect {
  const rect = wrapperRect || wrapperEl.getBoundingClientRect();
  // 使用 clientLeft/clientTop 获取边框宽度比 getComputedStyle 更准确
  const left = rect.left + wrapperEl.clientLeft;
  const top = rect.top + wrapperEl.clientTop;
  return {
    left,
    top,
    right: left + wrapperEl.clientWidth,
    bottom: top + wrapperEl.clientHeight,
  };
}

/**
 * 根据 position 计算 popup 的视口坐标偏移
 *
 * @param t - target 视口矩形
 * @param pSize - popup 尺寸
 * @param offset - popup 距离 target 的偏移
 * @returns 视口坐标的 popup 左/上边缘
 */
type ViewOffsetBuilder = (t: DOMRect, pSize: ElementSize, offset: number) => Pos;

const viewOffsetBuilders: Record<PopupPositionT, ViewOffsetBuilder> = {
  top: (t, pSize, offset) => ({
    left: t.left + t.width / 2 - pSize.width / 2,
    top: t.top - offset - pSize.height,
  }),
  bottom: (t, pSize, offset) => ({
    left: t.left + t.width / 2 - pSize.width / 2,
    top: t.bottom + offset,
  }),
  left: (t, pSize, offset) => ({
    left: t.left - offset - pSize.width,
    top: t.top + t.height / 2 - pSize.height / 2,
  }),
  right: (t, pSize, offset) => ({
    left: t.right + offset,
    top: t.top + t.height / 2 - pSize.height / 2,
  }),
  tl: (t, pSize, offset) => ({
    left: t.left,
    top: t.top - offset - pSize.height,
  }),
  tr: (t, pSize, offset) => ({
    left: t.right - pSize.width,
    top: t.top - offset - pSize.height,
  }),
  bl: (t, _pSize, offset) => ({
    left: t.left,
    top: t.bottom + offset,
  }),
  br: (t, pSize, offset) => ({
    left: t.right - pSize.width,
    top: t.bottom + offset,
  }),
  lt: (t, pSize, offset) => ({
    left: t.left - offset - pSize.width,
    top: t.top,
  }),
  lb: (t, pSize, offset) => ({
    left: t.left - offset - pSize.width,
    top: t.bottom - pSize.height,
  }),
  rt: (t, _pSize, offset) => ({
    left: t.right + offset,
    top: t.top,
  }),
  rb: (t, pSize, offset) => ({
    left: t.right + offset,
    top: t.bottom - pSize.height,
  }),
};

interface ViewOffsetOptions {
  /** target 视口矩形 */
  t: DOMRect;
  /** popup 尺寸 */
  pSize: ElementSize;
  /** popup 距离 target 的偏移 */
  offset?: number;
}

/**
 * 调用 viewOffsetBuilders 计算 popup 的视口坐标偏移 (左/上边缘)
 * @param position - popup 位置
 * @param opts - 配置项 (t / pSize / offset)
 * @returns 视口坐标的 popup 左/上边缘
 */
function getPopupViewOffset(position: PopupPositionT, { t, pSize, offset = 0 }: ViewOffsetOptions): Pos {
  return viewOffsetBuilders[position](t, pSize, offset);
}

/**
 * 返回 popup 在视窗与 wrapper 约束下允许的边缘范围
 * @param popupSize - popup 尺寸
 * @param wrapperRect - wrapper 内容矩形 (可选, 无则只受视窗约束)
 * @param edgeOffset - popup 与边缘的最小距离
 * @returns popup 允许的视口边缘范围
 */
function getWrapperViewEdge(popupSize: ElementSize, wrapperRect?: DomContentRect, edgeOffset: number = 0) {
  const viewport = {
    left: edgeOffset,
    // 使用 document.documentElement.clientWidth 而非 window.innerWidth 是为了去除滚动条宽度
    right: document.documentElement.clientWidth - popupSize.width - edgeOffset,
    top: edgeOffset,
    bottom: document.documentElement.clientHeight - popupSize.height - edgeOffset,
  };

  if (!wrapperRect) {
    return viewport;
  }
  return {
    left: Math.max(viewport.left, wrapperRect.left),
    top: Math.max(viewport.top, wrapperRect.top),
    right: Math.min(viewport.right, wrapperRect.right - popupSize.width),
    bottom: Math.min(viewport.bottom, wrapperRect.bottom - popupSize.height),
  };
}

/**
 * 计算 popup 在 wrapper 内的 transform 像素值。
 *
 * @param pos - viewOffsetBuilders 输出的视口坐标 Pos (已 flip + clamp)
 * @param ctx - 上下文 (wrapperEl / wrapperContentRect)
 * @returns wrapper 坐标系的 Pos (transform 字符串)
 */
function getPopupWrapOffset(pos: Pos, { wrapperEl, wrapperContentRect }: WrapOffsetCtx): Pos {
  if (!wrapperEl) {
    return pos;
  }
  const cs = getScroll(wrapperEl);
  const offsetX = cs.scrollLeft - (wrapperContentRect?.left ?? 0);
  const offsetY = cs.scrollTop - (wrapperContentRect?.top ?? 0);
  const tx = typeof pos.left === 'number' ? pos.left + offsetX : 0;
  const ty = typeof pos.top === 'number' ? pos.top + offsetY : 0;
  return { left: tx, top: ty };
}

/** position → 所属方向的映射 (top/bottom/left/right) */
const directionByPosition: Record<PopupPositionT, PositionT> = {
  tl: 'top',
  tr: 'top',
  top: 'top',
  bl: 'bottom',
  br: 'bottom',
  bottom: 'bottom',
  lt: 'left',
  lb: 'left',
  left: 'left',
  rt: 'right',
  rb: 'right',
  right: 'right',
};

/**
 * 获取 position 所属的方向 (top/bottom/left/right)
 * @param position - popup 位置
 * @returns 所属方向
 */
function getDirection(position: PopupPositionT): PositionT {
  return directionByPosition[position];
}

const positionFlipMap: Record<PositionT, Partial<Record<PopupPositionT, PopupPositionT>>> = {
  top: { bottom: 'top', bl: 'tl', br: 'tr' },
  bottom: { top: 'bottom', tl: 'bl', tr: 'br' },
  left: { right: 'left', rt: 'lt', rb: 'lb' },
  right: { left: 'right', lt: 'rt', lb: 'rb' },
};

/**
 * 根据指定方向翻转 position (例如 top<->bottom, left<->right)
 * @param position - 原始 popup 位置
 * @param direction - 翻转目标方向
 * @returns 翻转后的 position, 无匹配规则时返回原值
 */
function adjustPosition(position: PopupPositionT, direction: PositionT): PopupPositionT {
  return positionFlipMap[direction][position] ?? position;
}

type FlipDirection = PositionT | null;

/** detectXxxFlip 共享的轻量上下文 */
interface FlipDetectCtx {
  /** popup 视口位置 (left/top = 弹层左/上边缘) */
  pos: Pos;
  /** popup 允许的边缘范围 */
  edge: ReturnType<typeof getWrapperViewEdge>;
  /** popup 尺寸 */
  popupSize: ElementSize;
}

/**
 * 检测 top 方向是否需要翻转到 bottom
 *
 * 弹层底边 = pos.top + popupSize.height, 与 edge.bottom 比较: 底边超出视口底部则翻转到 bottom。
 *
 * @param ctx - 上下文 (pos / edge / popupSize)
 * @returns 需要翻转时返回 'bottom', 否则返回 null
 */
function detectTopFlip({ pos, edge }: FlipDetectCtx): FlipDirection {
  if (typeof pos.top !== 'number') return null;
  return edge.top > pos.top ? 'bottom' : null;
}

/**
 * 检测 bottom 方向是否需要翻转到 top
 *
 * 弹层底边 = pos.top + popupSize.height, 与 edge.bottom 比较: 底边超出视口底部则翻转到 top。
 *
 * @param ctx - 上下文 (pos / edge / popupSize)
 * @returns 需要翻转时返回 'top', 否则返回 null
 */
function detectBottomFlip({ pos, edge }: FlipDetectCtx): FlipDirection {
  if (typeof pos.top !== 'number') return null;
  return edge.bottom < pos.top ? 'top' : null;
}

/**
 * 检测 left 方向是否需要翻转到 right
 *
 * 弹层左边缘 = pos.left, 与 edge.left 比较: 越界则翻转到 right。
 *
 * @param ctx - 上下文 (pos / edge / popupSize)
 * @returns 需要翻转时返回 'right', 否则返回 null
 */
function detectLeftFlip({ pos, edge }: FlipDetectCtx): FlipDirection {
  if (typeof pos.left !== 'number') return null;
  return edge.left > pos.left ? 'right' : null;
}

/**
 * 检测 right 方向是否需要翻转到 left
 *
 * 弹层右边缘 = pos.left + popupSize.width, 与 edge.right 比较: 越界则翻转到 left。
 *
 * @param ctx - 上下文 (pos / edge / popupSize)
 * @returns 需要翻转时返回 'left', 否则返回 null
 */
function detectRightFlip({ pos, edge }: FlipDetectCtx): FlipDirection {
  if (typeof pos.left !== 'number') return null;
  return edge.right < pos.left ? 'left' : null;
}

/** direction → 翻转检测函数的查表 */
const flipDetectors: Record<PositionT, (ctx: FlipDetectCtx) => FlipDirection> = {
  top: detectTopFlip,
  bottom: detectBottomFlip,
  left: detectLeftFlip,
  right: detectRightFlip,
};

/**
 * 当 popup 超出视窗/wrapper 时翻转方向 (top<->bottom, left<->right)。
 *
 * flip 决策基于「弹层真实边界 vs 视口/wrapper 边界」比较, 与 viewOffsetBuilders 输出语义统一。
 * 翻转后用新 position 调 viewOffsetBuilders 重算 style (pSize 整轮冻结, builder 输入稳定)。
 *
 * @param position - 当前 position
 * @param ctx - 翻转所需上下文 (popupPosition / popupSize / tRect / edge / offset)
 * @returns 翻转结果 (fixedPosition 与新 style)
 */
function maybeFlipDirection(position: PopupPositionT, ctx: FlipCtx): { fixedPosition: PopupPositionT; style: Pos } {
  const d = getDirection(position);
  const style: Pos = { ...ctx.popupPosition };
  const direction = flipDetectors[d]({
    pos: ctx.popupPosition,
    edge: ctx.edge,
    popupSize: ctx.popupSize,
  });
  if (direction === null) {
    return { fixedPosition: position, style };
  }
  const fixedPosition = adjustPosition(position, direction);
  return {
    fixedPosition,
    style: getPopupViewOffset(fixedPosition, { t: ctx.tRect, pSize: ctx.popupSize, offset: ctx.offset }),
  };
}

/**
 * 钳制弹层左边缘 X 到 [edge.left, edge.right] 范围内。
 *
 * @param left - 弹层左边缘视口 X
 * @param edge - popup 允许的边缘范围
 * @returns 钳制后的 left, 未越界时返回原值
 */
function clampLeft(left: number, edge: ReturnType<typeof getWrapperViewEdge>): number {
  if (edge.left > left) {
    return edge.left;
  }
  if (edge.right < left) {
    return edge.right;
  }
  return left;
}

/**
 * 钳制弹层顶边 Y 到 [edge.top, edge.bottom] 范围内。
 *
 * @param top - 弹层顶边视口 Y
 * @param edge - popup 允许的边缘范围
 * @returns 钳制后的 top, 未越界时返回原值
 */
function clampTop(top: number, edge: ReturnType<typeof getWrapperViewEdge>): number {
  if (edge.top > top) {
    return edge.top;
  }
  if (edge.bottom < top) {
    return edge.bottom;
  }
  return top;
}

/** adjustOffset 的可选项 */
interface AdjustOffsetOptions {
  /** 视口坐标的 popup 偏移 */
  popupPosition: Pos;
  /** popup 尺寸 (整轮 calc 冻结) */
  popupSize: ElementSize;
  /** target 视口矩形 */
  tRect: DOMRect;
  /** wrapper 内容矩形 (可选) */
  wRect?: DomContentRect;
  /** anchor 钳制时使用的偏移 */
  anchorOffset?: number;
  /** popup 距离 target 的偏移 */
  offset?: number;
  /** popup 与视窗边缘的最小距离 */
  edgeOffset?: number;
}

/**
 * 根据 popup 的极值调整位置: 翻转方向 + clamp 到视窗/wrapper 范围。
 *
 * 12 个 position 走同一条 clamp 路径 (同时调 clampLeft 与 clampTop),
 * 不再有 isHorizontal 分支, 写入的 left/top 字段最终由 getPopupWrapOffset 翻译为 transform 像素。
 *
 * @param position - popup 位置
 * @param opts - 配置项 (popupPosition / popupSize / tRect / wRect / offset / edgeOffset)
 * @returns 调整后的 position 与 popupStyle
 */
function adjustOffset(position: PopupPositionT, { popupPosition, popupSize, tRect, wRect, offset, edgeOffset }: AdjustOffsetOptions) {
  const edge = getWrapperViewEdge(popupSize, wRect, edgeOffset);

  const flipped = maybeFlipDirection(position, {
    popupPosition,
    popupSize,
    tRect,
    edge,
    offset,
  });

  const style: Pos = { ...flipped.style };
  if (typeof style.left === 'number') {
    style.left = clampLeft(style.left, edge);
  }
  if (typeof style.top === 'number') {
    style.top = clampTop(style.top, edge);
  }

  return {
    position: flipped.fixedPosition,
    popupStyle: style,
  };
}

/** getAnchorOffset 的可选项 */
interface GetAnchorOffsetOptions {
  /** target 元素视口矩形 */
  tRect: DOMRect;
  /** viewOffsetBuilders 输出的 Pos (已 flip + clamp 后) */
  popupStyle: Pos;
  /** popup 尺寸 */
  popupSize: ElementSize;
  /** anchor 距弹层边缘的最小距离 */
  anchorOffset?: number;
}

/** position → anchor 贴边的 CSS 位置规则 */
type AnchorRule = (x: number, y: number) => AnchorPosition;

const bottomEdgeRules: AnchorRule = (x) => ({ left: `${x}px`, bottom: '0px' });
const topEdgeRules: AnchorRule = (x) => ({ left: `${x}px`, top: '0px' });
const rightEdgeRules: AnchorRule = (_x, y) => ({ top: `${y}px`, right: '0px' });
const leftEdgeRules: AnchorRule = (_x, y) => ({ top: `${y}px`, left: '0px' });

/** position → anchor 贴边规则的查表 */
const anchorRuleByPosition: Record<PopupPositionT, AnchorRule> = {
  top: bottomEdgeRules,
  tl: bottomEdgeRules,
  tr: bottomEdgeRules,
  bottom: topEdgeRules,
  bl: topEdgeRules,
  br: topEdgeRules,
  left: rightEdgeRules,
  lt: rightEdgeRules,
  lb: rightEdgeRules,
  right: leftEdgeRules,
  rt: leftEdgeRules,
  rb: leftEdgeRules,
};

/**
 * 计算 anchor (箭头) 在 popup 内部的相对位置。
 *
 * 直接读取 `popupStyle.left` / `popupStyle.top` (统一为「视口坐标的弹层左/上边缘」)，
 * 用 `target 中心 − 弹层边缘` 算出 anchor 偏移, 再 clamp 到弹层内部, 最后按 position 贴到对应边。
 *
 * @param position - popup 位置
 * @param opts - 配置项 (tRect / popupStyle / popupSize / anchorOffset)
 * @returns anchor 在 popup 内部的位置
 */
function getAnchorOffset(position: PopupPositionT, { tRect, popupStyle, popupSize, anchorOffset = 8 }: GetAnchorOffsetOptions): AnchorPosition {
  const targetCenterX = tRect.left + tRect.width / 2;
  const targetCenterY = tRect.top + tRect.height / 2;
  const rawX = targetCenterX - (popupStyle.left ?? 0);
  const rawY = targetCenterY - (popupStyle.top ?? 0);
  const x = Math.min(Math.max(rawX, anchorOffset), popupSize.width - anchorOffset);
  const y = Math.min(Math.max(rawY, anchorOffset), popupSize.height - anchorOffset);
  return anchorRuleByPosition[position](x, y);
}

/** calcPopupStyle 的可选项 */
interface CalcPopupStyleOptions {
  /** popup 元素 */
  popupEl: HTMLElement;
  /** target 元素 */
  targetEl: HTMLElement;
  /** popup 位置 */
  position: PopupPositionT;
  /** 自适应容器边缘 */
  adaptive?: boolean;
  /** 是否计算 anchor 位置 */
  anchor?: boolean;
  /** anchor 距弹层边缘的最小距离 */
  anchorOffset?: number;
  /** popup 距离 target 的偏移 */
  offset?: number;
  /** popup 与容器边缘的最小距离 */
  edgeOffset?: number;
}

/**
 * 计算 popup 最终的位置与样式 (含自适应翻转、anchor 位置、wrapper 坐标转换)
 * @param opts - 配置项 (popupEl / targetEl / position / adaptive / anchor / anchorOffset / offset / edgeOffset)
 * @returns popup 最终的位置、样式、anchor 位置与是否翻转
 */
/** resolveWrapperContext 的返回值 */
interface WrapperContext {
  /** wrapper 元素, null 时调用方应直接返回原 popupStyle */
  wrapperEl: HTMLElement | null;
  /** wrapper 内容矩形, undefined 表示走 body 分支 */
  wrapperContentRect?: DomContentRect;
  /** wrapper 是否构成视觉边界 (overflow 非 visible) */
  isWrapperBounded: boolean;
}

/**
 * 解析 popup 的 wrapper 上下文 (wrapperEl / 内容矩形 / 是否视觉边界)
 *
 * 判断 wrapper 是否构成「视觉边界」: overflow 任一非 visible 即视为视觉边界。
 * 不用 scrollWidth/scrollHeight 检测可滚动, 因为 popup 自身会撑出 wrapper 范围, 导致误判。
 *
 * @param popupEl - popup 元素
 * @returns wrapper 上下文, wrapperEl 为 null 表示无 wrapper
 */
function resolveWrapperContext(popupEl: HTMLElement): WrapperContext {
  const wrapperEl = getOffsetElement(popupEl) as HTMLElement | null;
  if (!wrapperEl) {
    return { wrapperEl: null, isWrapperBounded: false };
  }
  const wrapperRect = wrapperEl.getBoundingClientRect();
  // body 作为 popup 的 parent 实际是 absolute 定位的 containing block = 初始包含块 (视口)
  const wrapperContentRect = wrapperEl.nodeName === 'HTML' ? undefined : getWrapperContentRect(wrapperEl, wrapperRect);
  let isWrapperBounded = false;
  if (wrapperContentRect && typeof window !== 'undefined') {
    const cs = window.getComputedStyle(wrapperEl);
    isWrapperBounded = cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
  }
  return { wrapperEl, wrapperContentRect, isWrapperBounded };
}

/**
 * 计算 popup 最终的位置与样式 (含自适应翻转、anchor 位置、wrapper 坐标转换)。
 *
 * pSize 在入口读取一次, 整轮 calc 冻结: viewOffsetBuilders (依赖 pSize 的 10 个 builder)
 * 与 adjustOffset 内的 flip/clamp 共享同一份 pSize, 避免写出的 popStyle 触发 CSS
 * shrink-to-fit 重新收敛导致 pSize 漂移。
 *
 * @param opts - 配置项 (popupEl / targetEl / position / adaptive / anchor / anchorOffset / offset / edgeOffset)
 * @returns popup 最终的位置、样式、anchor 位置与是否翻转
 * @todo getBoundingClientRect 与 offsetWidth clientWidth 混用可能在有 scale 时产生问题
 */
export function calcPopupStyle({
  popupEl,
  targetEl,
  position,
  adaptive = true,
  anchor = true,
  anchorOffset = 8,
  offset = 8,
  edgeOffset = 0,
}: CalcPopupStyleOptions) {
  const tRect = targetEl.getBoundingClientRect();
  const popupSize = getElementSize(popupEl);
  const { wrapperEl, wrapperContentRect, isWrapperBounded } = resolveWrapperContext(popupEl);
  const emptyAnchor: AnchorPosition = {};

  if (!wrapperEl) {
    return {
      popupStyle: getPopupViewOffset(position, { t: tRect, pSize: popupSize, offset }),
      position,
      anchorStyle: emptyAnchor,
    };
  }

  let popupStyle = getPopupViewOffset(position, { t: tRect, pSize: popupSize, offset });
  let fixedPosition = position;
  if (adaptive) {
    const rlt = adjustOffset(position, {
      popupPosition: popupStyle,
      popupSize,
      tRect,
      wRect: isWrapperBounded ? wrapperContentRect : undefined,
      offset,
      anchorOffset: anchor ? anchorOffset : 0,
      edgeOffset,
    });
    fixedPosition = rlt.position;
    popupStyle = rlt.popupStyle;
  }
  const anchorStyle = anchor ? getAnchorOffset(fixedPosition, { tRect, popupStyle, popupSize, anchorOffset }) : emptyAnchor;
  popupStyle = getPopupWrapOffset(popupStyle, { wrapperEl, wrapperContentRect });

  return {
    position: fixedPosition,
    popupStyle,
    anchorStyle,
  };
}

/** click 触发器的共享上下文 (避免 clickFn 与两个 click 分支重复) */
interface ClickCtx {
  /** 触发元素 */
  el: HTMLElement;
  /** popup ref, 用于判断外部点击是否在 popup 内 */
  popupRef: Ref<HTMLElement | null>;
  /** 是否自动隐藏 (用于决定是否注册外部点击关闭) */
  autoHide: boolean;
  /** outclick 单例 */
  outClick: ReturnType<typeof useOutClick>;
  /** 收集解绑函数的数组 */
  listeners: Array<() => void>;
  /** 显隐控制函数 */
  updateFn: (isVisible?: boolean, delay?: number) => void;
}

/** outclick 异常判定: target 在 popup 内则不触发隐藏 */
function isInsidePopup(event: Event, popupRef: Ref<HTMLElement | null>): boolean {
  return !!popupRef.value?.contains(event.target as HTMLElement);
}

/** buildClickHandler 的可选项 */
interface BuildClickHandlerOptions {
  /** 触发元素 */
  el: HTMLElement;
  /** 是否自动隐藏 */
  autoHide: boolean;
  /** outclick 单例 */
  outClick: ReturnType<typeof useOutClick>;
  /** popup ref */
  popupRef: Ref<HTMLElement | null>;
  /** 显隐控制函数 */
  updateFn: (isVisible?: boolean) => void;
  /** 实际触发显示/切换的内部 handler */
  inner: () => void;
}

/**
 * 构造 click 触发器的 click handler (含 autoHide 时注册外部点击关闭)
 * @param opts - 配置项 (el / autoHide / outClick / popupRef / updateFn / inner)
 * @returns click 事件 handler
 */
function buildClickHandler({ el, autoHide, outClick, popupRef, updateFn, inner }: BuildClickHandlerOptions): () => void {
  return () => {
    inner();
    if (autoHide) {
      const onOutsideClick = () => {
        updateFn(false);
        outClick.removeListener(el, onOutsideClick);
      };
      outClick.addListener(el, onOutsideClick, {
        exception: (e: Event) => isInsidePopup(e, popupRef),
      });
    }
  };
}

/**
 * 绑定 click / click-outclick 触发器, toggle=true 时点击切换显示, false 时点击始终显示
 * @param ctx - 共享上下文
 * @param toggle - 是否点击切换显示
 */
function bindClickTrigger(ctx: ClickCtx, toggle: boolean): void {
  const { el, autoHide, outClick, listeners, popupRef, updateFn } = ctx;
  const inner = toggle ? () => updateFn() : () => updateFn(true);
  const fn = buildClickHandler({ el, autoHide, outClick, popupRef, updateFn, inner });
  el.addEventListener('click', fn);
  listeners.push(() => el.removeEventListener('click', fn));
}

/** 单方向触发器 (hover / focus / contextmenu / hover-outclick / none) 的共享上下文 */
interface SingleTriggerCtx {
  /** 触发元素 */
  el: HTMLElement;
  /** popup ref */
  popupRef: Ref<HTMLElement | null>;
  /** 是否自动隐藏 */
  autoHide: boolean;
  /** hover 延时 (毫秒) */
  hoverDelay: number;
  /** outclick 单例 */
  outClick: ReturnType<typeof useOutClick>;
  /** 收集解绑函数的数组 */
  listeners: Array<() => void>;
  /** 显隐控制函数 */
  updateFn: (isVisible?: boolean, delay?: number) => void;
}

/** bindDomEvent 的可选项 */
interface BindDomEventOptions {
  /** 触发元素 */
  el: HTMLElement;
  /** 事件类型 */
  type: keyof HTMLElementEventMap;
  /** 事件处理器 */
  handler: (e: Event) => void;
  /** 解绑函数收集数组 */
  listeners: Array<() => void>;
}

/**
 * 绑定一个 DOM 事件并记录解绑函数
 * @param opts - 配置项 (el / type / handler / listeners)
 */
function bindDomEvent({ el, type, handler, listeners }: BindDomEventOptions): void {
  el.addEventListener(type, handler);
  listeners.push(() => el.removeEventListener(type, handler));
}

/**
 * 绑定 hover 触发器 (mouseenter/mouseleave)
 * @param ctx - 共享上下文
 */
function bindHoverTrigger(ctx: SingleTriggerCtx): void {
  const { el, autoHide, hoverDelay, listeners, updateFn } = ctx;
  bindDomEvent({ el, type: 'mouseenter', handler: () => updateFn(true, hoverDelay), listeners });
  if (autoHide) {
    bindDomEvent({ el, type: 'mouseleave', handler: () => updateFn(false, hoverDelay), listeners });
  }
}

/**
 * 绑定 focus 触发器 (focusin/focusout)
 * @param ctx - 共享上下文
 */
function bindFocusTrigger(ctx: SingleTriggerCtx): void {
  const { el, autoHide, listeners, updateFn } = ctx;
  bindDomEvent({ el, type: 'focusin', handler: () => updateFn(true), listeners });
  if (autoHide) {
    bindDomEvent({ el, type: 'focusout', handler: () => updateFn(false), listeners });
  }
}

/**
 * 绑定 contextmenu 触发器 (contextmenu + outclick 隐藏)
 * @param ctx - 共享上下文
 */
function bindContextmenuTrigger(ctx: SingleTriggerCtx): void {
  const { el, autoHide, outClick, popupRef, listeners, updateFn } = ctx;
  bindDomEvent({
    el,
    type: 'contextmenu',
    handler: (e) => {
      e.preventDefault();
      updateFn(true);
    },
    listeners,
  });
  if (autoHide) {
    const hideFn = () => updateFn(false);
    outClick.addListener(el, hideFn, {
      exception: (e: Event) => isInsidePopup(e, popupRef),
    });
    listeners.push(() => outClick.removeListener(el, hideFn));
  }
}

/**
 * 绑定 hover-outclick 触发器 (mouseenter + outclick 隐藏)
 * @param ctx - 共享上下文
 */
function bindHoverOutclickTrigger(ctx: SingleTriggerCtx): void {
  const { el, autoHide, hoverDelay, outClick, popupRef, listeners, updateFn } = ctx;
  bindDomEvent({ el, type: 'mouseenter', handler: () => updateFn(true, hoverDelay), listeners });
  if (autoHide) {
    const hideFn = () => updateFn(false);
    outClick.addListener(el, hideFn, {
      exception: (e: Event) => isInsidePopup(e, popupRef),
    });
    listeners.push(() => outClick.removeListener(el, hideFn));
  }
}

/**
 * 构建 click 触发器的共享上下文 (从 SingleTriggerCtx 提取 click 所需字段)
 * @param ctx - 单方向触发器共享上下文
 * @returns click 触发器共享上下文
 */
function toClickCtx(ctx: SingleTriggerCtx): ClickCtx {
  return {
    el: ctx.el,
    popupRef: ctx.popupRef,
    autoHide: ctx.autoHide,
    outClick: ctx.outClick,
    listeners: ctx.listeners,
    updateFn: ctx.updateFn,
  };
}

function noop(): void {
  // 无操作 trigger
}

/** trigger 类型 → 绑定处理函数的查表 (click / click-outclick 走单独路径, 此处省略) */
const triggerBinders: Partial<Record<PopupTriggerT, (ctx: SingleTriggerCtx) => void>> = {
  hover: bindHoverTrigger,
  focus: bindFocusTrigger,
  contextmenu: bindContextmenuTrigger,
  none: noop,
  'hover-outclick': bindHoverOutclickTrigger,
};

/**
 * trigger 类型 → click 变体的处理函数查表 (click / click-outclick)
 */
const clickToggleMap: Record<'click' | 'click-outclick', boolean> = {
  click: true,
  'click-outclick': false,
};

/** bindTrigger 的可选项 */
interface BindTriggerOptions {
  /** 触发元素, null 时不绑定 */
  el: HTMLElement | null;
  /** popup ref, 用于判断外部点击是否在 popup 内 */
  popupRef: Ref<HTMLElement | null>;
  /** 触发器类型列表 */
  triggers: PopupTriggerT[];
  /** 控制 popup 显隐, 可选 delay 用于 hover 延时 */
  updateFn: (isVisible?: boolean, delay?: number) => void;
  /** hover 触发延迟 (毫秒) */
  hoverDelay?: number;
  /** 是否在触发元素外点击或离开时自动隐藏 */
  autoHide?: boolean;
}

/**
 * 为触发元素绑定不同 trigger 类型对应的事件 (hover/click/focus/contextmenu 等)
 * @param opts - 配置项 (el / popupRef / triggers / updateFn / hoverDelay / autoHide)
 * @returns 解绑函数数组
 */
export function bindTrigger({ el, popupRef, triggers, updateFn, hoverDelay = 100, autoHide = true }: BindTriggerOptions): Array<() => void> {
  if (!el) {
    return [];
  }
  const outClick = useOutClick();
  const listeners: Array<() => void> = [];
  const ctx: SingleTriggerCtx = { el, popupRef, autoHide, hoverDelay, outClick, listeners, updateFn };
  const clickCtx = toClickCtx(ctx);
  triggers.forEach((tr) => {
    if (tr === 'click' || tr === 'click-outclick') {
      bindClickTrigger(clickCtx, clickToggleMap[tr]);
      return;
    }
    triggerBinders[tr]?.(ctx);
  });
  return listeners;
}

/**
 * 各 popup 位置对应的 transform-origin 映射表
 * - left: 从触发点水平展开的起始位置
 * - top: 从触发点垂直展开的起始位置
 */
const TRANSFORM_ORIGIN_MAP: Record<PopupPositionT, { left: string; top: string }> = {
  top: { left: '50%', top: '100%' },
  tl: { left: '0px', top: '100%' },
  tr: { left: '100%', top: '100%' },
  bottom: { left: '50%', top: '0px' },
  bl: { left: '0px', top: '0px' },
  br: { left: '100%', top: '0px' },
  left: { left: '100%', top: '50%' },
  lt: { left: '100%', top: '100%' },
  lb: { left: '100%', top: '100%' },
  right: { left: '0px', top: '50%' },
  rt: { left: '0px', top: '0px' },
  rb: { left: '0px', top: '100%' },
};

/**
 * 返回 popup 在指定 position 下的 transform-origin, 用于动画从触发点展开
 * @param position - popup 位置
 * @returns 水平/垂直方向上的 transform-origin 百分比
 */
export function getTransformOrigin(position: PopupPositionT) {
  return TRANSFORM_ORIGIN_MAP[position];
}
