<docs lang="md">
<!-- zh-CN -->

### 使用

通过 `showStops` 切换间续滑动条；

通过 `showInput` 显示输入框；

通过 `disabled` 禁用滚动条；

通过 `max`、`min` 控制最大值、最小值；

通过 `step` 控制每一分段值；

通过 `showPopover` 控制气泡的渲染；

注意：暂不支持垂直方向滑动条；

<!-- en-US -->

### Usage

Switch the intermittent slider by using `showStops`.

Display the input box through `showInput`.

Disable the scroll bar by using `disabled`.

Control the maximum and minimum values through `max` and `min`.

Control each segment value through the `step` parameter;

The rendering of the bubble is controlled by the `showPopover` function;

Note: Vertical sliding bars are not currently supported.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  step: {
    type: 'number',
    default: 10,
  },
  min: {
    type: 'number',
    default: 0,
  },
  max: {
    type: 'number',
    default: 100,
  },
  showStops: {
    type: 'boolean',
    label: '显示间隔',
  },
  showInput: {
    type: 'boolean',
    label: '显示输入框',
  },
  disabled: {
    type: 'boolean',
    label: '禁用',
  },
  showPopover: {
    type: 'boolean',
    label: '显示气泡',
    default: true,
  },
  unit: {
    type: 'string',
    label: '输入框单位',
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  if (props.disabled) {
    _oCtx.sliderVal = 0;
  }
  return `
    <div class="demo-slider-usage-wrap">
      <OSlider v-model="ctx.sliderVal" ${propsToAttrStr(props)}/>
    </div>
  `;
};

const _oCtx = reactive({
  sliderVal: 0,
});
</script>
<style lang="scss">
.demo-slider-usage-wrap {
  width: 360px;

  @include respond('<=pad_v') {
    width: 100%;
  }
}
</style>
