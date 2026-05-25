<script setup lang="ts">
import { ref } from 'vue';
import { OLink } from '../index';
import { OIconAdd, OIconDone, OIconLink, OIconEdit, OIconDelete, OIconSearch } from '../../icon-components';

const link = '#/link';

// 测试不同字体大小（通过font-size属性）
const fontSizes = [
  { label: '小号字体', fontSize: '12px' },
  { label: '中号字体', fontSize: '24px' },
  { label: '大号字体', fontSize: '32px' },
  { label: '超大字体', fontSize: '48px' },
];

// 测试不同图标大小（通过--link-icon-size CSS变量）
const iconSizes = [
  { label: '小图标', iconSize: '12px' },
  { label: '中图标', iconSize: '24px' },
  { label: '大图标', iconSize: '32px' },
  { label: '超大图标', iconSize: '48px' },
];

// 测试不同图标数量
const iconConfigs = [
  { label: '前1个图标', prefixCount: 1, suffixCount: 0 },
  { label: '后1个图标', prefixCount: 0, suffixCount: 1 },
  { label: '前后各1个图标', prefixCount: 1, suffixCount: 1 },
  { label: '前2个图标', prefixCount: 2, suffixCount: 0 },
  { label: '后2个图标', prefixCount: 0, suffixCount: 2 },
  { label: '前后各2个图标', prefixCount: 2, suffixCount: 2 },
];

// 图标组件数组
const iconComponents = [OIconAdd, OIconDone, OIconLink, OIconEdit, OIconDelete, OIconSearch];

// 获取指定数量的图标组件
const getIcons = (count: number, startIndex = 0) => {
  return iconComponents.slice(startIndex, startIndex + count);
};

// 长文本用于测试换行
const longText = '这是一个非常长的链接文本，用于测试在文字换行时图标与字体是否能保持居中对齐。当文本长度超过容器宽度时，文字会自动换行到下一行。';
</script>

