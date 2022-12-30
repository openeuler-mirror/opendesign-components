import { getElementBorder, getElementSize, getOffsetElement, getScroll } from '../_shared/dom';
import type { Direction } from '../_shared/dom';
import { PopupPosition, FullPosition, PopupTrigger } from './types';
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
function getPopupViewOffset(position: FullPosition, t: DOMRect, p: DOMRect): Pos {
  const formula: {
    [k in FullPosition]: { left: number, top: number }
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
function getDirection(position: PopupPosition): Direction {
  switch (position) {
    case PopupPosition.TL:
    case PopupPosition.TR:
    case PopupPosition.TOP:
      return 'top';
    case PopupPosition.BL:
    case PopupPosition.BR:
    case PopupPosition.BOTTOM:
      return 'bottom';
    case PopupPosition.LT:
    case PopupPosition.LB:
    case PopupPosition.LEFT:
      return 'left';
    case PopupPosition.RT:
    case PopupPosition.RB:
    case PopupPosition.RIGHT:
      return 'right';
  }
}

// 调整position
function adjustPosition(position: PopupPosition, direction: Direction) {
  const fixFn = {
    top: (p: PopupPosition) => {
      if (p === PopupPosition.BOTTOM) {
        return PopupPosition.TOP;
      } else if (p === PopupPosition.BL) {
        return PopupPosition.TL;
      } else if (p === PopupPosition.BR) {
        return PopupPosition.TR;
      }
      return p;
    },
    bottom: (p: PopupPosition) => {
      if (p === PopupPosition.TOP) {
        return PopupPosition.BOTTOM;
      } else if (p === PopupPosition.TL) {
        return PopupPosition.BL;
      } else if (p === PopupPosition.TR) {
        return PopupPosition.BR;
      }
      return p;
    },
    left: (p: PopupPosition) => {
      if (p === PopupPosition.RIGHT) {
        return PopupPosition.LEFT;
      } else if (p === PopupPosition.RT) {
        return PopupPosition.LT;
      } else if (p === PopupPosition.RB) {
        return PopupPosition.LB;
      }
      return p;
    },
    right: (p: PopupPosition) => {
      if (p === PopupPosition.LEFT) {
        return PopupPosition.RIGHT;
      } else if (p === PopupPosition.LT) {
        return PopupPosition.RT;
      } else if (p === PopupPosition.LB) {
        return PopupPosition.RB;
      }
      return p;
    }
  };

  const fn = fixFn[direction];
  return fn ? fn(position) : position;
}

// 根据popup的极值调整
function adjustOffset(position: PopupPosition, pPosition: Pos, pSize: ElementSize, pRect: DOMRect, tRect: DOMRect, wRect?: DomContentRect) {
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
export function calcPopupStyle(popupEl: HTMLElement, targetEl: HTMLElement, position: PopupPosition,
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
  triggers: PopupTrigger[],
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

  triggers.forEach((tr: PopupTrigger) => {
    if (tr === PopupTrigger.HOVER) {
      el?.addEventListener('mouseover', enterFn);
      el?.addEventListener('mouseleave', leavefn);
      const removeFn = () => {
        el?.removeEventListener('mouseover', enterFn);
        el?.removeEventListener('mouseleave', leavefn);
      };
      listeners.push(removeFn);
    } else if (tr === PopupTrigger.FOUCS) {
      el?.addEventListener('focusin', showFn);
      el?.addEventListener('focusout', hideFn);
      const removeFn = () => {
        el?.removeEventListener('focusin', showFn);
        el?.removeEventListener('focusout', hideFn);
      };
      listeners.push(removeFn);
    } else if (tr === PopupTrigger.CLICK) {
      el?.addEventListener('click', showFn);

      const removeFn = listenOutClick(el, hideFn);

      listeners.push(() => {
        el?.removeEventListener('click', showFn);
      });
      listeners.push(removeFn);
    } else if (tr === PopupTrigger.CONTEXT_MENU) {
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
    }
  });

  return listeners;
};