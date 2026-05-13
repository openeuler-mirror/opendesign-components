<docs lang="md">
<!-- zh-CN -->

### 内联

注意：内联使用时，需传递一个有效（正数）的 `duration` 属性，弹出的 `toast` 才会自动隐藏。

<!-- en-US -->

### Inline

Note: When used inline, a valid (positive) `duration` attribute must be passed. Only then will the popped-up `toast` automatically disappear.
</docs>
<script setup lang="ts">
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { propsToAttrStr } from '../../../_demo/utils';

const _oSchema = {
  message: {
    type: 'string',
    default: 'toast 提示',
  },
  duration: {
    type: 'number',
    label: '持续时间',
    step: 2000,
    default: 0,
    min: 0,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OToast  ${propsToAttrStr(props)} />`;
};

const _oCtx = {};
</script>
