import { h, render, ComponentPublicInstance } from 'vue';
import { isString } from '../_utils/is';
import { MessageParamsT } from './types';
import OMessageList from './OMessageList.vue';
import { resolveHtmlElement } from '../_utils/vue-utils';

const DEFAULT_OPTIONS: MessageParamsT = {
  status: 'info',
  position: 'top',
  duration: 3000,
};

const instanceMap = new Map();
const targetOffset = 8;

const normalizeOptions = (params: MessageParamsT) => {
  const options: MessageParamsT = !params || isString(params) ? { content: params } : params;

  const normalized = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return normalized;
};

const getMessageStyle = async (
  target?: string | ComponentPublicInstance | HTMLElement | null,
  position: 'top' | 'bottom' = 'top',
  align: 'center' | 'left' | 'right' = 'center'
) => {
  if (!target) {
    return;
  }
  const targetEl = await resolveHtmlElement(target);
  if (!targetEl) {
    return;
  }

  const rect = targetEl.getBoundingClientRect();

  let pos: 'top' | 'bottom' = 'bottom';
  let top = window.innerHeight - rect.top + targetOffset;
  let left = rect.left;
  let transform = 'translateX(-50%)';

  if (position === 'bottom') {
    pos = 'top';
    top = rect.top + rect.height + targetOffset;
  }

  if (align === 'right') {
    left = rect.left + rect.width;
    transform = 'translateX(-100%)';
  } else if (align === 'left') {
    left = rect.left;
    transform = 'translateX(0%)';
  } else {
    left = rect.left + rect.width / 2;
    transform = 'translateX(-50%)';
  }

  return {
    position: pos,
    '--message-list-offset': `${top}px`,
    left: `${left}px`,
    transform,
  };
};

export function useMessage(target: string | ComponentPublicInstance | HTMLElement | null) {
  const showMessage = async (params: MessageParamsT) => {
    const options: MessageParamsT = normalizeOptions(params);
    const { position, targetAlign } = options;

    const msgStyle = await getMessageStyle(target, position, targetAlign);

    let instance = instanceMap.get(target ?? position);
    if (!instance) {
      let wrap: HTMLDivElement | null = document.createElement('div');

      const vnode = h(OMessageList, {
        position: msgStyle?.position ?? position,
        onDestory: () => {
          if (wrap) {
            document.body.removeChild(wrap);
            wrap = null;
          }
          instanceMap.set(target ?? position, undefined);
        },
        style: msgStyle,
      });

      render(vnode, wrap);

      const vm = vnode.component!;
      vm.exposed?.add(options);

      instance = vm;

      instanceMap.set(target ?? position, instance);

      document.body.appendChild(wrap);
    } else {
      instance.exposed?.add(options);
    }
  };

  const info = (params: MessageParamsT) => {
    return showMessage({
      ...params,
      status: 'info',
    });
  };

  const success = (params: MessageParamsT) => {
    return showMessage({
      ...params,
      status: 'success',
    });
  };

  const warning = (params: MessageParamsT) => {
    return showMessage({
      ...params,
      status: 'warning',
    });
  };

  const danger = (params: MessageParamsT) => {
    return showMessage({
      ...params,
      status: 'danger',
    });
  };

  const loading = (params: MessageParamsT) => {
    return showMessage({
      ...params,
      status: 'loading',
    });
  };

  const show = (params: MessageParamsT) => {
    return showMessage({
      ...params,
    });
  };

  const closeAll = () => {
    for (const ins of instanceMap.values()) {
      ins?.exposed?.removeAll();
    }
  };

  const close = () => {
    if (target) {
      const instance = instanceMap.get(target);
      instance?.exposed?.remove();
    }
  };

  return {
    info,
    success,
    warning,
    danger,
    loading,
    show,
    close,
    closeAll,
  };
}
