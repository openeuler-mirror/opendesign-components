<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en-US -->

## Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  variant: {
    type: 'list',
    list: ['text', 'solid'],
    default: 'text',
  },
  size: {
    type: 'list',
    list: ['small', 'medium', 'large'],
    default: 'medium',
  },
  line: {
    type: 'boolean',
    default: true,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => `
<OTab ${propsToAttrStr(props)}>
  <OTabPane label="Tab 1">Tab content 1</OTabPane>
  <OTabPane label="Tab 2">Tab content 2</OTabPane>
  <OTabPane label="Tab 3">Tab content 3</OTabPane>
</OTab>
`;

const _oCtx = {};
</script>
