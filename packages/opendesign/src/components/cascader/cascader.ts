import { isArray, isUndefined } from '../_shared/is';
import { CascaderValueT } from './types';
import { CascaderOptionT } from './types';

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

const DFS = (options: Array<CascaderOptionT>, parentNode: CascaderNodeT, depth: number) => {
  for (let i = 0, len = options.length; i < len; i++) {
    const item = options[i];
    let node: CascaderNodeT = {
      value: item.value,
      label: item.label,
      parent: parentNode,
      depth: depth + 1,
      children: [],
      isLeaf: true,
    };
    parentNode.children.push(node);

    if (item.children && item.children.length) {
      node.isLeaf = false;
      DFS(item.children, node, depth + 1);
    }
  }
};

export default class CascaderTree {
  root: CascaderNodeT;
  constructor() {
    this.root = {
      value: NaN,
      label: '',
      depth: 0,
      parent: null,
      children: [],
      isLeaf: true,
    };
  }

  updateTree(options: Array<CascaderOptionT>) {
    this.root = {
      value: NaN,
      label: '',
      depth: 0,
      parent: null,
      children: [],
      isLeaf: true,
    };
    DFS(options, this.root, 0);
  }

  getNode(node: CascaderNodeT, val: string | number): CascaderNodeT | undefined {
    if (node.value === val) {
      return node;
    }

    const children: Array<CascaderNodeT> = node.children;

    for (let i = 0, len = children.length; i < len; i++) {
      const rlt = this.getNode(children[i], val);
      if (rlt) {
        return rlt;
      }
    }
  }

  getChild(node: CascaderNodeT, val: string | number): CascaderNodeT | undefined {
    const children: Array<CascaderNodeT> = node.children;
    return children.find((item) => item.value === val);
  }

  getPanelInfo(val: CascaderValueT | undefined) {
    let rlt: Array<Array<ColumnInfoT>> = [];

    if (isUndefined(val)) {
      return rlt;
    }

    if (!isArray(val)) {
      let node = this.getNode(this.root, val);
      if (isUndefined(node)) {
        const columnInfo = this.getNextColumnInfo(this.root);
        if (!isUndefined(columnInfo)) {
          rlt = [columnInfo];
        }
      } else {
        while (node.parent) {
          const columnInfo = this.getNextColumnInfo(node.parent, node.value);
          if (!isUndefined(columnInfo)) {
            rlt.unshift(columnInfo);
          }
          node = node.parent;
        }
      }
    } else {
      let parent = this.root;

      for (let i = 0, len = val.length; i < len; i++) {
        const child = this.getChild(parent, val[i]);
        if (isUndefined(child)) {
          const columnInfo = this.getNextColumnInfo(this.root);
          if (!isUndefined(columnInfo)) {
            rlt = [columnInfo];
          }
          break;
        } else {
          const columnInfo = this.getNextColumnInfo(parent, val[i]);
          rlt.push(columnInfo);
          parent = child;
        }
      }
    }

    return rlt;
  }

  getNextColumnInfo(node: CascaderNodeT, activeVal?: string | number): Array<ColumnInfoT> {
    return node.children.map((item) => {
      const rlt = {
        value: item.value,
        label: item.label,
        depth: item.depth,
        isActive: false,
        isLeaf: item.children && item.children.length ? false : true,
      };

      if (!isUndefined(activeVal)) {
        rlt.isActive = item.value === activeVal;
      }

      return rlt;
    });
  }
}
