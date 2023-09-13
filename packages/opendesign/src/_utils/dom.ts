import { easeInOutCubic } from './easing';
import { throttleRAF } from './helper';
import { isArray, isWindow } from './is';
import { PositionT } from './types';

export type ScrollTarget = HTMLElement | Window | Document;

export function isDocument(val: unknown): val is Document {
  return val instanceof Document || val?.constructor.name === 'HTMLDocument';
}

export function isHtmlElement(el: any) {
  return typeof HTMLElement === 'object'
    ? el instanceof HTMLElement
    : !!(el && typeof el === 'object' && (el.nodeType === 1 || el.nodeType === 9) && typeof el.nodeName === 'string');
}

// 获取真实相对父元素  当body没有设置position时，返回html
export function getOffsetElement(el: HTMLElement) {
  let offsetEl = el.offsetParent;
  if (offsetEl && offsetEl.tagName === 'BODY') {
    const stylePosition = window.getComputedStyle(document.body).getPropertyValue('position');
    if (stylePosition === 'static') {
      return document.documentElement;
    }
  }
  return offsetEl;
}

// 获取元素scroll值
export function getScroll(el: ScrollTarget) {
  const rlt = {
    scrollLeft: 0,
    scrollTop: 0,
  };

  if (!el) {
    return rlt;
  }

  if (isWindow(el)) {
    rlt.scrollLeft = window.scrollX;
    rlt.scrollTop = window.scrollY;
  } else if (isDocument(el)) {
    rlt.scrollLeft = el.documentElement.scrollLeft;
    rlt.scrollTop = el.documentElement.scrollTop;
  } else {
    rlt.scrollLeft = el.scrollLeft;
    rlt.scrollTop = el.scrollTop;
  }

  return rlt;
}

// 获取元素的可滚动的父元素
export function getScrollParents(el: HTMLElement) {
  const parents: Array<HTMLElement> = [];
  let ele: HTMLElement | null = el;
  while (ele && ele !== document.documentElement) {
    const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = ele;
    if (offsetHeight < scrollHeight || offsetWidth < scrollWidth) {
      parents.push(ele);
    }
    ele = ele.parentElement;
  }
  return parents;
}

export function getRelativeBounding(e: DOMRect, c: DOMRect) {
  return {
    top: e.top,
    bottom: e.bottom,
    left: e.left,
    right: e.right,
    width: e.width,
    height: e.height,
    offsetLeft: e.left - c.left,
    offsetTop: e.top - c.top,
    offsetRight: e.right - c.left,
    offsetBottom: e.bottom - c.top,
  };
}

export type RelativeRect = ReturnType<typeof getRelativeBounding>;

export function getElementSize(el: HTMLElement | Window) {
  return {
    width: (el as Window).innerWidth || (el as HTMLElement).clientWidth,
    height: (el as Window).innerHeight || (el as HTMLElement).clientHeight,
    offsetWidth: (el as Window).innerWidth || (el as HTMLElement).offsetWidth,
    offsetHeight: (el as Window).innerHeight || (el as HTMLElement).offsetHeight,
  };
}

export function getElementBorder(el: HTMLElement, dir?: PositionT | PositionT[]) {
  const style = window.getComputedStyle(el);
  let d: PositionT[] = [];

  if (typeof dir === 'string') {
    d = [dir];
  } else {
    d = isArray(dir) ? dir : ['left', 'right', 'bottom', 'top'];
  }
  const rlt: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  } = {};
  d.forEach((k) => {
    rlt[k] = parseFloat(style.getPropertyValue(`border-${k}-width`));
  });
  return rlt;
}

export function getCssVariable(key: string, el?: HTMLElement) {
  const ele = el ? el : document.documentElement;
  return ele.style.getPropertyValue(key);
}

export function supportTouch() {
  return 'ontouchstart' in window;
}

export function mergeClass(...classList: Array<string | any[] | undefined>) {
  let rlt: any[] = [];

  classList.forEach((item) => {
    if (isArray(item)) {
      rlt = rlt.concat(item);
    } else {
      rlt.push(item);
    }
  });

  return rlt;
}

interface ScrollTopOptions {
  container?: ScrollTarget;
  duration?: number;
}

export function scrollTo(y: number, opts: ScrollTopOptions) {
  const { container = window, duration = 450 } = opts;
  const { scrollTop } = getScroll(container);
  const startTime = Date.now();

  return new Promise((resolve) => {
    const frameFn = () => {
      const timeStamp = Date.now();
      const time = timeStamp - startTime;
      const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);

      if (isWindow(container)) {
        window.scrollTo(window.scrollX, nextScrollTop);
      } else if (isDocument(container)) {
        container.documentElement.scrollTop = nextScrollTop;
      } else {
        container.scrollTop = nextScrollTop;
      }

      if (time < duration) {
        throttleRAF(frameFn)();
      } else {
        // TODO:正确处理ssr中滚动事件执行完毕时机
        setTimeout(() => {
          resolve(nextScrollTop);
        }, 800);

        // 滚动事件可能未执行完成，故下一帧执行resolve
        // throttleRAF(resolve)();
      }
    };

    throttleRAF(frameFn)();
  });
}
