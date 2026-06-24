import {
  Component,
  onMounted,
  ref,
  Slots,
  Slot,
  VNode,
  VNodeTypes,
  Comment,
  Fragment,
  Ref,
  isRef,
  watch,
  MaybeRef,
  h,
  isVNode,
  camelize,
  capitalize,
  type ComponentPublicInstance,
  type VNodeNormalizedChildren,
  toValue,
} from 'vue';
import { isArray, isFunction, isNil, isString } from './is';
import { isHtmlElement } from './dom';
import { log } from './log.ts';

// 来着vuejs/core
// https://github.com/vuejs/core/blob/main/packages/shared/src/shapeFlags.ts
export const enum ShapeFlags {
  ELEMENT = 1, // 普通HTML元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 有状态组件
  TEXT_CHILDREN = 1 << 3, // 文本节点
  ARRAY_CHILDREN = 1 << 4, // 数组子节点
  SLOTS_CHILDREN = 1 << 5, // 插槽子节点
  TELEPORT = 1 << 6, // teleport组件
  SUSPENSE = 1 << 7, // suspense组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 需要被keep-live的有状态组件
  COMPONENT_KEPT_ALIVE = 1 << 9, // 已经被keep-alive的有状态组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT, // 有状态或函数式组件
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
export function isComponent(vnode: VNode, _type?: VNodeTypes): _type is Component & { __name?: string; name?: string } {
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

export function useSlotFirstElement(): { setSlot: (nodes: VNode[] | undefined) => void; firstElement: Ref<HTMLElement | null> } {
  let children: VNode[] | null = null;
  const firstElement: Ref<HTMLElement | null> = ref(null);

  onMounted(() => {
    if (children) {
      firstElement.value = getFirstElement(children);
    }
  });
  return {
    setSlot(nodes: VNode[] | undefined) {
      if (nodes) {
        children = nodes;
      }
    },
    firstElement,
  };
}

type ElementQuery = string | HTMLElement | ComponentPublicInstance | null | undefined;
const queryElement = (el: string | HTMLElement | null | undefined): HTMLElement | null => {
  if (typeof el === 'string') {
    return document.querySelector(el);
  } else if (isHtmlElement(el)) {
    return el;
  }
  return null;
};

/**
 * 将 MaybeRef 类型的元素查询值解析为 HTMLElement
 * @param elRef - 元素查询值，可以是字符串选择器、HTMLElement、组件实例，或 Ref 包装的上述类型
 * @returns 解析后的 HTMLElement，若无法解析则返回 null
 * @todo elQuery.$el 的类型可能为 SVGElement Text Comment 等，此处没有处理
 */
export const getHtmlElement = (elRef: MaybeRef<ElementQuery>): HTMLElement | null => {
  const elQuery = toValue(elRef);
  if (isComponentPublicInstance(elQuery)) {
    return elQuery.$el;
  } else {
    return queryElement(elQuery);
  }
};

/**
 * 异步解析 MaybeRef 类型的元素查询值为 HTMLElement，当值为 Ref 且当前为 falsy 时会等待其变为 truthy 后再解析
 * @param elRef - 元素查询值，可以是字符串选择器、HTMLElement、组件实例，或 Ref 包装的上述类型
 * @returns Promise，解析为 HTMLElement；若值变为 falsy 会打印警告，Promise 可能不会 resolve
 */
export const resolveHtmlElement = (elRef: MaybeRef<ElementQuery>): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    if (isRef(elRef) && !elRef.value) {
      const closeWatch = watch(elRef, (el, oldEl) => {
        if (el) {
          resolve(getHtmlElement(el));
          closeWatch();
        } else {
          log.warn(
            `resolveHtmlElement: elRef value is falsy, this might be a bug and could cause the promise to remain pending. Please check elRef.value: ${oldEl} -> ${el}`,
          );
        }
      });
    } else {
      resolve(getHtmlElement(elRef));
    }
  });
};

