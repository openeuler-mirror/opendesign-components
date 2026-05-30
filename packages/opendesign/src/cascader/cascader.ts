import { isArray, isUndefined } from '../_utils/is';
import { CascaderValueT } from './types';
import { CascaderOptionT } from './types';
import { log } from '../_utils/log';

export interface CascaderNodeT {
  value: string | number;
  label?: string;
  depth: number;
  parent: CascaderNodeT | null;
  children: CascaderNodeT[];
  isLeaf: boolean;
  fullLabel: string;
  fullPath: Array<string | number>;
  disabled?: boolean;
}

export interface ColumnInfoT {
  value: string | number;
  label?: string;
  depth: number;
  isLeaf: boolean;
  isActive?: boolean;
  hasActiveChild?: boolean;
  parent: CascaderNodeT | null;
  fullLabel: string;
  fullPath: Array<string | number>;
  disabled?: boolean;
}

const DFS = (
  options: Array<CascaderOptionT>,
  parentNode: CascaderNodeT,
  depth: number,
  map: Map<string | number, CascaderNodeT>,
  leafNodes: Array<CascaderNodeT>,
  lazy?: boolean,
) => {
  const fullLabel = parentNode.fullLabel || parentNode.label || '';
  const preLabel = depth === 0 ? `${fullLabel}` : `${fullLabel}/`;
  const parentFullPath = parentNode.fullPath || [];

  for (let i = 0, len = options.length; i < len; i++) {
    const item = options[i];
    const node: CascaderNodeT = {
      value: item.value,
      label: item.label,
      parent: parentNode,
      depth: depth + 1,
      children: [],
      isLeaf: true,
      disabled: item.disabled,
      fullLabel: `${preLabel}${item.label}`,
      fullPath: [...parentFullPath, item.value],
    };
    parentNode.children.push(node);
    map.set(node.value, node);

    if (item.children && item.children.length) {
      node.isLeaf = false;
      DFS(item.children, node, depth + 1, map, leafNodes, lazy);
    } else if (item.leaf === true) {
      node.isLeaf = true;
    } else if (item.leaf === false) {
      node.isLeaf = false;
    } else if (lazy) {
      // In lazy mode, nodes without children default to non-leaf (will load dynamically)
      node.isLeaf = false;
    }

    if (node.isLeaf) {
      leafNodes.push(node);
    }
  }
};

export default class CascaderTree {
  root: CascaderNodeT;
  map: Map<string | number, CascaderNodeT>;
  leafNodes: Array<CascaderNodeT>;
  constructor() {
    this.root = {
      value: NaN,
      label: '',
      depth: 0,
      parent: null,
      children: [],
      isLeaf: true,
      fullLabel: '',
      fullPath: [],
    };
    this.map = new Map();
    this.leafNodes = [];
  }
  /** 更新树结构，生成CascaderNodeT类型的数据 */
  updateTree(options: Array<CascaderOptionT>, lazy?: boolean) {
    this.root = {
      value: NaN,
      label: '',
      depth: 0,
      parent: null,
      children: [],
      isLeaf: true,
      fullLabel: '',
      fullPath: [],
    };
    this.map.clear();
    this.leafNodes = [];
    DFS(options, this.root, 0, this.map, this.leafNodes, lazy);
  }

  /** 为指定父节点动态添加子节点（用于懒加载） */
  addChildren(parentValue: string | number | null, children: Array<CascaderOptionT>, lazy?: boolean) {
    const parentNode = parentValue === null ? this.root : this.map.get(parentValue);
    if (!parentNode) return;

    // Remove all descendants from map and leafNodes
    const removeDescendants = (node: CascaderNodeT) => {
      node.children.forEach((child) => {
        this.map.delete(child.value);
        const idx = this.leafNodes.indexOf(child);
        if (idx > -1) this.leafNodes.splice(idx, 1);
        removeDescendants(child);
      });
    };
    removeDescendants(parentNode);
    parentNode.children = [];

    // Remove parentNode itself from leafNodes (it was added as leaf when lazy=true with no children)
    const parentLeafIdx = this.leafNodes.indexOf(parentNode);
    if (parentLeafIdx > -1) this.leafNodes.splice(parentLeafIdx, 1);

    if (children.length === 0) {
      // No children → mark as explicit leaf
      parentNode.isLeaf = true;
      this.leafNodes.push(parentNode);
      return;
    }

    parentNode.isLeaf = false;
    DFS(children, parentNode, parentNode.depth, this.map, this.leafNodes, lazy);
  }

  getNode(val: string | number): CascaderNodeT | undefined {
    return this.map.get(val);
  }
  /**
   * 根据选中的叶子节点值获取级联选择器每栏应该渲染的数据
   * @param val 选中的叶子节点值
   * @param lazy 是否懒加载模式，懒加载下选中非叶子节点时额外追加其子列
   * @returns 级联选择器每栏的数据
   */
  getPanelInfo(val: CascaderValueT | undefined, lazy?: boolean) {
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
        const selectedNode = current;
        while (current && current.parent) {
          rlt.unshift(this.getColumnInfo(current.parent, [current.value]));
          current = current.parent;
        }
        // 懒加载模式下，选中节点为非叶子节点时追加其子列
        if (lazy && !selectedNode.isLeaf) {
          rlt.push(this.getColumnInfo(selectedNode));
        }
      }
    } else {
      // 当val是数组时，val是从跟节点到叶子节点的路径

      // TODO 这里只考虑一组路径 如果是多组路径呢??
      for (let i = 0; i < val.length; i++) {
        const item = this.getNode(val[i]);
        if (item && item.parent) {
          rlt.push(this.getColumnInfo(item.parent, [item.value]));
        } else {
          // 异常数据
          rlt.length = 0;
          log.warn('Cascader: Invalid value');
          break;
        }
      }
      if (rlt.length === 0) {
        rlt.push(this.getColumnInfo(this.root));
      } else if (lazy) {
        // 懒加载模式下，路径末尾节点为非叶子节点时追加其子列
        const lastNode = this.getNode(val[val.length - 1]);
        if (lastNode && !lastNode.isLeaf) {
          rlt.push(this.getColumnInfo(lastNode));
        }
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
  getColumnInfo(node: CascaderNodeT, activeVal?: Array<string | number>): Array<ColumnInfoT> {
    return node.children.map((item) => {
      const rlt = {
        value: item.value,
        label: item.label,
        depth: item.depth,
        isActive: false,
        isLeaf: item.isLeaf,
        fullLabel: item.fullLabel,
        fullPath: item.fullPath,
        parent: item.parent,
        disabled: false,
      };

      if (!isUndefined(activeVal)) {
        rlt.isActive = activeVal.includes(item.value);
      }

      rlt.disabled = Boolean(item.disabled);
      return rlt;
    });
  }

  getLeafNodes() {
    return this.leafNodes;
  }
}
