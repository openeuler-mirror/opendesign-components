import { defineComponent } from 'vue';
import { getFirstComponent } from '../_shared/vue-utils';

/**
 * 只渲染一个子元素
 */
export default defineComponent({
  name: 'OChildOnly',
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.();
      // console.log(children);

      return children ? getFirstComponent(children) : null;
    };
  },
});
