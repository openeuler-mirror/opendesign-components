import { Component, onMounted, Slots, VNode, VNodeTypes } from 'vue';

// 来着vuejs/core
// https://github.com/vuejs/core/blob/main/packages/shared/src/shapeFlags.ts
export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
/**
 * 判断vnode是不是element
 */
export const isElement = (vnode: VNode) => {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.ELEMENT);
};

/**
 * 判断vnode是不是vue组件
 * @param vnode vnode节点
 * @param type 组件信息
 */
export function isComponent(vnode: VNode, type?: VNodeTypes): type is Component {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.COMPONENT);
}
/**
 * 判断vnode是不是vue组件
 */
export const isSlotsChildren = (vnode: VNode, children: VNode['children']): children is Slots => {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN);
};

// TODO
export function useSlotElement(componentName?: string) {
  let children: VNode[] | null = null;
  const components = [];
  // const
  onMounted(() => {
    children?.forEach(child => {
      console.log(child, isComponent(child));
      if (isComponent(child, child.type)) {
        if (componentName && child.type.name === componentName) {
          components.push(child);
        }
      }
    });
  });
  return {
    setSlotChildren(nodes: VNode[]) {
      children = nodes;
    }
  };
}