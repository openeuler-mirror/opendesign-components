import { defineComponent, onBeforeUnmount, onMounted, ref, cloneVNode, ComponentPublicInstance } from 'vue';
import { useResizeObserver } from '../hooks';

export default defineComponent({
  name: 'ResizeObserver',
  emits: ['resize'],
  setup(props, { emit, slots }) {
    const { createResizeObserver, destoryResizeObserver } = useResizeObserver();

    const childRef = ref<HTMLElement | ComponentPublicInstance | null>(null);

    onMounted(() => {
      if (childRef.value) {
        createResizeObserver((childRef.value as ComponentPublicInstance).$el || childRef.value, (entry: ResizeObserverEntry) => {
          emit('resize', entry);
        });
      }

    });

    onBeforeUnmount(() => {
      destoryResizeObserver();
    });

    return () => {
      const children = slots.default?.();
      if (children) {
        return cloneVNode(children[0], { ref: childRef });
      } else {
        return null;
      }
    };
  },
});
