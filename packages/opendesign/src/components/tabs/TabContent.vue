<script lang="ts">
import { computed, defineComponent, h, mergeProps, PropType, Transition, vShow, withDirectives, SetupContext, Slots, ref } from 'vue';

export default defineComponent({
  name: 'TabContent',
  inheritAttrs: false,
  props: {
    /**
     * tabs选中的key
     */
    value: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * tabs选中的key
     */
    activeValue: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * 是否在隐藏时卸载
     */
    unmountOnHide: {
      type: Boolean,
      default: false,
    },
    /**
     * 过渡动画
     */
    transition: {
      type: String,
      default: '',
    },
    /**
     * nav插槽
     */
    slots: {
      type: Object as PropType<Slots>,
      default: undefined,
    },
    /**
     * 过渡动画
     */
    attrs: {
      type: Object as PropType<SetupContext['attrs']>,
      default: () => {},
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const active = computed(() => props.activeValue === props.value);
    const toMount = computed(() => (props.lazy ? active.value : true));

    // pane只渲染default 插槽的内容
    return () => {
      const p = mergeProps(
        {
          class: ['o-tab-pane', { active: active.value }],
        },
        props.attrs
      );

      const child = h('div', p, props.slots?.default?.());

      return h(Transition, { name: props.transition }, () => {
        if (!toMount.value) {
          return null;
        }
        if (props.unmountOnHide) {
          return active.value ? child : null;
        } else {
          return withDirectives(child, [[vShow, active.value]]);
        }
      });
    };
  },
});
</script>
