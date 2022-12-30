import { getElementBorder, getElementSize, getOffsetElement, getScroll } from '../_shared/dom';
import type { DirectionT } from '../_shared/dom';
import type { PopupPositionT, PopupTriggerT } from './types';
import { listenOutClick } from '../directves';

interface Pos {
  left: number,
  top: number
}
interface DomContentRect {
  left: number,
  right: number,
  top: number,
  bottom: number,
}

type ElementSize = ReturnType<typeof getElementSize>

// 获取wrapper content box范围，因为绝对定位需要排除border
function getWrapperContentRect(wrapperEl: HTMLElement, wrapperRect?: DOMRect): DomContentRect {
  const { left = 0, top = 0, right = 0, bottom = 0 } = getElementBorder(wrapperEl);
  const rect = wrapperRect || wrapperEl.getBoundingClientRect();
  return {
    left: rect.left + left,
    top: rect.top + top,
    right: rect.right - right,
    bottom: rect.bottom - bottom
  };
}

// 根据position计算popup的位置
function getPopupViewOffset(position: PopupPositionT, t: DOMRect, p: DOMRect): Pos {
  const formula: {
    [k in PopupPositionT]: { left: number, top: number }
  } = {
    top: {
      left: t.left + t.width / 2 - p.width / 2,
      top: t.top - p.height
    },
    tl: {
      left: t.left,
      top: t.top - p.height
    },
    tr: {
      left: t.right - p.width,
      top: t.top - p.height
    },
    bottom: {
      left: t.left + t.width / 2 - p.width / 2,
      top: t.bottom
    },
    bl: {
      left: t.left,
      top: t.bottom
    },
    br: {
      left: t.right - p.width,
      top: t.bottom
    },
    left: {
      left: t.left - p.width,
      top: t.top + t.height / 2 - p.height / 2
    },
    lt: {
      left: t.left - p.width,
      top: t.top
    },
    lb: {
      left: t.left - p.width,
      top: t.bottom - p.height
    },
    right: {
      left: t.right,
      top: t.top + t.height / 2 - p.height / 2
    },
    rt: {
      left: t.right,
      top: t.top
    },
    rb: {
      left: t.right,
      top: t.bottom - p.height

    }
  };
  return formula[position] || { left: 0, top: 0 };
}

// 根据视窗与相对容器，返回popup的位置范围
function getWrapperViewEdge(pSize: ElementSize, wrapperRect?: DomContentRect) {
  const viewport = {
    left: 0,
    right: window.innerWidth - pSize.width,
    top: 0,
    bottom: window.innerHeight - pSize.height
  };

  if (!wrapperRect) {
    return viewport;
  }
  return {
    left: Math.max(viewport.left, wrapperRect.left),
    top: Math.max(viewport.top, wrapperRect.top),
    right: Math.min(viewport.right, wrapperRect.right - pSize.width),
    bottom: Math.min(viewport.bottom, wrapperRect.bottom - pSize.height),
  };
}

// 根据视窗与相对容器，返回popup的位置范围
function getPopupEdge(pSize: ElementSize, targetRect: DOMRect) {
  const { left, right, top, bottom } = targetRect;
  const { width, height } = pSize;
  return {
    left: left - width,
    top: top - height,
    right: right + width,
    bottom: bottom + height
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
      top: pos.top + cs.scrollTop - wrapperContentRect.top
    };
  }
  return {
    left: pos.left + cs.scrollLeft,
    top: pos.top + cs.scrollTop
  };
}

// 根据position获取方向
function getDirection(position: PopupPositionT): DirectionT {
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
function adjustPosition(position: PopupPositionT, direction: DirectionT) {
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
    }
  };

  const fn = fixFn[direction];
  return fn ? fn(position) : position;
}

