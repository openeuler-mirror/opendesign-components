<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

### Usage
</docs>
<script lang="ts" setup>
import { reactive } from 'vue';
import { SizeTypes } from '@opensig/opendesign';
import { DocDemoTemplate, DocDemoSchema } from '../../../_demo/types';
import { propsToAttrStr } from '../../../_demo/utils';

const _oSchema = {
  round: {
    type: 'list',
    list: ['var(--o-radius-l)', 'pill', '12px'],
  },
  variant: {
    type: 'list',
    list: ['solid', 'outline', 'text'],
    default: 'outline',
  },
  placeholder: {
    type: 'string',
    default: '请选择',
  },
  optionPosition: {
    type: 'list',
    list: ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
    default: 'bl',
  },
  size: {
    type: 'list',
    list: SizeTypes.filter((item) => item !== 'small'),
    default: 'large',
  },
  multiple: {
    type: 'boolean',
    default: false,
    label: '多选',
  },
  maxTagCount: {
    type: 'number',
    default: 1,
  },
  showAllLevels: {
    type: 'boolean',
    default: true,
    label: '输入框显示完整路径',
  },
  filterable: {
    type: 'boolean',
    default: true,
    label: '可搜索',
  },
  disabled: {
    type: 'boolean',
    default: false,
    label: '禁用',
  },
  loading: {
    type: 'boolean',
    default: false,
    label: '加载',
  },
  trigger: {
    type: 'list',
    list: ['click', 'hover', 'none', 'hover-outclick', 'focus', 'hover-outblur'],
    default: 'click',
  },
  clearable: {
    type: 'boolean',
    default: true,
    label: '可清除',
  },
  emitPath: {
    type: 'boolean',
    default: false,
    label: 'emitPath',
  },
  allowSelectAnyNode: {
    type: 'boolean',
    default: false,
    label: 'allowSelectAnyNode',
  },
  lazy: {
    type: 'boolean',
    default: false,
    label: 'lazy',
  },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  modelValue: undefined as any,
  lazyload: null as any,
  options: [
    {
      label: 'Option 1',
      value: '1',
      children: [
        {
          label: 'Sub-option 1-1',
          value: '1-1',
          children: [
            {
              label: 'Sub-option 1-1-1',
              value: '1-1-1',
            },
            {
              label: 'Sub-option 1-1-2 + Sub-option 1-1-2 + Sub-option 1-1-2',
              value: '1-1-2',
            },
            {
              label: 'Sub-option 1-1-3',
              value: '1-1-3',
            },
            {
              label: 'Sub-option 1-1-4',
              value: '1-1-4',
            },
            {
              label: 'Sub-option 1-1-5',
              value: '1-1-5',
            },
            {
              label: 'Sub-option 1-1-6',
              value: '1-1-6',
            },

            {
              label: 'Sub-option 1-1-7',
              value: '1-1-7',
            },
            {
              label: 'Sub-option 1-1-8',
              value: '1-1-8',
            },
            {
              label: 'Sub-option 1-1-9',
              value: '1-1-9',
            },
            {
              label: 'Sub-option 1-1-10',
              value: '1-1-10',
            },
          ],
        },
        {
          label: 'Sub-option 1-2',
          value: '1-2',
        },
        {
          label: 'Sub-option 1-3',
          value: '1-3',
        },
        {
          label: 'Sub-option 1-4',
          value: '1-4',
        },
        {
          label: 'Sub-option 1-5',
          value: '1-5',
        },
        {
          label: 'Sub-option 1-6',
          value: '1-6',
        },
        {
          label: 'Sub-option 1-7',
          value: '1-7',
        },
        {
          label: 'Sub-option 1-8',
          value: '1-8',
        },
        {
          label: 'Sub-option 1-9',
          value: '1-9',
        },
        {
          label: 'Sub-option 1-10',
          value: '1-10',
        },
      ],
    },
    {
      label: 'Option 2',
      value: '2',
      children: [
        {
          label: 'Sub-option 2.1',
          value: '2.1',
          children: {
            label: 'Sub-option 2-1-3',
            value: '2.1.1',
          },
        },
        {
          label: 'Sub-option 2.2',
          value: '2.2',
        },
      ],
    },
    {
      label: 'Option 3',
      value: '3',
    },
    {
      label: 'Option 4',
      value: '4',
      disabled: true,
    },
    {
      label: 'Option 5',
      value: '5',
    },
    {
      label: 'Option 6',
      value: '6',
    },
    {
      label: 'Option 7',
      value: '7',
    },
    {
      label: 'Option 8',
      value: '8',
    },
    {
      label: 'Option 9',
      value: '9',
    },
    {
      label: 'Option 10',
      value: '10',
    },
  ],
});

const _findNode = (opts: any[], val: string | number): any => {
  for (const opt of opts) {
    if (opt.value === val) return opt;
    if (Array.isArray(opt.children)) {
      const found = _findNode(opt.children, val);
      if (found) return found;
    }
  }
  return null;
};

_oCtx.lazyload = (node: { value: string | number | null }, resolve: (data: any[]) => void) => {
  setTimeout(() => {
    const toItem = (opt: any) => ({
      value: opt.value,
      label: opt.label,
      disabled: opt.disabled,
      leaf: !Array.isArray(opt.children) || opt.children.length === 0,
    });
    if (node.value === null) {
      resolve(_oCtx.options.map(toItem));
    } else {
      const found = _findNode(_oCtx.options, node.value);
      resolve(Array.isArray(found?.children) ? found.children.map(toItem) : []);
    }
  }, 800);
};

let _prevMultiple: boolean = _oSchema.multiple.default;
let _prevEmitPath: boolean = _oSchema.emitPath.default;
let _prevLazy: boolean = _oSchema.lazy.default;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  let shouldReset = false;
  if (props.multiple !== _prevMultiple) {
    _prevMultiple = props.multiple;
    shouldReset = true;
  }
  if (props.emitPath !== _prevEmitPath) {
    _prevEmitPath = props.emitPath;
    shouldReset = true;
  }
  if (props.lazy !== _prevLazy) {
    _prevLazy = props.lazy;
    shouldReset = true;
  }
  if (shouldReset) {
    _oCtx.modelValue = props.multiple ? [] : undefined;
  }
  const dataSource = props.lazy ? ':lazyload="ctx.lazyload"' : ':options="ctx.options"';
  return `
    <div class="demo-cascader-v2-usage-wrap">
      <OCascaderV2
        v-model="ctx.modelValue"
        ${dataSource}
        ${propsToAttrStr(props)}
        class="demo-cascader-v2-usage"
      />
    </div>
<p>Selected: </p>
<pre>{{ ctx.modelValue }}</pre>
`;
};
</script>

<style lang="scss">
.demo-cascader-v2-usage-wrap {
  .demo-cascader-v2-usage {
    width: 100%;
    max-width: 320px;
  }
}

.o-cascader-v2-panel {
  --cascader-v2-panel-empty-min-width: 320px;
}
</style>
