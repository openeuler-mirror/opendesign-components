import { propsToAttrStr } from '../../../_demo/utils';
import { reactive } from 'vue';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

export const docs = {
  'zh-CN':
    '文本域是常见的表单类输入组件，提供了较长文本输入和查看的能力，可设置项如下：  \n' +
    '- 提示文本`placeholder`  \n' +
    '- 是否禁用`disabled`  \n' +
    '- 是否只读`readonly`  \n' +
    '- 是否可以清除`clearable`  \n' +
    '- 显示的行数`rows`  \n' +
    '- 显示的列数`cols`  \n' +
    '- 是否支持调整尺寸`resize`  \n' +
    '- 最小字符长度`minLength`  \n' +
    '- 最大字符长度`maxLength`  \n' +
    '- 超过最大字符长度时是否允许输入`inputOnOutlimit`  \n' +
    '- 根据内容自动计算高度`autoSize`  \n' +
    '- 大小`size`  \n' +
    '- 圆角值`round`  \n' +
    '- 颜色类型`color`  \n' +
    '- 按钮类型`variant`  \n' +
    '\n\n更多的可配置参数参考下方API小节',
  'en-US':
    'Textarea is a common form input component that provides capabilities for inputting and viewing longer text. Configurable items include:  \n' +
    '- Prompt text `placeholder`  \n' +
    '- Disabled state `disabled`  \n' +
    '- Readonly state `readonly`  \n' +
    '- Clearable option `clearable`  \n' +
    '- Number of displayed rows `rows`  \n' +
    '- Number of displayed columns `cols`  \n' +
    '- Resize support `resize`  \n' +
    '- Minimum character length `minLength`  \n' +
    '- Maximum character length `maxLength`  \n' +
    '- Input allowance beyond max length `inputOnOutlimit`  \n' +
    '- Auto height calculation based on content `autoSize`  \n' +
    '- Size `size`  \n' +
    '- Corner roundness `round`  \n' +
    '- Color type `color`  \n' +
    '- Button style variant `variant`  \n' +
    '\n\nFor more configurable parameters, refer to the API section below.'
};

export const ctx = reactive({
  modelValue: 'this is value'
});

export const schema = {
  placeholder: {
    type: 'string',
    default: 'input something'
  },
  disabled: {
    type: 'boolean',
    default: false
  },
  readonly: {
    type: 'boolean',
    default: false
  },
  clearable: {
    type: 'boolean',
    default: true
  },
  rows: {
    type: 'number',
    default: undefined,
  },
  cols: {
    type: 'number',
    default: undefined,
  },
  resize: {
    type: 'list',
    list: ['both', 'horizontal', 'h', 'vertical', 'v', 'none'] as const
  },
  minLength: {
    type: 'number',
    default: 0
  },
  maxLength: {
    type: 'number',
    default: 100
  },
  inputOnOutlimit: {
    type: 'boolean',
    default: true,
  },
  autoSize: {
    type: 'boolean',
    default: undefined,
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'] as const,
  },
  round: {
    type: 'string',
    default: 'pill'
  },
  color: {
    type: 'list',
    list: ['normal', 'success', 'warning', 'danger'] as const,
  },
  variant: {
    type: 'list',
    list: ['solid', 'outline', 'text'] as const,
  },
} satisfies Record<string, DocDemoSchema>;

export const template: DocDemoTemplate<typeof schema> = (_props) => {
  return `<OTextarea ${propsToAttrStr(_props)} v-model="ctx.modelValue"/>`;
};
