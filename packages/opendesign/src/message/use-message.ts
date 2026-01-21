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
        // 卸载组件，使组件树所有的 onUnMounted 等hook正常执行
        render(null, wrap);
        await nextTick();
        document.body.removeChild(wrap);
      }
      instanceMap.delete(targetEl ?? position);
    },
    style,
  });
};
/**
 * 显示一个消息
 * @returns 关闭本条消息的方法
 */
const showMessage = (target: MaybeRef<MessageTarget>, closeHandlers: Set<() => void>, params: MessageParamsT | string) => {
  const options = normalizeOptions(params);
  const { position, targetAlign } = options;

  let id = -1;
  let instance: ComponentInternalInstance | undefined;
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
  const closeHandler = () => {
    isClosed = true;
    instance?.exposed?.close(id);
    closeHandlers.delete(closeHandler);
  };
  closeHandlers.add(closeHandler);
  return closeHandler;
};
const showMessageWithStatus = (
  status: MessageParamsT['status'],
  target: MaybeRef<MessageTarget>,
  closeHandlers: Set<() => void>,
  params: Omit<MessageParamsT, 'status'> | string
) => {
  return showMessage(target, closeHandlers, { ...normalizeOptions(params), status });
};
const closeAll = () => {
  for (const ins of instanceMap.values()) {
    ins?.exposed?.removeAll();
  }
};

const close = (closeHandlers: Set<() => void>) => {
  closeHandlers.forEach((handler) => handler());
};

export function useMessage(target?: MaybeRef<MessageTarget>) {
  const closeHandlers = new Set<() => void>();
  return {
    show: showMessage.bind(null, target, closeHandlers),
    info: showMessageWithStatus.bind(null, 'info', target, closeHandlers),
    success: showMessageWithStatus.bind(null, 'success', target, closeHandlers),
    warning: showMessageWithStatus.bind(null, 'warning', target, closeHandlers),
    danger: showMessageWithStatus.bind(null, 'danger', target, closeHandlers),
    loading: showMessageWithStatus.bind(null, 'loading', target, closeHandlers),
    /** 关闭本 useMessage 实例渲染的所有消息 */
    close: close.bind(null, closeHandlers),
    /** 关闭所有实例渲染的所有消息 */
    closeAll,
  };
}
