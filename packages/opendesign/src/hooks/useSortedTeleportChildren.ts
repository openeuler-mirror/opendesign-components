import { shallowRef, getCurrentInstance, onBeforeUnmount, type Component, type VNode, type ComponentInternalInstance, shallowReactive } from 'vue';
import { isArrayEqual } from '../_utils/is.ts';
import { flatComponentVNode } from '../_utils/vue-utils.ts';
import { useRunOnceNextTick } from './useRunOnceNextTick.ts';

export type PublicChildT<T = {}> = {
  uid: number;
  getVNode: () => VNode;
} & T;
type ComponentInternalInstanceWithRender = ComponentInternalInstance & {
  // render 函数可能来源于sfc模板编译，
  // 也可能 `template` 属性的运行时编译，
  // 还可能来源于 setup 返回的函数
  render: () => any;
};

/**
 * 按模板顺序维护指定类型后代组件的排序
 *
 * @description
 * 在 Vue 中，当使用 Teleport 或动态注册组件时，子组件的渲染顺序可能与模板书写顺序不一致。
 * 该 Hook 通过监听 DOM 节点变化，确保子组件始终按模板中的书写顺序排列。
 *
 * @param vm - 父组件实例
 * @param childType - 需要排序的后代组件类型
 *
 * @note
 * - 排序操作会在下一帧执行
 * - SSR 环境下无法工作（依赖响应式变量触发重渲染）
 * - 适用于需要严格保持子组件顺序的场景
 */
export const useSortedTeleportChildren = <T extends PublicChildT>(vm: ComponentInternalInstance, childType: Component | string) => {
  const children = shallowReactive<Record<string, T>>({});
  const sortedChildren = shallowRef<T[]>([]);
  const parentVms = new WeakSet<ComponentInternalInstanceWithRender>();
  const runOnceNextTick = useRunOnceNextTick();

  const sortChildren = () => {
    const newSortedChildren: T[] = [];
    flatComponentVNode(vm.subTree, childType).forEach((child) => {
      if (child.component?.uid && children[child.component.uid]) {
        newSortedChildren.push(children[child.component.uid]);
      }
    });
    if (!isArrayEqual(sortedChildren.value, newSortedChildren, true)) {
      sortedChildren.value = newSortedChildren;
    }
  };

  const removeChild = (uid: number) => {
    const child = children[uid];
    if (child) {
      runOnceNextTick(sortChildren);
      delete children[uid];
    }
  };

  const addChild = (child: T) => {
    const childVm = getCurrentInstance()!;
    const parentVm = childVm.parent as ComponentInternalInstanceWithRender;
    if (!parentVms.has(parentVm)) {
      const originRender = parentVm.render;
      if (originRender) {
        parentVm.render = function (...args) {
          runOnceNextTick(sortChildren);
          return originRender.apply(this, args);
        };
      }
      parentVms.add(parentVm);
    }
    onBeforeUnmount(() => {
      removeChild(child.uid);
    });
    children[child.uid] = child;
    runOnceNextTick(sortChildren);
  };

  return { children: sortedChildren, childMap: children, addChild };
};
