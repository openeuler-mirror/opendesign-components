import { h, render, nextTick, type Ref, ComponentInternalInstance, ComponentPublicInstance } from 'vue';
import { isString } from '../_utils/is';
import { MessageParamsT } from './types';
import OMessageList from './OMessageList.vue';
import { resolveHtmlElement } from '../_utils/vue-utils';

const DEFAULT_OPTIONS = {
  status: 'info',
  position: 'top',
  duration: 3000,
} satisfies MessageParamsT;

const instanceMap = new Map<'top' | 'bottom' | HTMLElement, ComponentInternalInstance>();
const targetOffset = 8;

const normalizeOptions = (params: MessageParamsT | string) => {
  const options: MessageParamsT = !params || isString(params) ? { content: params } : params;

  const normalized = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return normalized;
};

type MessageTarget = string | ComponentPublicInstance | HTMLElement | null | undefined;
type MaybeRef<T> = T | Ref<T>;

const getMessageStyle = (targetEl: HTMLElement | null, position: 'top' | 'bottom' = 'top', align: 'center' | 'left' | 'right' = 'center') => {
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
    [`--message-list-${pos}-offset`]: `${top}px`,
    left: `${left}px`,
    transform,
  };
};

const createMessageListVnode = ({
  position,
  wrap,
  style,
  targetEl,
}: {
  position: 'top' | 'bottom';
  wrap: HTMLDivElement;
  style?: ReturnType<typeof getMessageStyle>;
  targetEl: HTMLElement | null;
}) => {
  return h(OMessageList, {
    position: style?.position ?? position,
    onDestroy: async () => {
      if (wrap) {
        // 卸载组件，使组件树所有的 onMounted 等hook正常执行
        render(null, wrap);
        await nextTick();
        document.body.removeChild(wrap);
      }
      instanceMap.delete(targetEl ?? position);
    },
    style,
  });
};
const showMessage = (target: MaybeRef<MessageTarget>, params: MessageParamsT | string) => {
  const options = normalizeOptions(params);
  const { position, targetAlign } = options;

  let id = -1;
  let instance: ComponentInternalInstance | undefined = undefined;
  let isClosed = false;
  resolveHtmlElement(target).then((targetEl) => {
    if (isClosed) {
      // 在渲染之前关闭
      return;
    }
    const msgStyle = getMessageStyle(targetEl, position, targetAlign);

    instance = instanceMap.get(targetEl ?? position);
    if (!instance) {
      const wrap = document.createElement('div');

      const vnode = createMessageListVnode({
        position,
        wrap,
        style: msgStyle,
        targetEl,
      });

      render(vnode, wrap);

      const vm = vnode.component!;
      id = vm.exposed?.add(options);

      instance = vm;

      instanceMap.set(targetEl ?? position, instance);

      document.body.appendChild(wrap);
    } else {
      id = instance.exposed?.add(options);
    }
  });
  return () => {
    isClosed = true;
    instance?.exposed?.close(id);
  };
};
const showMessageWithStatus = (status: MessageParamsT['status'], target: MaybeRef<MessageTarget>, params: Omit<MessageParamsT, 'status'> | string) => {
  return showMessage(target, { ...normalizeOptions(params), status });
};
const closeAll = () => {
  for (const ins of instanceMap.values()) {
    ins?.exposed?.removeAll();
  }
};
/** 之前实现的 close 函数有 bug，因此废弃  */
const close = async (target: MaybeRef<MessageTarget>) => {
  const targetEl = await resolveHtmlElement(target);
  if (targetEl) {
    const instance = instanceMap.get(targetEl);
    // 此处 remove 需要 idx 参数，Array.prototype.splice(undefined, 1) 转化为 Array.prototype.splice(0, 1)
    instance?.exposed?.remove();
  }
};

export function useMessage(target?: MaybeRef<MessageTarget>) {
  return {
    show: showMessage.bind(null, target),
    info: showMessageWithStatus.bind(null, 'info', target),
    success: showMessageWithStatus.bind(null, 'success', target),
    warning: showMessageWithStatus.bind(null, 'warning', target),
    danger: showMessageWithStatus.bind(null, 'danger', target),
    loading: showMessageWithStatus.bind(null, 'loading', target),
    /** @deprecated 请使用 info, success, ... 返回的函数关闭 message */
    close: close.bind(null, target),
    closeAll,
  };
}
