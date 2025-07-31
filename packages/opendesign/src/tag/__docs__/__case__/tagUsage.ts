import { propsToAttrStr } from '../../../_demo/utils';
import { ColorTypes, TagVariantTypes, TagSizeTypes } from '@opensig/opendesign';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

export const docs = {
  'zh-CN':
    'Tag组件以紧凑的视觉形式清晰标识分类、状态、属性或关键词，帮助用户快速识别内容特征。可配置项包含：  \n' +
    '- 标签颜色`color`  \n' +
    '- 标签类型`variant`  \n' +
    '- 标签尺寸`size`  \n' +
    '- 圆角值`round`  \n' +
    '- 是否可关闭`closable`  \n' +
    '- 是否可见(双向绑定)`visible`  \n' +
    '- 是否默认可见(非受控)`defaultVisible`  \n' +
    '- 关闭前的钩子函数`beforeClose`  \n' +
    '\n\n支持多色主题、自定义图标及可关闭交互，无缝融入筛选面板、数据表格、内容卡片等场景',
  'en-US':
    'The Tag component clearly identifies categories, statuses, attributes, or keywords in a compact visual form, helping users quickly identify content features. Configurable items include:  \n' +
    '- Tag color `color`  ' +
    '- Tag type `variant`  ' +
    '- Tag size `size`  ' +
    '- Border radius `round`  ' +
    '- Whether closable `closable`  ' +
    '- Visibility (two-way binding) `visible`  ' +
    '- Default visibility (uncontrolled) `defaultVisible`  ' +
    '- Hook function before closing `beforeClose`  ' +
    '\n\nSupports multi-color themes, custom icons, and closable interactions, seamlessly integrating into scenarios such as filter panels, data tables, and content cards'
};


export const schema = {
  color: {
    type: 'list',
    list: ColorTypes,
  },
  variant: {
    type: 'list',
    list: TagVariantTypes,
  },
  size: {
    type: 'list',
    list: TagSizeTypes,
  },
  round: {
    type: 'string',
    default: 'pill'
  },
  closable: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

export const template: DocDemoTemplate<typeof schema> = (_props) => {
  return `
    <OTag ${propsToAttrStr(_props)}>Tag2</OTag>
    <OTag ${propsToAttrStr(_props)}>
      <template #icon><OIconAdd /></template>
      Icon Tag
    </OTag>
  `;
};
