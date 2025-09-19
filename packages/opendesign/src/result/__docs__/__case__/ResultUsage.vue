<docs lang="md">
<!-- zh-CN -->

### 使用

1. `status` 控制展示结果的状态，有四种状态：`info`, `success`, `warning`, `danger`；
2. `title` 属性用于自定义结果展示的标题；
3. `description` 属性用于自定义对结果的补充描述；

<!-- en-US -->

1. `status` controls the status of the display result. There are four types of status: `info`, `success`, `warning`, and `danger`.
2. The `title` attribute is used to customize the title of the result display.
3. The `description` attribute is used to customize the supplementary description of the result.

### Usage
</docs>
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  title: {
    type: 'string',
    default: '提交成功',
  },
  description: {
    type: 'string',
    default: '您的申请正在审核中，请您耐心等待。',
  },
  status: {
    type: 'list',
    list: ['success', 'info', 'warning', 'danger'],
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `  <div class="demo-result-usage-wrap">
  <OResult class="demo-result-usage" ${propsToAttrStr(props)} />
   </div>
  `;
};

const _ctx = {};
</script>
