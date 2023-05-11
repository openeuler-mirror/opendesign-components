import { ref } from 'vue';
import { PointT } from '../_shared/types';
import { isClient } from '../_shared/is';
import { trigger } from '../_shared/event';

export type PointerTypeT = 'mouse' | 'touch';
export type PositionTypeT = 'page' | 'client' | 'screen' | 'offset';

export interface UseMousePropsT {
  defaultValue?: PointT;
  target?: Window | EventTarget | null;
  type?: PositionTypeT;
}

const getPositionByType: Record<PositionTypeT, (e: MouseEvent | TouchEvent) => PointT> = {
  page: (e) => ({ x: (e as MouseEvent).pageX, y: (e as MouseEvent).pageY }),
  client: (e) => ({ x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }),
  screen: (e) => ({ x: (e as MouseEvent).screenX, y: (e as MouseEvent).screenY }),
  offset: (e) => ({ x: (e as MouseEvent).offsetX, y: (e as MouseEvent).offsetY }),
};

const defaultWindow = isClient ? window : null;
export function useMouse(props: UseMousePropsT = {}) {
  const { defaultValue = { x: 0, y: 0 }, target = defaultWindow, type = 'page' } = props;
  const x = ref(defaultValue.x);
  const y = ref(defaultValue.y);
  const handler = (e: Event) => {
    const p = getPositionByType[type](e as MouseEvent);
    x.value = p.x;
    y.value = p.y;
  };

  if (target) {
    target.addEventListener('mousemove', handler, { passive: true });
    trigger(target as HTMLElement, 'mousemove');
  }

  const destroy = () => {
    target?.removeEventListener('mousemove', handler);
  };

  return {
    x,
    y,
    destroy,
  };
}

export type UseMouseT = ReturnType<typeof useMouse>;
