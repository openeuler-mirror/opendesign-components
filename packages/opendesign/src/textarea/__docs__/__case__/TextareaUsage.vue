<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

### Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { reactive } from 'vue';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

const _oCtx = reactive({
  modelValue: 'this is value',
});

const _oSchema = {
  placeholder: {
    type: 'string',
    default: 'input something',
  },
  disabled: {
    type: 'boolean',
    default: false,
  },
  readonly: {
    type: 'boolean',
    default: false,
  },
  clearable: {
    type: 'boolean',
    default: true,
  },
  rows: {
    type: 'number',
    default: 4,
  },
  cols: {
    type: 'number',
    default: undefined,
  },
  resize: {
    type: 'list',
    list: ['both', 'horizontal', 'h', 'vertical', 'v', 'none'] as const,
  },
  minLength: {
    type: 'number',
    default: 0,
  },
  maxLength: {
    type: 'number',
    default: 100,
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
    default: '4px',
  },
  color: {
    type: 'list',
    list: ['normal', 'success', 'warning', 'danger'] as const,
  },
  variant: {
    type: 'list',
    list: ['solid', 'outline', 'text'] as const,
    default: 'outline',
  },
  showLength: {
    type: 'list',
    list: ['always', 'auto', 'never'],
    default: 'never',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => {
  return `<OTextarea ${propsToAttrStr(_props)} v-model="ctx.modelValue"/>`;
};
</script>
