import { isArray, isUndefined } from '../_utils/is';
import { CascaderValueT } from './types';
import { CascaderOptionT } from './types';
import { log } from '../_utils/log';

interface CascaderNodeT {
  value: string | number;
  label?: string;
  depth: number;
  parent: CascaderNodeT | null;
  children: CascaderNodeT[];
  isLeaf: boolean;
}

export interface ColumnInfoT {
  value: string | number;
  label?: string;
  depth: number;
  isLeaf: boolean;
  isActive: boolean;
}

const DFS = (options: Array<CascaderOptionT>, parentNode: CascaderNodeT, depth: number, map: Map<string | number, CascaderNodeT>) => {
  for (let i = 0, len = options.length; i < len; i++) {
    const item = options[i];
    const node: CascaderNodeT = {
      value: item.value,
      label: item.label,
      parent: parentNode,
      depth: depth + 1,
      children: [],
      isLeaf: true,
    };
    parentNode.children.push(node);
    map.set(node.value, node);

    if (item.children && item.children.length) {
      node.isLeaf = false;
      DFS(item.children, node, depth + 1, map);
    }
  }
};

export default class CascaderTree {
  root: CascaderNodeT;
  map: Map<string | number, CascaderNodeT>;
  constructor() {
    this.root = {
      value: NaN,
      label: '',
      depth: 0,
      parent: null,
      children: [],
      isLeaf: true,
    };
    this.map = new Map();
  }
  /** 更新树结构，生成CascaderNodeT类型的数据 */
  updateTree(options: Array<CascaderOptionT>) {
    this.root = {
      value: NaN,
      label: '',
      depth: 0,
      parent: null,
      children: [],
      isLeaf: true,
    };
    this.map.clear();
    DFS(options, this.root, 0, this.map);
  }

  getNode(val: string | number): CascaderNodeT | undefined {
    return this.map.get(val);
  }
  /**
   * 根据选中的叶子节点值获取级联选择器每栏应该渲染的数据
   * @param val 选中的叶子节点值
   * @returns 级联选择器每栏的数据
   */
  getPanelInfo(val: CascaderValueT | undefined) {
    const rlt: Array<Array<ColumnInfoT>> = [];

    if (isUndefined(val) || this.root.children.length === 0) {
      return rlt;
    }

    if (!isArray(val)) {
      // 当val不是数组时，val时叶子节点的值
      let current = this.getNode(val);
      if (!current) {
        // 异常数据，只将根节点添加到rlt中
        rlt.push(this.getColumnInfo(this.root));
        log.warn('Cascader: Invalid value');
      } else {
        while (current && current.parent) {
          rlt.unshift(this.getColumnInfo(current.parent, current.value));
          current = current.parent;
        }
      }
    } else {
      // 当val是数组时，val是从跟节点到叶子节点的路径
      for (let i = 0; i < val.length; i++) {
        const item = this.getNode(val[i]);
        if (item && item.parent) {
          rlt.push(this.getColumnInfo(item.parent, item.value));
        } else {
          // 异常数据
          rlt.length = 0;
          log.warn('Cascader: Invalid value');
          break;
        }
      }
      if (rlt.length === 0) {
        rlt.push(this.getColumnInfo(this.root));
      }
    }

    return rlt;
  }
  /**
   * 根据当前选中的节点，获取当前列的信息
   * @param node 当前选中的节点的父节点
   * @param activeVal 当前选中的节点的value
   * @returns 当前节点的可选项数据
   */
  getColumnInfo(node: CascaderNodeT, activeVal?: string | number): Array<ColumnInfoT> {
    return node.children.map((item) => {
      const rlt = {
        value: item.value,
        label: item.label,
        depth: item.depth,
        isActive: false,
        isLeaf: item.isLeaf,
      };

      if (!isUndefined(activeVal)) {
        rlt.isActive = item.value === activeVal;
      }

      return rlt;
    });
  }
}
