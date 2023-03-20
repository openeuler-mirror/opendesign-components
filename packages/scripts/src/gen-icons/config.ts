import type { Config, PluginConfig } from 'svgo';

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
export const basePlugins:PluginConfig[] = [
  {
    name: 'preset-default',
    params: {
      overrides: {
        // 不移除view-box属性
        removeViewBox: false,
        cleanupIds: false
      },
    },
  },
  'removeStyleElement',
  'removeScriptElement',
  'removeDimensions',
  'sortAttrs',
  'removeUselessStrokeAndFill',

  {
    name: 'addAttributesToSVGElement',
    params: {
      attributes: [
        { ':class': 'classnames' },
      ],
    },
  },
];
const fillSvgoConfig: Config = {
  plugins: [
    ...basePlugins,
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
          'fill',
        ],
      },
    }
  ],
};
const strokeSvgoConfig: Config = {
  plugins: [
    ...basePlugins,
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
          'stroke',
        ],
      },
    }
  ],
};
const colorSvgoConfig: Config = {
  plugins: [
    ...basePlugins,
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'class',
        ],
      },
    },
  ]
};

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
