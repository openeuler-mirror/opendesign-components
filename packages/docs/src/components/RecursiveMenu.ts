import { defineComponent, h, type PropType, type VNode } from 'vue';
import { OSubMenu, OMenuItem } from '@opensig/opendesign';
import { renderInlineTagContent } from '@/utils/inlineTag';
import { type NavItem } from '@/stores/sidebar';

/**
 * 递归菜单组件，根据 NavItem 数据渲染 OSubMenu / OMenuItem
 * 名称列使用 renderInlineTagContent 支持 ^[]() 注解语法渲染
 */
const RecursiveMenu = defineComponent({
  name: 'RecursiveMenu',
  props: {
    /** 菜单项值 */
    value: { type: String, required: true },
    /** 菜单项标题（含 ^[]() 注解语法） */
    label: { type: String, required: true },
    /** 子菜单项 */
    children: { type: Array as PropType<NavItem[]>, default: undefined },
  },
  setup(props) {
    return (): VNode => {
      const labelVNodes = renderInlineTagContent(props.label, 'var(--menu-text-height)');
      if (props.children?.length) {
        return h(
          OSubMenu,
          { value: props.value },
          {
            default: () => props.children!.map((item: NavItem) => h(RecursiveMenu, item)),
            title: () => labelVNodes,
          },
        );
      }
      return h(OMenuItem, { value: props.value }, { default: () => labelVNodes });
    };
  },
});

export default RecursiveMenu;
