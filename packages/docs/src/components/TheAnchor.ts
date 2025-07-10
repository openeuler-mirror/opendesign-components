import { defineComponent, h, VNode, type PropType } from 'vue';
import { OAnchor, OAnchorItem } from '@opensig/opendesign';

type Header = { title: string; level: number; id: string; children?: Header[]; parent?: Header };
/**
 * 将锚点数据转换为虚拟节点
 * @param heads 锚点数据，数据结构为树状
 * @returns 虚拟节点数组，供OAnchor渲染
 */
const createAnchorItems = (heads: Header[]): VNode[] => {
  const children: VNode[] = [];
  for (const item of heads) {
    if (item.children) {
      const grandChildren = createAnchorItems(item.children);
      children.push(h(OAnchorItem, { href: `#${item.id}`, title: item.title }, { default: () => grandChildren }));
    } else {
      children.push(h(OAnchorItem, { href: `#${item.id}`, title: item.title }));
    }
  }
  return children;
};
/**
 * TheAnchor组件，传入Array<{ title: string; level: number; id: string }>，使用OAnchor与OAnchorItem渲染锚点
 */
export default defineComponent({
  name: 'TheAnchor',
  props: {
    /** 锚点数据 */
    heads: {
      type: Array as PropType<Array<{ title: string; level: number; id: string }>>,
      default: () => [],
    },
    /** 滚动偏移量 */
    targetOffset: {
      type: Number,
      default: 0,
    },
  },

  setup({ heads, targetOffset }) {
    return () => {
      if (!heads.length) {
        return null;
      }
      const root: Header = {
        title: '',
        level: 0,
        id: '',
      };
      let current: Header = root;
      // 锚点数据从平铺结构构造为树状结构，以便生成VNode
      for (const _item of heads) {
        // 浅拷贝数据，避免此处修改响应式对象而造成组件意外更新
        const item = { ..._item } as Header;
        if (item.level > current.level) {
          current.children = current.children || [];
          current.children.push(item);
          item.parent = current;
          current = item;
        } else {
          while (current.level > item.level && current.parent) {
            current = current.parent;
          }
          if (current && current.parent) {
            current.parent.children = current.parent.children || [];
            current.parent.children.push(item);
            item.parent = current.parent;
            current = item;
          }
        }
      }
      if (!root.children) {
        return null;
      }
      const vNodes = createAnchorItems(root.children);
      return h(OAnchor, { targetOffset }, { default: () => vNodes });
    };
  },
});
