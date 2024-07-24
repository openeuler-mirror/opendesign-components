import { isFunction } from './utils';

export enum InnerEventKey {
  PV = '$PageView',
}

export const InnerEvents: Record<InnerEventKey, () => Record<string, any>> = {
  [InnerEventKey.PV]: () => {
    return {
      url: window.location.href,
      path: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search,
      title: document.title,
      referrer: document.referrer,
    };
  },
};

export function isInnerEvent(event: string): event is InnerEventKey {
  return Object.keys(InnerEvents).includes(event);
}

export function getInnerEventData(event: InnerEventKey) {
  const fn = InnerEvents[event];
  if (isFunction(fn)) {
    return fn();
  }
}
