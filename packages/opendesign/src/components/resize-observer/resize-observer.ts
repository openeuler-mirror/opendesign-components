import { defineComponent, cloneVNode, withDirectives, VNode } from 'vue';
import { useReiszeObserverDirective } from '../hooks';
import { isArrayChildren } from '../_shared/vue-utils';
import { isArray } from '../_shared/is';
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
        // 解决resize嵌套slot
        if (isArrayChildren(item)) {
          if (isArray(item.children)) {
            item.children = item.children.map((child) => {
              return withDirectives(cloneVNode(child as VNode), [[vResizeObserver]]);
            });
          }
          return item;
        } else {
          return withDirectives(cloneVNode(item), [[vResizeObserver]]);
        }
      });
    };
  },
});