/**
 * 检测插槽是否为空（无实际渲染内容）。
 *
 * 通过试渲染 slot({}) 来判断，可以正确处理以下情况：
 * - 注释节点（v-if="false" 渲染出的注释节点视为空）
 * - 空文本节点
 * - 空片段节点
 *
 * 传入 {} 而非不传参，是为了避免 scoped slot 在使用解构语法时崩溃：
 *   <template #foo="{ setValue }">  ← 若 slot() 传 undefined，解构会抛 TypeError
 * 传入空对象是安全的折中方案，对普通插槽无影响。
 *
 * 注意：若 slot 内容通过 slot props 做条件渲染（如 v-if="setValue"），
 * 试渲染时 props 为空对象，条件为 falsy，可能导致误判为空。
 * 这属于极少数场景，实际使用中应避免在 slot 内依赖 slot props 做 v-if 判断。
 *
 * 另：直接用 $slots.foo 存在性判断不能检测注释节点（只要父组件写了 <template #foo> 就为 truthy），
 * 因此不能替代本函数。
 */
export const isEmptySlot = (slot?: Slot) => {
  if (!slot) {
    return true;
  }
  const children = slot({});

  if (children.length > 1) {
    return false;
  }

  if (children.length === 0) {
    return true;
  }
  if (isTextElement(children[0]) && !children[0].children) {
    return true;
  }
  // 如果是注释节点，v-if不渲染的也算注释节点
  if (children[0].type === Comment) {
    return true;
  }
  /**
   * 如果是不渲染的片段节点，检查片段节点内部是否有子节点
   * 只会检查子节点的个数，如果子节点的子节点也是空的片段节点，请调用者在slot最外层套v-if
   */
  if (children[0].type === Fragment) {
    return !children[0].children?.length;
  }
  return false;
};

/**
 * 过滤插槽
 */
export function filterSlots<T extends Record<string, string>>(slots: Slots, slotNames: T): Array<T[keyof T]> {
  const names: string[] = Object.values(slotNames);
  const keys = Object.keys(slots);
  return keys.filter((item) => names.includes(item)) as Array<T[keyof T]>;
}

/**
 * 合并class
 */
export function mergeClass(...classList: Array<string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string> | undefined>) {
  let rlt: Array<{ [k: string]: boolean } | string> = [];

  classList.forEach((item) => {
    if (isArray(item)) {
      rlt = rlt.concat(item);
    } else if (item) {
      rlt.push(item);
    }
  });

  return rlt;
}

/**
 * 根据传入的参数获取能被component渲染的内容
 */
export function getRenderableComponent(content: unknown): (() => VNode | string) | null {
  if (isNil(content)) {
    return null;
  }
  if (typeof content === 'string') {
    return () => content;
  }
  if (isVNode(content)) {
    return () => content;
  }
  if (typeof content === 'function' || typeof content === 'object') {
    return () => h(content as Component);
  }

  return () => content.toString();
}

/**
 * 判断该 VNode 是否由该 type 创建的
 * @param vn 虚拟节点
 * @param type 组件或组件名称，元素名称，
 * @returns 是否是该组件/元素创建的虚拟节点
 */
export const isVNodeOfType = (vn: VNode, type: Component | string) => {
  if (isString(type)) {
    if (isString(vn.type)) {
      return vn.type.toLowerCase() === type.toLowerCase();
    }
    if (isComponent(vn, vn.type)) {
      // 无法判断出匿名组件
      const selfName: string = isFunction(vn.type) ? (vn.type as any).displayName : vn.type.name || vn.type.__name;
      return selfName && (selfName === type || selfName === camelize(type) || selfName === capitalize(camelize(type)));
    }
  }
  return vn.type === type;
};
/** 从虚拟节点树中获取指定组件生成的虚拟节点 */
export const flatComponentVNode = (vn: VNodeNormalizedChildren | VNode[] | VNode, type: Component | string) => {
  const res: VNode[] = [];
  const _vn = isArray(vn) ? vn : [vn];

  _vn.forEach((child) => {
    if (isArray(child)) {
      res.push(...flatComponentVNode(child, type));
      return;
    }
    if (!isVNode(child)) {
      return;
    }
    if (isVNodeOfType(child, type)) {
      res.push(child);
    }
    if (child.component?.subTree) {
      res.push(...flatComponentVNode(child.component.subTree, type));
    } else if (child.children) {
      res.push(...flatComponentVNode(child.children, type));
    }
  });

  return res;
};
