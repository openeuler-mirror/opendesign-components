import { defineComponent, Fragment, type VNode } from 'vue';

/**
 * @description 步骤过滤渲染组件
 * 遍历 slot 子节点（含 Fragment 解包），只渲染当前步骤的 OTourStep VNode
 */
export default defineComponent({
  name: 'OTourSteps',
  props: {
    current: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update-total'],
  setup(props, { slots, emit }) {
    let cacheTotal = 0;

    /**
     * @description 递归解包 Fragment，收集 OTourStep VNode
     * slot 透传时子节点会被 Fragment 包裹，需展开才能拿到真实组件 VNode
     */
    function collectSteps(children: VNode[], out: VNode[]) {
      children.forEach((item) => {
        if (item.type === Fragment && Array.isArray(item.children)) {
          collectSteps(item.children as VNode[], out);
        } else {
          const name = ((item?.type || {}) as any)?.name;
          if (name === 'OTourStep') {
            out.push(item);
          }
        }
      });
    }

    return () => {
      const defaultSlot = slots.default?.();
      if (!defaultSlot?.length) return null;
      const steps: VNode[] = [];
      collectSteps(defaultSlot, steps);
      if (cacheTotal !== steps.length) {
        cacheTotal = steps.length;
        emit('update-total', steps.length);
      }
      return steps.length ? steps[props.current] : null;
    };
  },
});
