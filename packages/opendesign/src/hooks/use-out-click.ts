import { isTouchDevice } from '../_utils/is';

// type mEvent =  isTouchDevice ? TouchEvent : MouseEvent;

interface handlerItemT {
  handler: () => void;
  exception?: (e: Event) => boolean;
}

const elList = new Map<HTMLElement, Array<handlerItemT>>();
let isBindEvent = false;

const Event = {
  start: isTouchDevice ? 'touchstart' : 'mousedown',
  end: isTouchDevice ? 'touchend' : 'mouseup',
};

function addListener(el: HTMLElement, fn: () => void, exception?: (e: Event) => boolean) {
  if (!elList.has(el)) {
    elList.set(el, []);
  }

  const handlers = elList.get(el);
  if (handlers) {
    handlers.push({
      handler: fn,
      exception: exception,
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

    window.addEventListener(Event.start, (e: Event) => {
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

      elList.forEach((handlers, el) => {
        if (!el.contains(e.target as HTMLElement)) {
          handlers.forEach((item) => {
            if (!item.exception || !item.exception(e)) {
              item.handler();
            }
          });
        }
      });
    });

    isBindEvent = true;
  }
}

export function useOutClick() {
  bindEvents();

  return {
    addListener,
    removeListener,
  };
}
