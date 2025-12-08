<docs lang="md">
<!-- zh-CN -->

### 使用

通过 `label` 属性控制 loading 时显示的文本；

通过 `icon` 属性自定义 loading 时的图标；

通过 `iconRotating` 属性控制自定义的 loading 图标是否旋转；

其它属性的使用详见[OLayer](/zh-CN/components/layer#使用)。

<!-- en-US -->

Control the text displayed during loading through the `label` attribute;

Customize the icon at loading through the `icon` attribute;

Control whether the custom loading icon rotates through the `iconRotating` property;

For the usage of other attributes, please refer to [OLayer](/zh-CN/components/layer#usage).

### Usage
</docs>
<script setup lang="ts">
import { reactive, markRaw } from 'vue';
import { OIconAdd } from '@opensig/opendesign';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

interface UsageT {
  visible: boolean;
  handleLoading(): void;
  customIcon: null | typeof OIconAdd;
}
const _oSchema = {
  label: {
    type: 'string',
    default: '加载中...',
  },
  'icon(slot)': {
    type: 'boolean',
  },
  iconRotating: {
    type: 'boolean',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  const { 'icon(slot)': iconSlot } = props;
  if (iconSlot) {
    _oCtx.customIcon = markRaw(OIconAdd);
  } else {
    _oCtx.customIcon = null;
  }

  return `  <OButton @click="ctx.handleLoading">Click to load</OButton>
  <OLoading v-model:visible="ctx.visible" :icon='ctx.customIcon' ${propsToAttrStr(props, ['icon(slot)'])} />`;
};

const handleLoading = () => {
  _oCtx.visible = true;
  setTimeout(() => {
    _oCtx.visible = false;
  }, 2000);
};
const _oCtx = reactive<UsageT>({
  visible: false,
  handleLoading,
  customIcon: null,
});
</script>
