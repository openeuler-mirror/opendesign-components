import { createVNode, render } from 'vue';
import { isString } from '../_utils/is';
import { MessageParamsT } from './types';
import OMessageList from './OMessageList.vue';

const DEFAULT_OPTIONS: MessageParamsT = {
  status: 'info',
  position: 'top',
  duration: 3000,
};

const instanceMap = new Map();

const normalizeOptions = (params: MessageParamsT) => {
  const options: MessageParamsT = !params || isString(params) ? { content: params } : params;

  const normalized = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return normalized;
};

const showMessage = (params: MessageParamsT) => {
  const { position } = params;

  let instance = instanceMap.get(position);
  if (!instance) {
    let wrap: HTMLDivElement | null = document.createElement('div');

    const vnode = createVNode(OMessageList, {
      position: params.position,
      onDestory: () => {
        if (wrap) {
          document.body.removeChild(wrap);
          wrap = null;
        }
        instanceMap.set(position, undefined);
      },
    });

    render(vnode, wrap);

    const vm = vnode.component!;
    vm.exposed?.add(params);

    instance = vm;

    instanceMap.set(position, instance);

    document.body.appendChild(wrap);
  } else {
    instance.exposed?.add(params);
  }
};

const info = (params: MessageParamsT): void => {
  const options: MessageParamsT = normalizeOptions(params);
  return showMessage({
    ...options,
    status: 'info',
  });
};

const success = (params: MessageParamsT): void => {
  const options: MessageParamsT = normalizeOptions(params);
  return showMessage({
    ...options,
    status: 'success',
  });
};

const warning = (params: MessageParamsT): void => {
  const options: MessageParamsT = normalizeOptions(params);
  return showMessage({
    ...options,
    status: 'warning',
  });
};

const danger = (params: MessageParamsT): void => {
  const options: MessageParamsT = normalizeOptions(params);
  return showMessage({
    ...options,
    status: 'danger',
  });
};

const loading = (params: MessageParamsT): void => {
  const options: MessageParamsT = normalizeOptions(params);
  return showMessage({
    ...options,
    status: 'loading',
  });
};

const show = (params: MessageParamsT): void => {
  const options: MessageParamsT = normalizeOptions(params);
  return showMessage({
    ...options,
  });
};

const closeAll = () => {
  for (let ins of instanceMap.values()) {
    ins.exposed?.removeAll();
  }
};

const Message = {
  info,
  success,
  warning,
  danger,
  loading,
  show,
  closeAll,
};

const useMessage = () => {
  return Message;
};

export default useMessage;
