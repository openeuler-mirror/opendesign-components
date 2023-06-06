import { Ref } from 'vue';
import { getElementBorder, getElementSize, getOffsetElement, getScroll } from '../_shared/dom';
import type { PositionT } from '../_shared/types';
import type { PopupPositionT, PopupTriggerT } from './types';

import { useOutClick } from '../hooks/use-out-click';

interface Pos {
  left: number;
  top: number;
}
interface DomContentRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface AnchorPosition {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

type ElementSize = ReturnType<typeof getElementSize>;

// 获取wrapper content box范围，因为绝对定位需要排除border
function getWrapperContentRect(wrapperEl: HTMLElement, wrapperRect?: DOMRect): DomContentRect {
  const { left = 0, top = 0, right = 0, bottom = 0 } = getElementBorder(wrapperEl);
  const rect = wrapperRect || wrapperEl.getBoundingClientRect();
  return {
    left: rect.left + left,
    top: rect.top + top,
    right: rect.right - right,
    bottom: rect.bottom - bottom,
  };
}

// 根据position计算popup的位置
function getPopupViewOffset(
  position: PopupPositionT,
  t: DOMRect,
  p: DOMRect,
  {
    offset = 0,
  }: {
    offset?: number;
  } = {}
): Pos {
  const formula: {
    [k in PopupPositionT]: { left: number; top: number };
  } = {
    top: {
      left: t.left + t.width / 2 - p.width / 2,
      top: t.top - p.height - offset,
    },
    tl: {
      left: t.left,
      top: t.top - p.height - offset,
    },
    tr: {
      left: t.right - p.width,
      top: t.top - p.height - offset,
    },
    bottom: {
      left: t.left + t.width / 2 - p.width / 2,
      top: t.bottom + offset,
    },
    bl: {
      left: t.left,
      top: t.bottom + offset,
    },
    br: {
      left: t.right - p.width,
      top: t.bottom + offset,
    },
    left: {
      left: t.left - p.width - offset,
      top: t.top + t.height / 2 - p.height / 2,
    },
    lt: {
      left: t.left - p.width - offset,
      top: t.top,
    },
    lb: {
      left: t.left - p.width - offset,
      top: t.bottom - p.height,
    },
    right: {
      left: t.right + offset,
      top: t.top + t.height / 2 - p.height / 2,
    },
    rt: {
      left: t.right + offset,
      top: t.top,
    },
    rb: {
      left: t.right + offset,
      top: t.bottom - p.height,
    },
  };
  return formula[position] || { left: 0, top: 0 };
}

// 根据视窗与相对容器，返回popup的位置范围
function getWrapperViewEdge(popupSize: ElementSize, wrapperRect?: DomContentRect) {
  const viewport = {
    left: 0,
    right: window.innerWidth - popupSize.width,
    top: 0,
    bottom: window.innerHeight - popupSize.height,
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

// 根据触发元素，返回popup的位置范围
function getPopupEdge(popupSize: ElementSize, targetRect: DOMRect, anchorOffset: number = 0) {
  const { left, right, top, bottom } = targetRect;
  const { width, height } = popupSize;
  return {
    left: left - width + anchorOffset,
    top: top - height + anchorOffset,
    right: right - anchorOffset,
    bottom: bottom - anchorOffset,
  };
}

// 计算相对于wrapper的位置信息
function getPopupWrapOffset(pos: Pos, wrapperEl: HTMLElement | null, wrapperContentRect?: DomContentRect) {
  if (!wrapperEl) {
    return pos;
  }
  const cs = getScroll(wrapperEl);
  if (wrapperContentRect) {
    return {
      left: pos.left + cs.scrollLeft - wrapperContentRect.left,
      top: pos.top + cs.scrollTop - wrapperContentRect.top,
    };
  }
  return {
    left: pos.left + cs.scrollLeft,
    top: pos.top + cs.scrollTop,
  };
}

// 根据position获取方向
function getDirection(position: PopupPositionT): PositionT {
  switch (position) {
    case 'tl':
    case 'tr':
    case 'top':
      return 'top';
    case 'bl':
    case 'br':
    case 'bottom':
      return 'bottom';
    case 'lt':
    case 'lb':
    case 'left':
      return 'left';
    case 'rt':
    case 'rb':
    case 'right':
      return 'right';
  }
}

// 调整position
function adjustPosition(position: PopupPositionT, direction: PositionT) {
  const fixFn = {
    top: (p: PopupPositionT) => {
      if (p === 'bottom') {
        return 'top';
      } else if (p === 'bl') {
        return 'tl';
      } else if (p === 'br') {
        return 'tr';
      }
      return p;
    },
    bottom: (p: PopupPositionT) => {
      if (p === 'top') {
        return 'bottom';
      } else if (p === 'tl') {
        return 'bl';
      } else if (p === 'tr') {
        return 'br';
      }
      return p;
    },
    left: (p: PopupPositionT) => {
      if (p === 'right') {
        return 'left';
      } else if (p === 'rt') {
        return 'lt';
      } else if (p === 'rb') {
        return 'lb';
      }
      return p;
    },
    right: (p: PopupPositionT) => {
      if (p === 'left') {
        return 'right';
      } else if (p === 'lt') {
        return 'rt';
      } else if (p === 'lb') {
        return 'rb';
      }
      return p;
    },
  };

  const fn = fixFn[direction];
  return fn ? fn(position) : position;
}

// 根据popup的极值调整
function adjustOffset(
  position: PopupPositionT,
  popupPosition: Pos,
  popupSize: ElementSize,
  pRect: DOMRect,
  tRect: DOMRect,
  wRect?: DomContentRect,
  {
    anchorOffset,
    offset,
  }: {
    anchorOffset?: number;
    offset?: number;
  } = {}
) {
  const { top, left } = popupPosition;
  const edge = getWrapperViewEdge(popupSize, wRect);

  let fixedPosition = position;
  let style = popupPosition;

  const d = getDirection(position);
  if (d === 'top') {
    if (edge.top > top) {
      fixedPosition = adjustPosition(position, 'bottom');
      style = getPopupViewOffset(fixedPosition, tRect, pRect, { offset });
    }
  } else if (d === 'left') {
    if (edge.left > left) {
      fixedPosition = adjustPosition(position, 'right');
      style = getPopupViewOffset(fixedPosition, tRect, pRect, { offset });
    }
  } else if (d === 'right') {
    if (edge.right < left) {
      fixedPosition = adjustPosition(position, 'left');
      style = getPopupViewOffset(fixedPosition, tRect, pRect, { offset });
    }
  } else if (d === 'bottom') {
    if (edge.bottom < top) {
      fixedPosition = adjustPosition(position, 'top');
      style = getPopupViewOffset(fixedPosition, tRect, pRect, { offset });
    }
  }

  const popEdge = getPopupEdge(popupSize, tRect, anchorOffset);

  if (['top', 'bottom'].includes(d)) {
    if (edge.left > left) {
      style.left = edge.left < popEdge.right ? edge.left : popEdge.right;
    } else if (edge.right < left) {
      style.left = edge.right > popEdge.left ? edge.right : popEdge.left;
    }
  }
  if (['left', 'right'].includes(d)) {
    if (edge.top > top) {
      style.top = edge.top < popEdge.bottom ? edge.top : popEdge.bottom;
    } else if (edge.bottom < top) {
      style.top = edge.bottom > popEdge.top ? edge.bottom : popEdge.top;
    }
  }

  return {
    position: fixedPosition,
    popupStyle: style,
  };
}

function getAnchorOffset(position: PopupPositionT, tRect: DOMRect, popupStyle: Pos, popupSize: ElementSize): AnchorPosition {
  const pos: AnchorPosition = {};
  const limit = 8;

  const { left: pl, top: pt } = popupStyle;
  if (['top', 'tl', 'tr', 'bottom', 'bl', 'br'].includes(position)) {
    let l = tRect.left + tRect.width / 2 - pl;

    if (l > popupSize.width - limit) {
      l = popupSize.width - limit;
    } else if (l < limit) {
      l = limit;
    }

    pos.left = l;

    if (['top', 'tl', 'tr'].includes(position)) {
      pos.bottom = 0;
    } else {
      pos.top = 0;
    }
  } else if (['left', 'lt', 'lb', 'right', 'rt', 'rb'].includes(position)) {
    let t = tRect.top + tRect.height / 2 - pt;

    if (t > popupSize.height - limit) {
      t = popupSize.height - limit;
    } else if (t < limit) {
      t = limit;
    }

    pos.top = t;

    if (['left', 'lt', 'lb'].includes(position)) {
      pos.right = 0;
    } else {
      pos.left = 0;
    }
  }

  return pos;
}

// 处理popup位置
export function calcPopupStyle(
  popupEl: HTMLElement,
  targetEl: HTMLElement,
  position: PopupPositionT,
  {
    adaptive = true,
    anchorOffset = 8,
    offset = 8,
  }: {
    adaptive?: boolean;
    anchorOffset?: number;
    offset?: number;
  } = {}
) {
  const tRect = targetEl.getBoundingClientRect();

  const pRect = popupEl.getBoundingClientRect();
  const popupSize = getElementSize(popupEl);

  // 根据position计算popup相对视窗的位置
  let popupStyle = getPopupViewOffset(position, tRect, pRect, { offset: offset });
  let anchorStyle: AnchorPosition = {};

  const wrapperEl = getOffsetElement(popupEl) as HTMLElement;
  if (!wrapperEl) {
    return {
      popupStyle,
      position,
      anchorStyle,
    };
  }
  const wrapperRect = wrapperEl.getBoundingClientRect();
  let wrapperContentRect = undefined;

  // wrapper为body时，如果body有偏移，但position值为static，不需要计算wrapper的content rect。
  if (wrapperEl.nodeName !== 'HTML') {
    wrapperContentRect = getWrapperContentRect(wrapperEl, wrapperRect);
  }

  let fixedPosition = position;
  // 自适应容器边缘
  if (adaptive) {
    const rlt = adjustOffset(position, popupStyle, popupSize, pRect, tRect, wrapperContentRect, { offset: offset, anchorOffset });
    fixedPosition = rlt.position;
    popupStyle = rlt.popupStyle;
  }
  // 获取锚点相对popup的位置
  anchorStyle = getAnchorOffset(fixedPosition, tRect, popupStyle, popupSize);
  // 计算相对容器的位置
  popupStyle = getPopupWrapOffset(popupStyle, wrapperEl, wrapperContentRect);

  return {
    position: fixedPosition,
    popupStyle,
    anchorStyle,
  };
}

// 监听元素的触发事件
// eslint-disable-next-line max-lines-per-function
export function bindTrigger(
  el: HTMLElement | null,
  popupRef: Ref<HTMLElement | null>,
  triggers: PopupTriggerT[],
  {
    updateFn,
    hoverDelay = 100,
    autoHide = true,
  }: {
    updateFn: (isVisible?: boolean, delay?: number) => void;
    hoverDelay?: number;
    autoHide?: boolean;
  }
) {
  if (!el) {
    return [];
  }
  const outClick = useOutClick();

  const listeners: Array<() => void> = [];

  const showFn = () => {
    updateFn(true);
  };
  const hideFn = () => {
    updateFn(false);
  };
  const toggleFn = () => {
    updateFn();
  };

  const enterFn = () => {
    updateFn(true, hoverDelay);
  };
  const leavefn = () => {
    updateFn(false, hoverDelay);
  };

  const triggerHandlers: Record<PopupTriggerT, () => void> = {
    hover: () => {
      el?.addEventListener('mouseover', enterFn);
      listeners.push(() => {
        el?.removeEventListener('mouseover', enterFn);
      });

      if (autoHide) {
        el?.addEventListener('mouseleave', leavefn);
        listeners.push(() => {
          el?.removeEventListener('mouseleave', leavefn);
        });
      }
    },
    click: () => {
      el?.addEventListener('click', (e) => {
        console.log(e.target);

        toggleFn();
      });

      listeners.push(() => {
        el?.removeEventListener('click', toggleFn);
      });

      if (autoHide) {
        outClick.addListener(el, hideFn, (e: MouseEvent) => {
          return !!popupRef.value?.contains(e.target as HTMLElement);
        });

        listeners.push(() => {
          outClick.removeListener(el, hideFn);
        });
      }
    },
    focus: () => {
      el?.addEventListener('focusin', showFn);
      listeners.push(() => {
        el?.removeEventListener('focusin', showFn);
      });

      if (autoHide) {
        el?.addEventListener('focusout', hideFn);
        listeners.push(() => {
          el?.removeEventListener('focusout', hideFn);
        });
      }
    },
    contextmenu: () => {
      const fn = (e: Event) => {
        e.preventDefault();
        showFn();
      };
      el?.addEventListener('contextmenu', fn);

      listeners.push(() => {
        el?.removeEventListener('contextmenu', fn);
      });

      if (autoHide) {
        outClick.addListener(el, hideFn, (e: MouseEvent) => {
          return !!popupRef.value?.contains(e.target as HTMLElement);
        });
        listeners.push(() => {
          outClick.removeListener(el, hideFn);
        });
      }
    },
    none: () => {},
    // hover 显示 outclick隐藏
    'hover-outclick': () => {
      el?.addEventListener('mouseover', enterFn);

      listeners.push(() => {
        el?.removeEventListener('mouseover', enterFn);
      });

      if (autoHide) {
        outClick.addListener(el, hideFn, (e: MouseEvent) => {
          return !!popupRef.value?.contains(e.target as HTMLElement);
        });
        listeners.push(() => {
          outClick.removeListener(el, hideFn);
        });
      }
    },
  };

  triggers.forEach((tr: PopupTriggerT) => {
    triggerHandlers[tr]();
  });

  return listeners;
}

export function getTransformOrigin(position: PopupPositionT) {
  let left = '0px';
  let top = '0px';
  if (['lt', 'lb', 'left', 'tr', 'br'].includes(position)) {
    left = '100%';
  } else if (['top', 'bottom'].includes(position)) {
    left = '50%';
  }

  if (['tl', 'tr', 'top', 'lb', 'rb'].includes(position)) {
    top = '100%';
  } else if (['left', 'right'].includes(position)) {
    top = '50%';
  }

  return {
    top,
    left,
  };
}
