<docs lang="md">
<!-- zh-CN -->

### 使用

<!-- en US -->

## Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { ColorTypes, TagVariantTypes, TagSizeTypes } from '@opensig/opendesign';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

const _schema = {
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
    default: 'pill',
  },
  closable: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (_props) => `
<OTag ${propsToAttrStr(_props)}>
  <template #icon><OIconAdd /></template>
  Icon Tag
</OTag>
`;

const _ctx = {};
</script>
