<docs lang="md">
<!-- zh-CN -->

### 使用

两种尺寸：`small`、`medium`；

通过 `accordion` 属性开启手风琴模式；

通过 `expanded` 属性控制展开的节点值；

通过 `OSubMenu` 的 `icon` 控制菜单的图标。注意：`small` 尺寸的 `OMenu` 不支持自定义图标；

通过 `selectable` 可以控制 `OSubMenu` 本身是否可以被选中；

通过 CSS 变量 `--menu-item-base-indent`、`--sub-menu-base-indent` 控制层级缩进距离。

**注意**：`OSubMenu` 不支持 `disabled` 状态。若子菜单项需要呈现为禁用态，请改用 `OMenuItem` 的 `disabled` 属性来渲染。

<!-- en-US -->

### Usage

Two sizes: `small`, `medium`;

Enable accordion mode through the `accordion` prop;

Control expanded node values through the `expanded` prop;

Control the menu icon through the `icon` prop of `OSubMenu`. Note: `OMenu` in `small` size does not support custom icons;

Control whether `OSubMenu` itself is selectable through the `selectable` prop;

Control level indentation distance through CSS variables `--menu-item-base-indent` and `--sub-menu-base-indent`.

**Note**: `OSubMenu` does not support the `disabled` state. If a sub-menu item needs to appear disabled, use `OMenuItem` with the `disabled` prop instead.
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
    list: ['right', 'left'],
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
