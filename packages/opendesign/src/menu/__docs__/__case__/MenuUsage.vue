<docs lang="md">
<!-- zh-CN -->

### 使用

两种尺寸：`small`、`medium` ；

通过 `accordion` 属性开启手风情模式；

通过 `expanded` 属性控制展开的节点值；

通过 `subMenu` 的 `icon` 控制菜单的图标。注意：`small` 尺寸的 `menu` 不支持自定义图标；

通过 `selectable` 可以控制 `subMenu` 本身是否可以被选中；

通过css变量 `--menu-item-base-indent`、`--sub-menu-base-indent` 控制层级缩进距离。

<!-- en-US -->

### Usage

Two sizes: `small`, `medium`;

Enable the hand style mode through the `accordion` attribute;

Control the expanded node value through the `expanded` attribute;

Control the icon of the menu through the `icon` of the `subMenu`. Note: that the `small` size `menu` does not support custom ICONS;

You can control whether the `subMenu` itself can be selected through `selectable`;

Control the level indentation distance through the css variable `--menu-item-base-indent` and `--sub-menu-base-indent`.
</docs>
<script setup lang="ts">
import { reactive, resolveComponent, type Component, shallowRef } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const DocIconMenu = shallowRef(resolveComponent('DocIconMenu') as Component);
const _oCtx = reactive({
  selected: '2-1',
  expanded: ['2', '2-2', '2-2-2'],
  DocIconMenu,
});

const _oSchema = {
  size: {
    type: 'list',
    list: ['medium', 'small'],
  },
  arrowPosition: {
    type: 'list',
    list: ['right', 'left' ],
  },
  accordion: {
    type: 'boolean',
    default: false,
  },
  expanded: {
    type: 'string',
    disabled: true,
  },
  selected: {
    type: 'string',
    disabled: true,
  },
  selectable: {
    type: 'boolean',
  },
  'icon(slot)': {
    type: 'boolean',
    default: true,
  },
  subMenuBaseIndent: {
    type: 'number',
    default: 32,
    step: 2,
  },
  menuItemBaseIndent: {
    type: 'number',
    default: 32,
    step: 2,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  const { 'icon(slot)': iconSlot, selectable, subMenuBaseIndent, menuItemBaseIndent } = props;

  const vBindIcon = iconSlot ? ':icon="ctx.DocIconMenu"' : '';
  const cssStyle = `--sub-menu-base-indent:${subMenuBaseIndent}px;--menu-item-base-indent:${menuItemBaseIndent}px`;

  props.selected = _oCtx.selected;
  props.expanded = _oCtx.expanded.join(';');

  return `<OMenu v-model="ctx.selected" v-model:expanded="ctx.expanded" ${propsToAttrStr(props, ['icon(slot)', 'selectable', 'expanded', 'selected', 'subMenuBaseIndent', 'menuItemBaseIndent'])} >
      <OSubMenu ${vBindIcon} :selectable=${selectable} value="1">
        <template #title>Sub menu 1</template>
        <OMenuItem value="1-1" style=${cssStyle}>Item 1-1</OMenuItem>
        <OMenuItem value="1-2" style=${cssStyle}>Item 1-2</OMenuItem>
      </OSubMenu>
      <OSubMenu ${vBindIcon} :selectable=${selectable} value="2">
        <template #title>Sub menu 2</template>
        <OMenuItem value="2-1" style=${cssStyle}>Item 2-1</OMenuItem>
        <OSubMenu ${vBindIcon} :selectable=${selectable} value="2-2" style=${cssStyle}>
          <template #title>Sub menu 2-2</template>
          <OMenuItem value="2-2-1" disabled style=${cssStyle}>Item 2-2-1</OMenuItem>
          <OSubMenu ${vBindIcon} :selectable=${selectable} value="2-2-2" style=${cssStyle}>
            <template #title>Sub menu 2-2-2这是溢出隐藏的效果展示这是溢出隐藏的效果展示</template>
            <OMenuItem value="2-2-2-1" style=${cssStyle}>Item 2-2-2-1这是溢出隐藏的效果展示这是溢出隐藏的效果展示</OMenuItem>
          </OSubMenu>
        </OSubMenu>
      </OSubMenu>
      <OMenuItem ${vBindIcon} :selectable=${selectable} value="3">Item 3</OMenuItem>
    </OMenu>`;
};
</script>
