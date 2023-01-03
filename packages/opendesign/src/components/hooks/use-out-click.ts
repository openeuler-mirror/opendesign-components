interface handlerItemT {
  handler: () => void,
  exception?: (e: MouseEvent) => boolean
}

const elList = new Map<HTMLElement, Array<handlerItemT>>();

window.addEventListener('mousedown', (e) => {
  elList.forEach((handlers, el) => {
    if (!el.contains(e.target as HTMLElement)) {
      handlers.forEach(item => {
        if (!item.exception || !item.exception(e)) {
          item.handler();
        }
      });
    }
  });
});

function addListener(el: HTMLElement, fn: () => void, exception?: (e: MouseEvent) => boolean) {
  if (!elList.has(el)) {
    elList.set(el, []);
  }

  const handlers = elList.get(el);
  if (handlers) {
    handlers.push({
      handler: fn,
      exception: exception
    });
  }
}

function removeListener(el: HTMLElement, listener?: () => void) {
  if (listener) {
    const handlers = elList.get(el);
    if (!handlers) {
      return;
    }
    const idx = handlers.findIndex(item => item.handler === listener);
    if (idx > -1) {
      handlers.splice(idx, 1);
    }
  } else {
    elList.delete(el);
  }
}

export function useOutClick() {
  return {
    addListener,
    removeListener,
  };
}