import { defineComponent, cloneVNode, withDirectives } from 'vue';
import { useIntersectionObserverDirective } from '../hooks';

/**
 * 子元素resize监听
 * 如果有多个子元素，每个子元素都会被监听到
 */
export default defineComponent({
  name: 'OIntersectionObserver',
  emits: ['intersection'],
  setup(props, { emit, slots }) {
    const { vIntersectionObserver } = useIntersectionObserverDirective({
      listener: (entry: IntersectionObserverEntry) => {
        // 触发resize事件
        emit('intersection', entry.isIntersecting, entry);
      },
      removeOnUnmounted: false
    });

    return () => {
      const children = slots.default?.();
      return children?.map((item) => withDirectives(cloneVNode(item), [[vIntersectionObserver]]));
    };
  },
});
