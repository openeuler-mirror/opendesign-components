import { defineComponent, onBeforeUnmount, cloneVNode, withDirectives } from 'vue';
import { useResizeObserver } from '../hooks/use-resize-observer';
import { useElementDirective, LifeCycleT } from '../hooks/use-element';


export default defineComponent({
  name: 'ResizeObserver',
  emits: ['resize'],
  setup(props, { emit, slots }) {
    const { createResizeObserver, destoryResizeObserver } = useResizeObserver();

    let ro: ResizeObserver | null = null;

    const { getElementDirective } = useElementDirective((el: HTMLElement | null, type: LifeCycleT) => {
      if (type === 'updated') {
        return;
      }

      if (ro) {
        destoryResizeObserver();
      }

      if (el) {
        ro = createResizeObserver(el, (entry: ResizeObserverEntry) => {
          emit('resize', entry);
        });
      }
    });

    onBeforeUnmount(() => {
      // 销毁监听
      destoryResizeObserver();
    });

    return () => {
      const children = slots.default?.();
      if (children && children.length > 0) {
        children[0] = withDirectives(cloneVNode(children[0]), [[getElementDirective]]);
      }
      return children;
    };
  },
});
