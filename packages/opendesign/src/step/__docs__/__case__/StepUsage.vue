<docs lang="md">
<!-- zh-CN -->

### 使用

步骤条状态通过`status`控制，`finished`表示已完成，`process`表示进行中，`wait`表示未开始；

步骤条标题通过`title`控制；

步骤条辅助内容通过`desc`控制；

步骤条标识通过`stepIndex`控制，注意，此属性必传且需连续；

可以通过属性`icon`控制内部图标的展示；

步骤条的方向通过给`Step`组件传递`direction`属性整体控制，`h`表示水平方向，未默认值，`v`表示垂直方向。

<!-- en-US -->

### Usage

The status of the progress bar is controlled by the `status` parameter. `finished` indicates that it is completed, `process` indicates that it is in progress, and `wait` indicates that it has not started.

The title of the progress bar is controlled by `title`.

The auxiliary content of the progress bar is controlled by `desc`.

The step bar identifier is controlled by the `stepIndex` property. Note that this attribute must be provided and must be consecutive.

The display of the internal icon can be controlled by the attribute `icon`.

The direction of the progress bar is controlled globally by passing the `direction` attribute to the `Step` component. `h` represents the horizontal direction and has no default value, while `v` represents the vertical direction.
</docs>
<script setup lang="ts">
import { StepItemStatusTypes } from '@opensig/opendesign';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  direction: {
    type: 'list',
    list: ['h', 'v'],
  },
  status: {
    type: 'list',
    list: StepItemStatusTypes,
  },
  title: {
    type: 'string',
    default: '步骤一',
  },
  description: {
    type: 'string',
    default: '辅助信息文本',
  },
  icon: {
    type: 'boolean',
    default: true,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `  <div class="demo-step-usage-wrap">
    <OStep ${propsToAttrStr(props, ['status', 'description', 'icon', 'title'])}>
      <OStepItem v-for="i in 3" ${propsToAttrStr(props, ['direction'])} :step-index="i-1" style="min-height: 80px"/>
    </OStep>
  </div>`;
};

const _oCtx = {};
</script>
