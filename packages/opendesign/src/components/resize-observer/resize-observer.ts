import { defineComponent, cloneVNode, withDirectives } from 'vue';
import { useReiszeObserverDirective } from '../hooks';

/**
 * 子元素resize监听
 * 如果有多个子元素，每个子元素都会被监听到
 */
export default defineComponent({
  name: 'ResizeObserver',
  emits: ['resize'],
  setup(props, { emit, slots }) {
    const { vResizeObserver } = useReiszeObserverDirective((entry: ResizeObserverEntry, isFirst: boolean) => {
      // 触发resize事件
      emit('resize', entry, isFirst);
    });

    return () => {
      const children = slots.default?.();
      return children?.map((item) => withDirectives(cloneVNode(item), [[vResizeObserver]]));
    };
  },
});
