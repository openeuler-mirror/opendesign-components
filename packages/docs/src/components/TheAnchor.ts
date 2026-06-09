import { defineComponent, h, VNode, type PropType, type ComponentPublicInstance } from 'vue';
import { OAnchor, OAnchorItem } from '@opensig/opendesign';
import { renderInlineTagContent } from '@/utils/inlineTag';

type Header = { title: string; level: number; id: string; children?: Header[]; parent?: Header };

/**
 * 将标题项添加为当前节点的子节点
 * @param item - 标题项
 * @param current - 当前父节点
 * @returns 更新后的当前节点（变为 item）
 */
function addChildHeader(item: Header, current: Header): Header {
  current.children ??= [];
  current.children.push(item);
  item.parent = current;
  return item;
}

/**
 * 从当前节点回溯到合适的父节点层级
 * @param start - 当前节点
 * @param targetLevel - 目标层级
 * @returns 回溯后的当前节点
 */
function backtrackToLevel(start: Header, targetLevel: number): Header {
  let current = start;
  while (current.level > targetLevel && current.parent) {
    current = current.parent;
  }
  return current;
}

/**
 * 从平铺的标题列表构建树状结构
 * @param heads - 平铺的标题列表
 * @returns 树状结构的根节点，或 null（空列表时）
 */
function buildHeaderTree(heads: Array<{ title: string; level: number; id: string }>): Header | null {
  if (!heads.length) return null;
  const root: Header = { title: '', level: 0, id: '' };
  let current: Header = root;
  for (const _item of heads) {
    const item = { ..._item } as Header;
    if (item.level > current.level) {
      current = addChildHeader(item, current);
    } else {
      current = backtrackToLevel(current, item.level);
      if (current.parent) {
        current = addChildHeader(item, current.parent);
      }
    }
  }
  return root.children ? root : null;
}

/**
 * 将锚点数据转换为虚拟节点
 * @param heads - 锚点数据，数据结构为树状
 * @returns 虚拟节点数组，供 OAnchor 渲染
 */
const createAnchorItems = (heads: Header[]): VNode[] => {
  const children: VNode[] = [];
  for (const item of heads) {
    const titleVNodes = renderInlineTagContent(item.title, 'var(--anchor-item-sub-link-text-height)');
    if (item.children) {
      const grandChildren = createAnchorItems(item.children);
      children.push(
        h(
          OAnchorItem,
          { href: `#${item.id}` },
          {
            default: () => grandChildren,
            title: () => titleVNodes,
          },
        ),
      );
    } else {
      children.push(h(OAnchorItem, { href: `#${item.id}` }, { title: () => titleVNodes }));
    }
  }
  return children;
};

/**
 * 在锚点容器中滚动到指定链接
 * @param container - 锚点容器元素
 * @param href - 锚点链接 href
 */
function scrollToAnchorLink(container: HTMLElement | null, href: string): void {
  container?.querySelector(`.o-anchor-item-link[href="${href}"]`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });
}
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
    let anchorContainer: HTMLElement | null = null;

    const setAnchorContainer = (inst: ComponentPublicInstance | Element | null) => {
      if (!inst) return;
      anchorContainer = inst instanceof Element ? (inst as HTMLElement) : inst.$el;
    };
    const handleAnchorChange = (href: string) => scrollToAnchorLink(anchorContainer, href);
    return () => {
      // OAnchor 的默认插槽回调函数。
      // heads 变量不应在 TheAnchor 组件中访问，这会造成 TheAnchor + OAnchor 同时组件更新，
      // 而是应该封装在插槽函数中这样只更新 OAnchor 组件
      const anchorDefaultSlot = () => {
        const tree = buildHeaderTree(heads);
        if (!tree?.children) return null;
        return createAnchorItems(tree.children);
      };
      return h(
        OAnchor,
        {
          targetOffset,
          onChange: handleAnchorChange,
          ref: setAnchorContainer,
        },
        { default: anchorDefaultSlot },
      );
    };
  },
});
