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
    list: ['text', 'button', 'solid'],
    default: 'text',
  },
  size: {
    type: 'list',
    list: ['small', 'medium', 'large'],
    default: 'medium',
  },
  round: {
    type: 'list',
    list: ['pill', '12px', 'var(--o-radius-l)'],
  },
  line: {
    type: 'boolean',
    default: true,
    disabled: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  if (props.variant === 'button') {
    props.line = undefined;
    _oSchema.line.disabled = true;
  } else {
    _oSchema.line.disabled = false;
  }

  return `
<div class="tab-demo-container">
  <OTab ${propsToAttrStr(props)}>
    <OTabPane label="Tab 1">Tab content 1</OTabPane>
    <OTabPane label="Tab 2">Tab content 2</OTabPane>
    <OTabPane label="Tab 3">Tab content 3</OTabPane>
  </OTab>
</div>
`;
};

const _oCtx = {};
</script>

<style lang="scss">
.tab-demo-container {
  background-color: var(--o-color-fill2);
  padding: 16px;
}
</style>
