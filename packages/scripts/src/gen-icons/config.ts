import type { Config } from 'svgo';

export interface IconsConfig {
  svgo: {
    fill: Config,
    stroke: Config,
    color: Config,
  },
  input: string,
  output: string,
  template: typeof template
}

const baseSvgoConfig: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 不移除view-box属性
          removeViewBox: false,
        },
      },
    },
    'removeStyleElement',
    'removeScriptElement',
    'removeDimensions',
    'sortAttrs',
    'removeUselessStrokeAndFill',
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
        ],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { ':class': 'classnames' },
        ],
      },
    },
  ],
};
const fillSvgoConfig: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 不移除view-box属性
          removeViewBox: false,
        },
      },
    },
    'removeStyleElement',
    'removeScriptElement',
    'removeDimensions',
    'sortAttrs',
    'removeUselessStrokeAndFill',
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
          'fill',
        ],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { ':class': 'classnames' },
        ],
      },
    },
  ],
};
const strokeSvgoConfig: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 不移除view-box属性
          removeViewBox: false,
        },
      },
    },
    'removeStyleElement',
    'removeScriptElement',
    'removeDimensions',
    'sortAttrs',
    'removeUselessStrokeAndFill',
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
          'stroke',
        ],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { ':class': 'classnames' },
        ],
      },
    },
  ],
};
const colorSvgoConfig = baseSvgoConfig;

const template = ({ name, componentName, svg, type }: { name: string, componentName: string, svg: string, type: 'fill' | 'stroke' | 'color' }) => {
  return `<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '${componentName}',
  svgType: '${type}',
  setup() {
    const classnames = ['o-icon', '${name}', 'type-${type}'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  ${svg}
</template>`;
};

export const defaultConfig: IconsConfig = {
  svgo: {
    color: colorSvgoConfig,
    stroke: strokeSvgoConfig,
    fill: fillSvgoConfig,
  },
  input: './src/icons/svgs',
  output: './src/components/icons/',
  template,
};
