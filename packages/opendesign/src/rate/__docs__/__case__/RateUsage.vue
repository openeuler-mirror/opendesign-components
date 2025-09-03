<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

## Usage
</docs>

<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  count: {
    type: 'number',
    default: 5,
    min: 1,
  },
  size: {
    type: 'list',
    list: ['medium', 'large'],
    default: 'large',
  },
  color: {
    type: 'list',
    list: ['normal', 'primary', 'success', 'warning', 'danger'],
  },
  allowHalf: {
    type: 'boolean',
    default: false,
  },
  clearable: {
    type: 'boolean',
    default: false,
  },
  readonly: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => `
<ORate ${propsToAttrStr(props)} :default-value="1"></ORate>
`;

const _ctx = {};
</script>
