<docs lang="md">
<!-- zh-CN -->

### 使用

幻灯片有两种播放效果滚动和切换

- 将 `effect` 设置为 `gallery` (默认值) 为滚动效果
- 将 `effect` 设置为 `toggle` 为切换效果

自动播放

- 将 `autoPlay` 设置为 `true` 开启自动播放
- `interval` 设置自动播放间隔时间, 默认值为 5000ms
- `pauseOnHover` 鼠标悬停时暂停播放

指示器切换

- `hideIndicator` 隐藏指示器
- `indicatorClick` 允许点击指示器切换幻灯片

箭头切换

- `arrow` 设置箭头显示方式，默认值为 `hover`
- 点击箭头可切换幻灯片

卡片点击切换： `clickToSwitch` 允许点击卡片切换幻灯片

其它：

- `manualInit` 允许手动初始化；手动初始化需要调用 `instance.init()` 完成初始化
- `activeIndex` 当前激活的幻灯片索引，可双向绑定
- `arrowWrapClass` 箭头容器类名，方便自定义箭头样式
- `indicatorWrapClass` 指示器容器类名，方便自定义指示器样式

<!-- en-US -->

### Usage

The slideshow has two playback effects: scrolling and switching.

- Set `effect` to `gallery`(default value) for a scrolling effect.
- Set `effect` to `toggle` for a switching effect.

Auto Play:

- Set `autoPlay` to `true` to enable auto-play.
- Use `interval` to set the auto-play interval time (default: 5000ms).
- `pauseOnHover` pauses playback when hovering with the mouse.

Indicator Switching:

- `hideIndicator` hides the indicators (default: `false`).
- `indicatorClick` allows switching slides by clicking indicators (default: `false`).

Arrow Switching:

- `arrow` sets how arrows are displayed (default: `hover`).
- Click arrows to switch slides.

Card Click Switching: `clickToSwitch` allows switching slides by clicking cards (default: `false`).

Others:

- `manualInit` allows manual initialization (default: `false`); manual initialization requires calling `instance.init()` to complete.
- `activeIndex` is the index of the currently active slide and supports two-way binding.
- `arrowWrapClass` is the class name for the arrow container, facilitating custom arrow styling.
- `indicatorWrapClass` is the class name for the indicator container, facilitating custom indicator styling.
</docs>

<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoTemplate, DocDemoSchema } from '../../../_demo/types';

const _schema = {
  effect: {
    type: 'list',
    list: ['gallery', 'toggle'] as const,
    default: 'gallery',
  },
  autoPlay: {
    type: 'boolean',
    default: true,
    label: 'auto play',
  },
  interval: {
    type: 'number',
    default: 5000,
    step: 1000,
    min: 1000,
    label: 'interval (ms)',
  },
  arrow: {
    type: 'list',
    list: ['always', 'hover', 'never'] as const,
    default: 'hover',
  },
  hideIndicator: {
    type: 'boolean',
    default: false,
    label: 'hide indicator',
  },
  indicatorClick: {
    type: 'boolean',
    label: 'indicator click',
  },
  pauseOnHover: {
    type: 'boolean',
    default: true,
    label: 'pause on hover',
  },
  clickToSwitch: {
    type: 'boolean',
    label: 'click to switch',
  },
} satisfies Record<string, DocDemoSchema>;

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  const { effect } = props;
  return `
<OCarousel ${propsToAttrStr(props)} class="carousel-doc-usage">
  <OCarouselItem :class="['carousel-item-content', 'item-1', ${effect === 'toggle' ? "'full'" : "'half'"}]">1</OCarouselItem>
  <OCarouselItem :class="['carousel-item-content', 'item-2', ${effect === 'toggle' ? "'full'" : "'half'"}]">2</OCarouselItem>
  <OCarouselItem :class="['carousel-item-content', 'item-3', ${effect === 'toggle' ? "'full'" : "'half'"}]">3</OCarouselItem>
</OCarousel>
`;
};

const _ctx = {};
</script>

<style lang="scss">
.carousel-doc-usage {
  height: 300px;
  overflow: hidden;
  .carousel-item-content {
    height: 100%;
    color: #fff;
    text-align: center;
    line-height: 300px;
    font-size: var(--o-font_size-h1);
    &.item-1 {
      background-color: #4e73df;
    }
    &.item-2 {
      background-color: #f6c23e;
    }
    &.item-3 {
      background-color: #e74a3b;
    }
    &.full {
      width: 100%;
    }
    &.half {
      // The width of the OCarouselItem component is slightly narrower than that of the OCarousel component,
      //   allowing adjacent slides of the active slide to be displayed.
      // When the clickToSwitch property is set to true, clicking the adjacent slides can switch to that slide.
      width: 80%;
    }
  }
}
</style>
