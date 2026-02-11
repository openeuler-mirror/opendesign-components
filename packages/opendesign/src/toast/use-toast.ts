import { createVNode, render, nextTick, type ComponentInternalInstance, type ComponentPublicInstance, type Ref } from 'vue';
import { isString, isNumber } from '../_utils/is';
import { resolveHtmlElement } from '../_utils/vue-utils';
import OToastList from './OToastList.vue';
import { type ToastParamsT, Duration } from './types';

const DEFAULT_OPTIONS = {
  position: 'bottom',
} satisfies ToastParamsT;

const instanceMap = new Map<'top' | 'center' | 'bottom' | HTMLElement, ComponentInternalInstance>();

const normalizeOptions = (params: ToastParamsT | string) => {
  const options: ToastParamsT = !params || isString(params) ? { content: params } : params;

  const { long, duration } = options;
  const defaultDuration = long ? Duration.LONG : Duration.NORMAL;
  const rlt = isNumber(duration) && duration > 0 ? duration : defaultDuration;

  const normalized = {
    ...DEFAULT_OPTIONS,
    ...options,
    duration: rlt,
  };

  return normalized;
};

type ToastTarget = string | ComponentPublicInstance | HTMLElement | null | undefined;
type MaybeRef<T> = T | Ref<T>;

const getToastStyle = (
  targetEl: HTMLElement | null,
  position: 'top' | 'bottom' | 'center' = 'top',
  align: 'center' | 'left' | 'right' = 'left',
  offset: number = 8,
) => {
  if (!targetEl) {
    return;
  }

  const rect = targetEl.getBoundingClientRect();

  let pos: 'top' | 'bottom' = 'bottom';
  let top = window.innerHeight - rect.top + offset;
  let left = rect.left;
  let transform = 'translateX(-50%)';

  if (position === 'bottom') {
    pos = 'top';
    top = rect.top + rect.height + offset;
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

  if (position === 'center') {
    pos = 'top';
    left = rect.left + rect.width / 2;
    top = rect.top + rect.height / 2;
    transform = 'translate(-50%, -50%)';
  }

  return {
    position: pos,
    '--toast-list-offset': `${top}px`,
    [`--toast-list-${pos}-offset`]: `${top}px`,
    left: `${left}px`,
    transform,
  };
};

const createToastListVnode = ({
  position,
  wrap,
  style,
  targetEl,
}: {
  position: 'top' | 'bottom' | 'center';
  wrap: HTMLDivElement;
  style?: ReturnType<typeof getToastStyle>;
  targetEl: HTMLElement | null;
}) => {
  return createVNode(OToastList, {
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

const showToast = (target: MaybeRef<ToastTarget>, closeHandlers: Set<() => void>, params: ToastParamsT | string) => {
  const options = normalizeOptions(params);
  const { position, targetAlign, targetOffset } = options;

  let id = -1;
  let instance: ComponentInternalInstance | undefined;
  let isClosed = false;

  resolveHtmlElement(target).then((targetEl) => {
    if (isClosed) {
      // 在渲染之前关闭
      return;
    }
    const toastStyle = getToastStyle(targetEl, position, targetAlign, targetOffset);

    instance = instanceMap.get(targetEl ?? position);
    if (!instance) {
      const wrap = document.createElement('div');
      const vnode = createToastListVnode({
        position,
        wrap,
        style: toastStyle,
        targetEl,
      });

      // 挂载当前实例前 应当关闭所有其它实例的所有toast
      closeAll();

      render(vnode, wrap);

      const vm = vnode.component!;
      id = vm.exposed?.add(options);

      instance = vm;

      instanceMap.set(targetEl ?? position, instance);

      document.body.appendChild(wrap);
    } else {
      // 当前实例 后一个toast在前一个toast消失后出现
      instance.exposed?.remove(id);
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

const closeAll = () => {
  for (const ins of instanceMap.values()) {
    ins?.exposed?.removeAll();
  }
};

const close = (closeHandlers: Set<() => void>) => {
  closeHandlers.forEach((handler) => handler());
};

export function useToast(target?: MaybeRef<ToastTarget>) {
  const closeHandlers = new Set<() => void>();

  return {
    show: showToast.bind(null, target, closeHandlers),
    /** 关闭本 useToast 实例渲染的所有消息 */
    close: close.bind(null, closeHandlers),
    /** 关闭所有实例渲染的所有消息 */
    closeAll,
  };
}
