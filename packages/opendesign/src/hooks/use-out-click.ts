import { isTouchDevice } from '../_utils/is';

// type mEvent =  isTouchDevice ? TouchEvent : MouseEvent;

interface handlerItemT {
  handler: () => void;
  exception?: (e: Event) => boolean;
}

const elList = new Map<HTMLElement, Array<handlerItemT>>();
const elListFast = new Map<HTMLElement, Array<handlerItemT>>();
let isBindEvent = false;

const Event = {
  start: isTouchDevice ? 'touchstart' : 'mousedown',
  end: isTouchDevice ? 'touchend' : 'mouseup',
};

function addListener(
  el: HTMLElement,
  fn: () => void,
  params?: {
    fast?: boolean;
    exception?: (e: Event) => boolean;
  }
) {
  const list = params?.fast ? elListFast : elList;

  if (!list.has(el)) {
    list.set(el, []);
  }

  const handlers = list.get(el);
  if (handlers) {
    handlers.push({
      handler: fn,
      exception: params?.exception,
    });
  }
}

function removeListener(el: HTMLElement, listener?: () => void) {
  if (listener) {
    const handlers = elList.get(el);
    if (!handlers) {
      return;
    }
    const idx = handlers.findIndex((item) => item.handler === listener);
    if (idx > -1) {
      handlers.splice(idx, 1);
    }
  } else {
    elList.delete(el);
  }
}

function bindEvents() {
  if (!isBindEvent) {
    let isOutSide = false;

    const runHandlers = (list: typeof elList, e: Event) => {
      list.forEach((handlers, el) => {
        if (!el.contains(e.target as HTMLElement)) {
          handlers.forEach((item) => {
            if (!item.exception || !item.exception(e)) {
              item.handler();
              console.log('out click');
            }
          });
        }
      });
    };

    window.addEventListener(Event.start, (e: Event) => {
      // 处理fast
      runHandlers(elListFast, e);

      const keys = Array.from(elList.keys());
      isOutSide = false;
      keys.some((el) => {
        if (!el.contains(e.target as HTMLElement)) {
          const handlers = elList.get(el);
          if (!handlers) {
            isOutSide = true;
          } else {
            isOutSide = handlers.some((item) => {
              return !item.exception || !item.exception(e);
            });
          }
        }
        return isOutSide;
      });
    });

    window.addEventListener(Event.end, (e) => {
      // 如果不在元素外按下，直接返回
      if (!isOutSide) {
        return;
      }

      runHandlers(elList, e);
    });

    isBindEvent = true;
  }
}

/**
 * 外部点击
 * @param fast 是否在mousedown、touchstart时就触发事件，主要用于在blur事件之前处理回调
 */
export function useOutClick() {
  bindEvents();

  return {
    addListener,
    removeListener,
  };
}
