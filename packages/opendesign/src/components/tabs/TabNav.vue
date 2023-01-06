<script lang="ts">
import { computed, defineComponent, h, PropType, Slots } from 'vue';
import { IconClose } from '../_shared/icons';

export default defineComponent({
  name: 'OTabNav',
  inheritAttrs: false,
  props: {
    /**
     * 该页签key
     */
    value: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * 页签文本
     */
    label: {
      type: String,
      default: undefined,
    },
    /**
     * tabs选中页签的key
     */
    activeValue: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * nav插槽
     */
    slots: {
      type: Object as PropType<Slots>,
      default: undefined,
    },
    /**
     * 是否禁用选中
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否可以删除
     */
    closable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select', 'delete'],
  setup(props, { emit }) {
    const defaultLabel = props.label || props.value;

    const active = computed(() => props.activeValue === props.value);

    const navClick = (e: MouseEvent) => {
      if (props.disabled || active.value) {
        return;
      }
      emit('select', props.value, e);
    };

    const navCloseClick = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      emit('delete', props.value, e);
    };

    // pane只渲染default 插槽的内容
    return () => {
      const children = props.slots?.nav?.();

      const titleNode = h('div', { class: 'o-tab-nav-title' }, children || defaultLabel);

      const closeNode = h('div', { class: 'o-tab-nav-close', onClick: navCloseClick }, h(IconClose.value));

      return h(
        'div',
        {
          class: [
            'o-tab-nav',
            {
              active: active.value,
              'is-disabled': props.disabled,
              'is-closable': props.closable,
            },
          ],
          onClick: navClick,
        },
        props.closable ? [titleNode, closeNode] : titleNode
      );
    };
  },
});
</script>
