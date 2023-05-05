import { defineComponent, onMounted, ref } from 'vue';

/**
 * 只渲染一个子元素
 */
export default defineComponent({
  name: 'ClientOnly',
  setup(props, { slots }) {
    const isMoutned = ref(false);
    onMounted(() => {
      isMoutned.value = true;
    });
    return () => {
      return isMoutned.value ? slots.default?.() : null;
    };
  },
});
