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
  title: {
    type: 'string',
    default: '标题',
  },
  content: {
    type: 'textarea',
    default: '指定消息出现在目标元素的 top（顶部）或 bottom（底部）',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OMessage ${propsToAttrStr(props)}>${props.content}</OMessage>`;
};

const _oCtx = {};
</script>