// 根据popup的极值调整
function adjustOffset(position: PopupPositionT, pPosition: Pos, pSize: ElementSize, pRect: DOMRect, tRect: DOMRect, wRect?: DomContentRect) {
  const { top, left } = pPosition;
  const edge = getWrapperViewEdge(pSize, wRect);

  let fixedPosition = position;
  let style = pPosition;

  const d = getDirection(position);
  if (d === 'top') {
    if (edge.top > top) {
      fixedPosition = adjustPosition(position, 'bottom');
      style = getPopupViewOffset(fixedPosition, tRect, pRect);
    }
  } else if (d === 'left') {
    if (edge.left > left) {
      fixedPosition = adjustPosition(position, 'right');
      style = getPopupViewOffset(fixedPosition, tRect, pRect);
    }
  } else if (d === 'right') {
    if (edge.right < left) {
      fixedPosition = adjustPosition(position, 'left');
      style = getPopupViewOffset(fixedPosition, tRect, pRect);
    }
  } else if (d === 'bottom') {
    if (edge.bottom < top) {
      fixedPosition = adjustPosition(position, 'top');
      style = getPopupViewOffset(fixedPosition, tRect, pRect);
    }
  }

  const popEdge = getPopupEdge(pSize, tRect);

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
    style,
  };
}

// 处理popup位置
export function calcPopupStyle(popupEl: HTMLElement, targetEl: HTMLElement, position: PopupPositionT,
  { adaptive = true }: { adaptive?: boolean } = {}) {

  const tRect = targetEl.getBoundingClientRect();

  const pRect = popupEl.getBoundingClientRect();
  const pSize = getElementSize(popupEl);

  // 根据position计算popup相对视窗的位置
  let style = getPopupViewOffset(position, tRect, pRect);

  const wrapperEl = getOffsetElement(popupEl) as HTMLElement;
  if (!wrapperEl) {
    return {
      isOutside: true
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
    const rlt = adjustOffset(position, style, pSize, pRect, tRect, wrapperContentRect);
    fixedPosition = rlt.position;
    style = rlt.style;
  }

  style = getPopupWrapOffset(style, wrapperEl, wrapperContentRect);

  return {
    style,
    position: fixedPosition,
  };
};

// 监听元素的触发事件
export function bindTrigger(
  el: HTMLElement | null,
  triggers: PopupTriggerT[],
  {
    updateFn,
    hoverDelay = 100
  }: {
    updateFn: (isVisible: boolean, delay?: number) => void,
    hoverDelay?: number
  }
) {
  if (!el) {
    return [];
  }

  const listeners: Array<() => void> = [];

  const showFn = () => {
    updateFn(true);
  };
  const hideFn = () => {
    updateFn(false);
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
      el?.addEventListener('mouseleave', leavefn);
      const removeFn = () => {
        el?.removeEventListener('mouseover', enterFn);
        el?.removeEventListener('mouseleave', leavefn);
      };
      listeners.push(removeFn);
    },
    click: () => {
      el?.addEventListener('click', showFn);

      const removeFn = listenOutClick(el, hideFn);

      listeners.push(() => {
        el?.removeEventListener('click', showFn);
      });
      listeners.push(removeFn);
    },
    focus: () => {
      el?.addEventListener('focusin', showFn);
      el?.addEventListener('focusout', hideFn);
      const removeFn = () => {
        el?.removeEventListener('focusin', showFn);
        el?.removeEventListener('focusout', hideFn);
      };
      listeners.push(removeFn);
    },
    contextmenu: () => {
      const fn = (e: Event) => {
        e.preventDefault();
        showFn();
      };
      el?.addEventListener('contextmenu', fn);

      const removeFn = listenOutClick(el, hideFn);

      listeners.push(() => {
        el?.removeEventListener('contextmenu', fn);
      });
      listeners.push(removeFn);
    },
    none: () => { }
  };

  triggers.forEach((tr: PopupTriggerT) => {
    triggerHandlers[tr]();
  });

  return listeners;
};