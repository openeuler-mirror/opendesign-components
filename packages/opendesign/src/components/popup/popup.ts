import { getRelativeBounding, getScroll, isRootEl } from '../_shared/dom';
import { PopupPosition } from './types';

enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}
function getDirection(position: PopupPosition): Direction {
  switch (position) {
    case PopupPosition.TL:
    case PopupPosition.TR:
    case PopupPosition.TOP:
      return Direction.TOP;
    case PopupPosition.BL:
    case PopupPosition.BR:
    case PopupPosition.BOTTOM:
      return Direction.BOTTOM;
    case PopupPosition.LT:
    case PopupPosition.LB:
    case PopupPosition.LEFT:
      return Direction.LEFT;
    case PopupPosition.RT:
    case PopupPosition.RB:
    case PopupPosition.RIGHT:
      return Direction.RIGHT;
  }
}

function fixPosition(position: PopupPosition, direction: Direction) {
  const fixFn = {
    [Direction.TOP]: (p: PopupPosition) => {
      if (p === PopupPosition.BOTTOM) {
        return PopupPosition.TOP;
      } else if (p === PopupPosition.BL) {
        return PopupPosition.TL;
      } else if (p === PopupPosition.BR) {
        return PopupPosition.TR;
      }
      return p;
    },
    [Direction.BOTTOM]: (p: PopupPosition) => {
      if (p === PopupPosition.TOP) {
        return PopupPosition.BOTTOM;
      } else if (p === PopupPosition.TL) {
        return PopupPosition.BL;
      } else if (p === PopupPosition.TR) {
        return PopupPosition.BR;
      }
      return p;
    },
    [Direction.LEFT]: (p: PopupPosition) => {
      if (p === PopupPosition.RIGHT) {
        return PopupPosition.LEFT;
      } else if (p === PopupPosition.RT) {
        return PopupPosition.LT;
      } else if (p === PopupPosition.RB) {
        return PopupPosition.LB;
      }
      return p;
    },
    [Direction.RIGHT]: (p: PopupPosition) => {
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

function getPopupOffset(targetEl: HTMLElement, position: PopupPosition, popupRect: DOMRect, containerRect: DOMRect) {
  const t = getRelativeBounding(targetEl, containerRect);
  const p = popupRect;
  switch (position) {
    case PopupPosition.LT: {
      return {
        top: t.offsetTop,
        left: t.offsetLeft - p.width,
      };
    }
    case PopupPosition.LB: {
      return {
        top: t.offsetTop + t.height - p.height,
        left: t.offsetLeft - p.width,
      };
    }
    case PopupPosition.LEFT: {
      return {
        top: t.offsetTop + Math.round(t.height / 2) - Math.round(p.height / 2),
        left: t.offsetLeft - p.width,
      };
    }
    case PopupPosition.RT: {
      return {
        top: t.offsetTop,
        left: t.offsetLeft + t.width,
      };
    }
    case PopupPosition.RB: {
      return {
        top: t.offsetTop + t.height - p.height,
        left: t.offsetLeft + t.width,
      };
    }
    case PopupPosition.RIGHT: {
      return {
        top: t.offsetTop + Math.round(t.height / 2) - Math.round(p.height / 2),
        left: t.offsetLeft + t.width,
      };
    }
    case PopupPosition.TL: {
      return {
        top: t.offsetTop - p.height,
        left: t.offsetLeft,
      };
    }
    case PopupPosition.TR: {
      return {
        top: t.offsetTop - p.height,
        left: t.offsetLeft + t.width - p.width,
      };
    }
    case PopupPosition.TOP: {
      return {
        top: t.offsetTop - p.height,
        left: t.offsetLeft + Math.round(t.width / 2) - Math.round(p.width / 2),
      };
    }
    case PopupPosition.BL: {
      return {
        top: t.offsetTop + t.height,
        left: t.offsetLeft,
      };
    }
    case PopupPosition.BR: {
      return {
        top: t.offsetTop + t.height,
        left: t.offsetLeft + t.width - p.width
      };
    }
    case PopupPosition.BOTTOM: {
      return {
        top: t.offsetTop + t.height,
        left: t.offsetLeft + Math.round(t.width / 2) - Math.round(p.width / 2),
      };
    }
    default: {
      return {
        top: 0,
        left: 0
      };
    }
  }
}


// 处理popup位置
export function calcPopupStyle(popupEl: HTMLElement, targetEl: HTMLElement, container: HTMLElement, position: PopupPosition,
  { adaptive = true }: { adaptive?: boolean } = {}) {

  const cRect = container.getBoundingClientRect();
  const pRect = popupEl.getBoundingClientRect();

  const { left, top } = getPopupOffset(targetEl, position, pRect, cRect);

  let fixedPosition = position;
  let style = {
    left,
    top
  };
  // 自适应容器边缘
  if (adaptive) {
    const edge = {
      left: 0,
      top: 0,
      right: Math.floor(cRect.width) - Math.ceil(pRect.width),
      bottom: Math.floor(cRect.height) - Math.ceil(pRect.height),
    };
    const d = getDirection(position);
    if (d === Direction.TOP && edge.top > top) {
      fixedPosition = fixPosition(position, Direction.BOTTOM);
      style = getPopupOffset(targetEl, fixedPosition, pRect, cRect);
    }
    if (d === Direction.LEFT && edge.left > left) {
      fixedPosition = fixPosition(position, Direction.RIGHT);
      style = getPopupOffset(targetEl, fixedPosition, pRect, cRect);
    }
    if (d === Direction.RIGHT && edge.right < left) {
      fixedPosition = fixPosition(position, Direction.LEFT);
      style = getPopupOffset(targetEl, fixedPosition, pRect, cRect);
    }
    if (d === Direction.BOTTOM && edge.bottom < top) {
      fixedPosition = fixPosition(position, Direction.TOP);
      style = getPopupOffset(targetEl, fixedPosition, pRect, cRect);
    }

    if ([Direction.TOP, Direction.BOTTOM].includes(d)) {
      if (edge.left > left) {
        style.left = 0;
      } else if (edge.right < left) {
        style.left = edge.right;
      }
    }
    if ([Direction.LEFT, Direction.RIGHT].includes(d)) {
      if (edge.top > top) {
        style.top = 0;
      } else if (edge.bottom < top) {
        style.top = edge.bottom;
      }
    }
  }

  // 需要加上滚动值，如果为body，则不需要
  if (!isRootEl(container)) {
    const cs = getScroll(container);
    style.left += cs.left;
    style.top += cs.top;
  }

  return {
    style,
    position: fixedPosition
  };
};