<template>
  <div class="alignment-test">
    <h3>Link组件图标与文字对齐测试</h3>

    <h4>1. 通过font-size属性设置字体大小</h4>
    <section class="test-section">
      <div v-for="item in fontSizes" :key="item.fontSize" class="test-item">
        <div class="test-label">{{ item.label }} (font-size: {{ item.fontSize }})：</div>
        <div class="test-content">
          <OLink :href="link" hover-underline :style="{ fontSize: item.fontSize, '--link-icon-size': '16px' }">
            <template #icon>
              <OIconAdd />
            </template>
            链接文本
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
        </div>
      </div>
    </section>

    <h4>2. 通过--link-icon-size CSS变量设置图标大小</h4>
    <section class="test-section">
      <div v-for="item in iconSizes" :key="item.iconSize" class="test-item">
        <div class="test-label">{{ item.label }} (--link-icon-size: {{ item.iconSize }})：</div>
        <div class="test-content">
          <OLink :href="link" hover-underline :style="{ '--link-icon-size': item.iconSize } as any">
            <template #icon>
              <OIconAdd />
            </template>
            链接文本
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
        </div>
      </div>
    </section>

    <h4>3. 不同图标数量测试</h4>
    <section class="test-section">
      <div v-for="config in iconConfigs" :key="config.label" class="test-item">
        <div class="test-label">{{ config.label }}：</div>
        <div class="test-content">
          <OLink :href="link" hover-underline :style="{ fontSize: '16px', '--link-icon-size': '20px' } as any">
            <template v-if="config.prefixCount > 0" #icon>
              <component v-for="(Icon, index) in getIcons(config.prefixCount)" :key="`prefix-${index}`" :is="Icon" class="o-rotating" />
            </template>
            链接文本
            <template v-if="config.suffixCount > 0" #suffix>
              <component v-for="(Icon, index) in getIcons(config.suffixCount, config.prefixCount)" :key="`suffix-${index}`" :is="Icon" />
            </template>
          </OLink>
        </div>
      </div>
    </section>

    <h4>4. 文字换行对齐测试</h4>
    <section class="test-section">
      <div class="test-item">
        <div class="test-label">窄容器文字换行（前图标）：</div>
        <div class="test-content narrow-container">
          <OLink :href="link" hover-underline :style="{ fontSize: '16px', '--link-icon-size': '20px' } as any">
            <template #icon>
              <OIconAdd />
              <OIconDone />
            </template>
            {{ longText }}
          </OLink>
        </div>
      </div>

      <div class="test-item">
        <div class="test-label">窄容器文字换行（后图标）：</div>
        <div class="test-content narrow-container">
          <OLink :href="link" hover-underline :style="{ fontSize: '16px', '--link-icon-size': '20px' } as any">
            {{ longText }}
            <template #suffix>
              <OIconLink />
              <OIconEdit />
            </template>
          </OLink>
        </div>
      </div>

      <div class="test-item">
        <div class="test-label">窄容器文字换行（前后图标）：</div>
        <div class="test-content narrow-container">
          <OLink :href="link" hover-underline :style="{ fontSize: '16px', '--link-icon-size': '20px' } as any">
            <template #icon>
              <OIconAdd />
              <OIconDone />
            </template>
            {{ longText }}
            <template #suffix>
              <OIconLink />
              <OIconEdit />
            </template>
          </OLink>
        </div>
      </div>
    </section>

    <h4>5. 综合测试：不同字体大小 + 不同图标大小 + 多个图标</h4>
    <section class="test-section">
      <div class="test-item">
        <div class="test-label">小字体 + 大图标 + 前后各2个图标：</div>
        <div class="test-content">
          <OLink :href="link" hover-underline :style="{ fontSize: '12px', '--link-icon-size': '20px' } as any">
            <template #icon>
              <OIconAdd />
              <OIconDone />
            </template>
            测试文本
            <template #suffix>
              <OIconLink />
              <OIconEdit />
            </template>
          </OLink>
        </div>
      </div>

      <div class="test-item">
        <div class="test-label">大字体 + 小图标 + 前后各2个图标：</div>
        <div class="test-content">
          <OLink :href="link" hover-underline :style="{ fontSize: '20px', '--link-icon-size': '12px' } as any">
            <template #icon>
              <OIconAdd />
              <OIconDone />
            </template>
            测试文本
            <template #suffix>
              <OIconLink />
              <OIconEdit />
            </template>
          </OLink>
        </div>
      </div>

      <div class="test-item">
        <div class="test-label">超大字体 + 超大图标 + 前后各2个图标：</div>
        <div class="test-content">
          <OLink :href="link" hover-underline :style="{ fontSize: '24px', '--link-icon-size': '32px' } as any">
            <template #icon>
              <OIconAdd />
              <OIconDone />
            </template>
            测试文本
            <template #suffix>
              <OIconLink />
              <OIconEdit />
            </template>
          </OLink>
        </div>
      </div>
    </section>

    <h4>6. 基线对齐验证</h4>
    <section class="test-section baseline-test">
      <div class="test-label">与普通文本混合：</div>
      <div class="test-content">
        <p>
          这是一段普通文本，中间包含
          <OLink :href="link" hover-underline>
            <template #icon>
              <OIconAdd />
            </template>
            带图标的链接
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
          继续后面的文本，验证基线是否对齐。
        </p>

        <p>
          自定义字体大小测试：
          <span style="font-size: 20px; vertical-align: baseline">大号文本</span>
          <OLink :href="link" hover-underline :style="{ fontSize: '20px', '--link-icon-size': '24px' } as any">
            <template #icon>
              <OIconAdd />
            </template>
            大号链接
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
          <span style="font-size: 20px; vertical-align: baseline">继续大号文本</span>
        </p>

        <p>
          不同图标大小测试：
          <span style="font-size: 16px; vertical-align: baseline">中号文本</span>
          <OLink :href="link" hover-underline :style="{ fontSize: '16px', '--link-icon-size': '32px' } as any">
            <template #icon>
              <OIconAdd />
            </template>
            大图标链接
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
          <span style="font-size: 16px; vertical-align: baseline">继续中号文本</span>
        </p>
      </div>
    </section>

    <h4>7. 视觉辅助线（用于目测对齐）</h4>
    <section class="test-section visual-guide">
      <div class="test-item">
        <div class="test-label">水平中线参考线（自定义字体和图标大小）：</div>
        <div class="test-content with-guide">
          <div class="guide-line"></div>
          <OLink :href="link" hover-underline :style="{ fontSize: '18px', '--link-icon-size': '22px' } as any">
            <template #icon>
              <OIconAdd />
              <OIconDone />
            </template>
            测试文本对齐
            <template #suffix>
              <OIconLink />
              <OIconEdit />
            </template>
          </OLink>
        </div>
      </div>

      <div class="test-item">
        <div class="test-label">水平中线参考线（小字体大图标）：</div>
        <div class="test-content with-guide">
          <div class="guide-line"></div>
          <OLink :href="link" hover-underline :style="{ fontSize: '14px', '--link-icon-size': '24px' } as any">
            <template #icon>
              <OIconAdd />
            </template>
            小字大图标测试
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
        </div>
      </div>

      <div class="test-item">
        <div class="test-label">水平中线参考线（大字体小图标）：</div>
        <div class="test-content with-guide">
          <div class="guide-line"></div>
          <OLink :href="link" hover-underline :style="{ fontSize: '22px', '--link-icon-size': '14px' } as any">
            <template #icon>
              <OIconAdd />
            </template>
            大字小图标测试
            <template #suffix>
              <OIconLink />
            </template>
          </OLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.alignment-test {
  padding: 20px;
  background: var(--o-color-bg2);
  border-radius: 8px;
  margin: 20px 0;
}

h3 {
  color: var(--o-color-text1);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--o-color-border2);
}

h4 {
  color: var(--o-color-text2);
  margin: 24px 0 12px 0;
}

.test-section {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--o-color-bg1);
  border-radius: 6px;
  border: 1px solid var(--o-color-border2);
  display: block;
}

.test-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.test-label {
  width: 200px;
  min-width: 200px;
  color: var(--o-color-text3);
  font-size: 14px;
  line-height: 32px;
}

.test-content {
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 32px;
}

.narrow-container {
  width: 300px;
  max-width: 300px;
  border: 1px dashed var(--o-color-border3);
  padding: 12px;
  border-radius: 4px;
  background: var(--o-color-bg2);
}

.baseline-test {
  p {
    line-height: 1.6;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.visual-guide {
  .with-guide {
    position: relative;
    padding: 20px 0;
  }

  .guide-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--o-color-danger1) 10%, var(--o-color-danger1) 90%, transparent 100%);
    opacity: 0.3;
    pointer-events: none;
    z-index: 1;
  }

  .o-link {
    position: relative;
    z-index: 2;
  }
}
</style>
