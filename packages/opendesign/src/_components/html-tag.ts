import { defineComponent, h } from 'vue';

/**
 * 只渲染一个子元素
 */
export default defineComponent({
  name: 'HtmlTag',
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup(props, { slots, attrs }) {

    return () => {
      return h(props.tag, attrs, slots.default?.());
    };
  },
});
