export interface TreeNodeT {
  value: string | number;
  parent: TreeNodeT | null;
  children: Array<TreeNodeT>;
}

export interface TreeT {
  root: TreeNodeT;
  getNode(node: TreeNodeT, val: string | number): TreeNodeT | undefined;
  getPath(node: TreeNodeT, val: string | number, path: Array<TreeNodeT>): Array<TreeNodeT> | undefined;
}

export class VTree implements TreeT {
  root: TreeNodeT;
  constructor(value: string | number, parent: TreeNodeT | null, children: Array<TreeNodeT> = []) {
    this.root = {
      value,
      parent,
      children,
    };
  }

  getNode(node: TreeNodeT, val: string | number): TreeNodeT | undefined {
    if (node.value === val) {
      return node;
    }

    const children: Array<TreeNodeT> = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
      const rlt = this.getNode(children[i], val);
      if (rlt) {
        return rlt;
      }
    }
  }

  getPath(node: TreeNodeT, val: string | number, path: Array<TreeNodeT>): Array<TreeNodeT> | undefined {
    const children: Array<TreeNodeT> = node.children;
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      if (child.value === val) {
        return [...path, child];
      }

      const rlt = this.getPath(child, val, [...path, child]);
      if (rlt) {
        return rlt;
      }
    }
  }

  hasSameNode(nodes: Array<TreeNodeT>, val: string | number) {
    return nodes.some((item) => item.value === val);
  }

  addNode(node: TreeNodeT) {
    const parent = node.parent;
    if (!parent) {
      if (!this.hasSameNode(this.root.children, node.value)) {
        node.parent = this.root;
        this.root.children.push(node);
      }
    } else {
      const parentNode = this.getNode(this.root, parent.value);
      if (parentNode && !this.hasSameNode(parentNode.children, node.value)) {
        node.parent = parentNode;
        parentNode.children.push(node);
      }
    }
  }
}
