/**
 * 虚拟列表测试渲染辅助函数。
 */
import { h } from 'vue';
import { render } from 'vitest-browser-vue';
import OVirtualList from '../../OVirtualList.vue';

/** 默认作用域插槽的 item 类型（height 可选，兼容定高与不定高） */
type VLSlotItem = { label: string; height?: number };

/** 作用域插槽的 scope 类型 */
export type VLSlotScope = { item: VLSlotItem; index: number };

/**
 * @description 渲染虚拟列表并设置容器高度（组件依赖容器有确定高度）
 * @param props 组件 props
 * @param slotContent 作用域插槽内容类型（'dynamic' 为不定高模式）
 * @returns render 返回的 screen 对象
 */
export function renderList(props: Record<string, unknown>, slotContent?: string) {
  return render({
    render: () =>
      h(
        'div',
        h(
          OVirtualList,
          { ...props, style: 'height: 300px; width: 400px;' },
          {
            default:
              slotContent === 'dynamic'
                ? (scope: VLSlotScope) => h('div', { 'data-index': scope.index, style: `height: ${scope.item.height}px` }, `${scope.item.label}`)
                : (scope: VLSlotScope) => h('div', { 'data-index': scope.index }, scope.item.label),
          },
        ),
      ),
  });
}
