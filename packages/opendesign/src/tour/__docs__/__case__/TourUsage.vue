<docs lang="md">
<!-- zh-CN -->

### 基本用法

最基本的漫游引导用法。点击按钮开启引导，依次引导用户浏览各功能区域。引导卡片默认以模态遮罩模式展示，用户只能与当前引导步骤交互。设置 `:mask="false"` 关闭遮罩进入非模态模式。

<!-- en-US -->

### Basic Usage

The most basic usage of the tour component. Click the button to start the guided tour, sequentially guiding users through each functional area. The guide card is displayed in modal mask mode by default, allowing users to interact only with the current step. Set `:mask="false"` to disable the mask for non-modal mode.
</docs>
<script setup lang="ts">
import { reactive, markRaw } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  mask: {
    type: 'boolean',
    default: true,
  },
  position: {
    type: 'list',
    list: ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
  },
  spotlightRadius: {
    type: 'list',
    list: ['8px', 'pill'],
    default: '8px',
  },
  showArrow: {
    type: 'boolean',
    default: true,
  },
  showClose: {
    type: 'boolean',
    default: true,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<div class="tour-doc-usage">
  <OButton @click="ctx.handleClick">开启引导</OButton>
  <div class="tour-doc-targets">
    <div id="tour-step1" class="tour-doc-block">区域一</div>
    <div id="tour-step2" class="tour-doc-block">区域二</div>
    <div id="tour-step3" class="tour-doc-block">区域三</div>
  </div>
  <OTour v-model:visible="ctx.show" ${propsToAttrStr(props)}>
    <OTourStep target="#tour-step1" title="步骤一" detail="这是第一步的描述" />
    <OTourStep target="#tour-step2" title="步骤二" detail="这是第二步的描述" />
    <OTourStep target="#tour-step3" title="步骤三" detail="这是第三步的描述" />
  </OTour>
</div>`;
};

const _oCtx = reactive({
  show: false,
  handleClick: markRaw(() => {
    _oCtx.show = true;
  }),
});
</script>

<style lang="scss">
.tour-doc-targets {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}
.tour-doc-block {
  padding: 16px;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-m);
  background: var(--o-color-fill1);
  text-align: center;
  font-size: var(--o-font_size-text1);
  color: var(--o-color-info2);
}
</style>
