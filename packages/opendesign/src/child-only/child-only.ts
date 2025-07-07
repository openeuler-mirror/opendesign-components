import { defineComponent } from 'vue';
import { getFirstComponent } from '../_utils/vue-utils';

/**
 * 只渲染一个子元素
 */
export default defineComponent({
  name: 'OChildOnly',
  setup(_props, { slots }) {
    return () => {
      const children = slots.default?.();

      return children ? getFirstComponent(children) : null;
    };
  },
});
