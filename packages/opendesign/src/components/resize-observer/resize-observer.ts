import { defineComponent, cloneVNode, withDirectives, VNode, Directive } from 'vue';
import { useReiszeObserverDirective } from '../hooks';
import { isElement } from '../_shared/vue-utils';
import { isArray } from '../_shared/is';

// 递归绑定
const bindEvent = (child: VNode, vResizeObserver: Directive) => {
  if (isElement(child)) {
    return withDirectives(cloneVNode(child), [[vResizeObserver]]);
  } else if (isArray(child.children)) {
    child.children = child.children.map((item) => {
      return bindEvent(item as VNode, vResizeObserver);
    });
    return child;
  } else {
    return child;
  }
};
/**
 * 子元素resize监听
 * 如果有多个子元素，每个子元素都会被监听到
 */
export default defineComponent({
  name: 'OResizeObserver',
  emits: ['resize'],
  setup(props, { emit, slots }) {
    const { vResizeObserver } = useReiszeObserverDirective((entry: ResizeObserverEntry, isFirst: boolean) => {
      // 触发resize事件
      emit('resize', entry, isFirst);
    });

    return () => {
      const children = slots.default?.();

      return children?.map((item) => {
        return bindEvent(item, vResizeObserver);
      });
    };
  },
});
