import { propsToAttrStr } from '../../../_demo/utils';
import './style.scss';

// 该导出会作为该使用示例的文案，文案是markdown格式
export const docs = {
  'zh-CN':
    '虚拟滚动用于控制列表中渲染项目的数量以达到优化渲染性能的目的。可设置项包含：  \n' +
    '- 列表数据`list`  \n' +
    '- 默认滚动到第几项`defaultStartIndex`  \n' +
    '- 每一项高度`itemSize`  \n' +
    '- 不定高时每一项的默认高度`defaultItemSize`  \n' +
    '- 前后预留空白`buffer`  \n' +
    '- scrollbar行为`scrollbar`等',
  'en-US':
    'Virtual scrolling is used to control the number of rendered items in a list to optimize rendering performance.Configurable options include:  \n' +
    '- list: the list data to render  \n' +
    '- defaultStartIndex: sets the default initial scroll position item  \n' +
    '- itemSize: defines the height of each item  \n' +
    '- defaultItemSize: specifies the default item height for variable-height items  \n' +
    '- buffer: sets front/render buffer padding  \n' +
    '- scrollbar: controls scrollbar behavior',
};

export const ctx = {
  list: new Array(100).fill(0).map((_, i) => ({ label: i + 1 }))
};

export const template = (_props: Record<string, any>) => {
  return `<OVirtualList class="virtual-list-demo container" ${propsToAttrStr(_props)} :list="ctx.list">
  <template  #default="{ item, index }">
    <div :key="item.label" class="section" :class="\`item-\${index + 1}\`">
      <span>Row:</span> <span>{{ item.label }}</span>------<span>Height:</span> <span>80px</span>
    </div>
  </template>
</OVirtualList>`;
};

export const schema = {
  defaultStartIndex: {
    type: 'number',
    default: 10
  },
  itemSize: {
    type: 'number',
    default: 80
  },
  buffer: {
    type: 'number',
    default: 1,
  },
};