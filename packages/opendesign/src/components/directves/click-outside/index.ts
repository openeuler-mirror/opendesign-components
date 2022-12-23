import { ObjectDirective, DirectiveBinding } from 'vue';
interface handlerItemT {
  handler: () => void
}

const elList = new Map<HTMLElement, Array<handlerItemT>>();

window.addEventListener('mousedown', (e) => {
  elList.forEach((handlers, el) => {
    if (!el.contains(e.target as HTMLElement)) {

      handlers.forEach(item => {
        item.handler();
      });
    }
  });
});

function addListener(el: HTMLElement, fn: () => void) {
  if (!elList.has(el)) {
    elList.set(el, []);
  }

  const handlers = elList.get(el);
  if (handlers) {
    handlers.push({
      handler: fn
    });
  }
}

function removeListener(el: HTMLElement) {
  elList.delete(el);

}

const vOutClick: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    addListener(el, binding.value);
  },
  unmounted(el: HTMLElement) {
    removeListener(el);
  }
};

export function listenOutClick(el: HTMLElement, fn: () => void) {
  addListener(el, fn);
  return () => {
    removeListener(el);
  };
}


export {
  vOutClick
};