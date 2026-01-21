<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en US -->

## Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { ColorTypes, TagVariantTypes } from '@opensig/opendesign';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

const _oSchema = {
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
    list: ['large', 'medium', 'small'],
  },
  round: {
    type: 'string',
    default: 'pill',
  },
  closable: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => `
<OTag ${propsToAttrStr(_props)}>
  <template #icon><OIconAdd /></template>
  Icon Tag
</OTag>
`;

const _oCtx = {};
</script>
