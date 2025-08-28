<docs lang="md">
<!-- zh-CN -->

### 使用

下拉选项触发方式：`none`、`click`、`click-outclick`、`hover`、`hover-outclick`、`focus`、`contextmenu`；

下拉选项位置：`top`、`tl`、`tr`、`bottom`、`bl`、`br`、`left`、`lt`、`lb`、`right`、`rt`、`rb`；

<!-- en-US -->

### Usage

The triggering method of the drop-down option: `none`、`click`、`click-outclick`、`hover`、`hover-outclick`、`focus`、`contextmenu`;

Drop-down option position: `top`、`tl`、`tr`、`bottom`、`bl`、`br`、`left`、`lt`、`lb`、`right`、`rt`、`rb`;
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  trigger: {
    type: 'list',
    list: ['none', 'click', 'click-outclick', 'hover', 'hover-outclick', 'focus', 'contextmenu'],
    default: 'click',
  },
  optionPosition: {
    type: 'list',
    list: ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
    default: 'right',
  },
} satisfies Record<string, DocDemoSchema>;

const options = [
  { label: '操作一', value: 'opt1' },
  { label: '操作二', value: 'opt2' },
  { label: '操作三', value: 'opt3' },
  { label: '操作四', value: 'opt4' },
];

const createTemplate = (arr: any[] = []) => {
  if (!arr.length) {
    return '';
  }
  const res = arr
    .map((item) => {
      return `
      <ODropdownItem label="${item.label}" value="${item.value}">
        ${item.label}
      </ODropdownItem>
       `;
    })
    .join('\n');
  return res;
};
const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `<ODropdown ${propsToAttrStr(props)} style="width:fit-content;"> 
  <OButton>Dropdown</OButton>
  <template #dropdown>
  ${createTemplate(options)}
  </template>
  </ODropdown>`;
};

const _ctx = {};
</script>
