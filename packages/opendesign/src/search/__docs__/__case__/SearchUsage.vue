<docs lang="md">
<!-- zh-CN -->

### 使用

传递有效的 `suggesstions` 属性可以使得搜索框具有联想功能；

通过 `showProfixSelect` 、`showSuffixSelect` 属性控制头部筛选框与尾部筛选框的显示状态；

通过插槽 `prefix-of-search-prefix`、`prefix-of-search-suffix` 来控制头/尾部筛选框的前缀插槽。

<!-- en-US -->

### Usage

Passing the valid "suggestions" attribute can enable the search box to have the associative function.

The display status of the header filter box and the footer filter box is controlled by the `showProfixSelect` and `showSuffixSelect` attributes.

The prefix slots `prefix-of-search-prefix` and `prefix-of-search-suffix` are used to control the prefix slots of the head/tail filter boxes.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { propsToAttrStr } from '../../../_demo/utils';
import { OIconCalendar } from '../../../icon-components';

const _oSchema = {
  placeholderOfPrefixSelect: {
    type: 'string',
    default: '筛选',
    label: '头部筛选框占位词',
  },
  placeholderOfSuffixSelect: {
    type: 'string',
    default: '筛选',
    label: '尾部筛选框占位词',
  },
  placeholder: {
    type: 'string',
    default: '搜索',
    label: '输入框占位词',
  },
  showPrefixSelect: {
    type: 'boolean',
    label: '显示头部筛选框',
  },
  showSuffixSelect: {
    type: 'boolean',
    label: '显示尾部筛选框',
  },
  size: {
    type: 'list',
    list: ['xlarge', 'large', 'medium'],
    label: '尺寸',
  },
  clearable: {
    type: 'boolean',
    label: '快速清除',
  },
  disabled: {
    type: 'boolean',
    label: '禁用',
  },
} satisfies Record<string, DocDemoSchema>;

const prefixOptions = [
  {
    label: '+86(中国)',
    value: '+86(中国)',
  },
  {
    label: '+81(日本)',
    value: '+81(日本)',
  },
  {
    label: '+82(韩国)',
    value: '+82(韩国)',
  },
];

const suffixOptions = [
  {
    label: '.com',
    value: '.com',
  },
  {
    label: '.cn',
    value: '.cn',
  },
  {
    label: '.net',
    value: '.net',
  },
];

const suggesstions = [
  { label: 'Vue3组合Vue式APIVue3组合Vue式API', value: 'Vue3组合Vue式APIVue3组合Vue式API' },
  { label: 'JavaScript高级JavaScript语JavaScript', value: 'JavaScript高级JavaScript语JavaScript' },
  { label: 'ESLint配置ESL教ESL程', value: 'ESLint配置ESL教ESL程' },
  { label: 'Vue2选项式API', value: 'Vue2选项式API' },
];

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OSearch v-model="ctx.inputVal" 
  :optionsOfPrefixSelect="ctx.prefixOptions"
  :optionsOfSuffixSelect="ctx.suffixOptions"
  :suggesstions="ctx.suggesstions"
  ${propsToAttrStr(props)} >
    <template #prefix-of-search-prefix>
      <OIconCalendar />
    </template>
  </OSearch>`;
};

const _oCtx = reactive({
  inputVal: '',
  prefixOptions,
  suffixOptions,
  suggesstions,
});
</script>
