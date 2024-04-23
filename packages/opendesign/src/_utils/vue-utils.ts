import { Component, onMounted, ref, Slots, Slot, VNode, VNodeTypes, Comment, ComponentPublicInstance, watchEffect, Ref, isRef } from 'vue';
import { isArray } from './is';
import { isHtmlElement } from './dom';

// 来着vuejs/core
// https://github.com/vuejs/core/blob/main/packages/shared/src/shapeFlags.ts
export const enum ShapeFlags {
  ELEMENT = 1, // 普通HTML元素
  FUNCTIONAL_COMPONENT = 1 << 1, //函数式组件
  STATEFUL_COMPONENT = 1 << 2, //有状态组件
  TEXT_CHILDREN = 1 << 3, //文本节点
  ARRAY_CHILDREN = 1 << 4, //数组子节点
  SLOTS_CHILDREN = 1 << 5, //插槽子节点
  TELEPORT = 1 << 6, // teleport组件
  SUSPENSE = 1 << 7, //suspense组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, //需要被keep-live的有状态组件
  COMPONENT_KEPT_ALIVE = 1 << 9, //已经被keep-alive的有状态组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT, //有状态或函数式组件
}
/**
 * 判断vnode是不是element
 */
export const isElement = (vnode: VNode) => {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.ELEMENT);
};
/**
 * 判断vnode是不是文本节点
 * 包含注释节点
 */
export const isTextElement = (vnode: VNode) => {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN);
};
/**
 * 判断vnode是不是vue组件
 * @param vnode vnode节点
 * @param type 组件信息
 */
export function isComponent(vnode: VNode, _type?: VNodeTypes): _type is Component {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.COMPONENT);
}
/**
 * 判断vnode是不是vue组件
 */
export const isSlotsChildren = (vnode: VNode, _children?: VNode['children']): _children is Slots => {
  return Boolean(vnode && vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN);
};

/**
 * 判断vnode是不是slot的子元素
 */
export const isArrayChildren = (vn: VNode, _children?: VNode['children']): _children is VNode[] => {
  return Boolean(vn && vn.shapeFlag & ShapeFlags.ARRAY_CHILDREN);
};

/**
 * 判断val是不是vue组件实例
 */
export function isComponentPublicInstance(val: unknown): val is ComponentPublicInstance {
  return Boolean((val as ComponentPublicInstance)?.$el);
}

// TODO
export function useSlotElement(componentName?: string) {
  let children: VNode[] | null = null;
  const components = [];

  onMounted(() => {
    children?.forEach((child) => {
      if (isComponent(child, child.type)) {
        if (componentName && child.type.name === componentName) {
          components.push(child);
        }
      }
    });
  });
  return {
    setSlotChildren(nodes: VNode[] | undefined) {
      if (nodes) {
        children = nodes;
      }
    },
  };
}
export function getFirstComponent(vn: VNode | VNode[]): VNode | null {
  if (isArray(vn)) {
    for (const child of vn) {
      const result = getFirstComponent(child);
      if (result) {
        return result;
      }
    }
  } else if (isElement(vn) || isComponent(vn) || (isTextElement(vn) && vn.type !== Comment)) {
    return vn;
  } else if (isArrayChildren(vn, vn.children)) {
    for (const child of vn.children) {
      const result = getFirstComponent(child);
      if (result) {
        return result;
      }
    }
  } else if (isSlotsChildren(vn, vn.children)) {
    const children = vn.children.default?.();
    if (children) {
      const result = getFirstComponent(children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export const getFirstElement = (vn: VNode | VNode[]): HTMLElement | null => {
  if (isArray(vn)) {
    for (const child of vn) {
      const result = getFirstElement(child);
      if (result) {
        return result;
      }
    }
  } else if (isElement(vn)) {
    return vn.el as HTMLElement;
  } else if (isComponent(vn)) {
    if ((vn.el as Node).nodeType === 1) {
      return vn.el as HTMLElement;
    }
    if (vn.component) {
      const result = getFirstElement(vn.component.subTree);
      if (result) {
        return result;
      }
    }
  } else if (isArrayChildren(vn, vn.children)) {
    for (const child of vn.children) {
      const result = getFirstElement(child);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export function useSlotFirstElement(): { setSlot: (nodes: VNode[] | undefined) => void; fistElement: Ref<HTMLElement | null> } {
  let children: VNode[] | null = null;
  const fistElement = ref<HTMLElement | null>(null);

  onMounted(() => {
    if (children) {
      fistElement.value = getFirstElement(children);
    }
  });
  return {
    setSlot(nodes: VNode[] | undefined) {
      if (nodes) {
        children = nodes;
      }
    },
    fistElement,
  };
}

export const resolveHtmlElement = (
  elRef: Ref<string | ComponentPublicInstance | HTMLElement | null | undefined> | HTMLElement | string | undefined | ComponentPublicInstance
): Promise<HTMLElement | null> => {
  const queryElement = (el: string | HTMLElement | null | undefined): HTMLElement | null => {
    if (typeof el === 'string') {
      return document.querySelector(el);
    } else if (isHtmlElement(el)) {
      return el;
    }
    return null;
  };

  return new Promise((resolve) => {
    if (isRef(elRef)) {
      watchEffect(() => {
        const { value } = elRef;
        if (value) {
          if (isComponentPublicInstance(value)) {
            resolve(value.$el);
          } else {
            resolve(queryElement(value));
          }
        }
      });
    } else if (isComponentPublicInstance(elRef)) {
      resolve(elRef.$el);
    } else {
      resolve(queryElement(elRef));
    }
  });
};

export const getHtmlElement = (elRef: Ref<string | ComponentPublicInstance | HTMLElement | null>): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    if (isHtmlElement(elRef.value)) {
      resolve(elRef.value as HTMLElement);
    } else if (typeof elRef.value === 'string') {
      resolve(document.querySelector(elRef.value) as HTMLElement);
    } else {
      watchEffect(() => {
        if (isHtmlElement(elRef.value)) {
          resolve(elRef.value as HTMLElement);
        } else if (elRef.value) {
          resolve((elRef.value as ComponentPublicInstance).$el);
        }
      });
    }
  });
};

export const isEmptySlot = (slot?: Slot) => {
  if (!slot) {
    return true;
  }
  const children = slot();

  if (children.length > 1) {
    return false;
  }

  if (children.length === 0) {
    return true;
  }
  // TODO: 如何判断是否为注释节点
  if (children.length === 1 && isTextElement(children[0]) && !children[0].children) {
    return true;
  }
  return false;
};

/**
 * 过滤插槽
 */
export const filterSlots = (slots: Slots, slotNames: { [key: string]: string }): string[] => {
  const names = Object.values(slotNames);
  return Object.keys(slots).filter((item) => names.includes(item));
};
