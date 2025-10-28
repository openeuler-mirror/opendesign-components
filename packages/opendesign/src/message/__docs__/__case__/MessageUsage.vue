<docs lang="md">
<!-- zh-CN -->

### 内联

<!-- en-US -->

### Inline

</docs>
<script setup lang="ts">
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { propsToAttrStr } from '../../../_demo/utils';

const _oSchema = {
  status: {
    type: 'list',
    list: ['info', 'success', 'warning', 'danger', 'loading'],
    default: 'info',
  },
  closable: {
    type: 'boolean',
    default: false,
  },
  colorful: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OMessage ${propsToAttrStr(props)}>${props.status}</OMessage>`;
};

const _oCtx = {};
</script>
