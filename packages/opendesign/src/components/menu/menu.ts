import { VTree } from '../_shared/tree';
import type { TreeNodeT } from '../_shared/tree';
import { isString, isUndefined } from '../_shared/is';

interface MenuNodeT extends TreeNodeT {}

export default class MenuTree extends VTree {
  constructor(value: string | number, parent: MenuNodeT | null, children: Array<MenuNodeT> = []) {
    super(value, parent, children);
  }

  addChild(opitons: { value: string; parentVal: string | undefined }) {
    const { value, parentVal } = opitons;
    const node: MenuNodeT = {
      value,
      parent: null,
      children: [],
    };

    if (isUndefined(parentVal)) {
      if (!this.hasSameNode(this.root.children, node.value)) {
        node.parent = this.root;
        this.root.children.push(node);
      }
    } else {
      const parentNode = this.getNode(this.root, parentVal);
      if (parentNode && !this.hasSameNode(parentNode.children, node.value)) {
        node.parent = parentNode;
        parentNode.children.push(node);
      }
    }
  }

  selectNode(val: string) {
    const path = this.getPath(this.root, val, []) || [];
    return path.map((node) => {
      if (isString(node.value)) {
        return node.value;
      }
    });
  }

  getSiblings(val: string) {
    const node = this.getNode(this.root, val);
    if (!node || !node.parent) {
      return [];
    }
    return node.parent.children.map((item) => {
      if (item.value !== val) {
        return item.value;
      }
    });
  }
}
