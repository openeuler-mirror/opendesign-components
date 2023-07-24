import type { Config, PluginConfig } from 'svgo';

export interface IconsConfig {
  svgo: {
    fill: Config;
    stroke: Config;
    color: Config;
  };
  input: string;
  output: string;
  prefix: string; // 'o-'
  componentClass: string;
  template: typeof template;
}
export const basePlugins: PluginConfig[] = [
  {
    // 将id添加到class
    name: 'addClassesbyId',
    fn: () => {
      const nodes: string[] = ['*'];
      return {
        element: {
          enter: (node) => {
            if (nodes.includes('*') || nodes.includes(node.name)) {
              const classname = node.attributes.class || '';
              const id = node.attributes.id || '';
              const cls = classname.split(' ');
              cls.push(id);
              const classStr = cls.join(' ').trim();
              if (classStr) {
                node.attributes.class = classStr;
              }
            }
          },
        },
      };
    },
  },
  {
    name: 'preset-default',
    params: {
      overrides: {
        // 不移除view-box属性
        removeViewBox: false,
      },
    },
  },
  // 'prefixIds',
  'removeStyleElement',
  'removeScriptElement',
  'removeDimensions',
  'sortAttrs',
  'removeUselessStrokeAndFill',
  'removeXMLNS',
  {
    name: 'addAttributesToSVGElement',
    params: {
      attributes: [{ ':class': 'classnames' }],
    },
  },
];
const fillSvgoConfig: Config = {
  plugins: [
    ...basePlugins,
    {
      name: 'removeAttrs',
      params: {
        attrs: ['svg:class', 'fill'],
      },
    },
  ],
};
const strokeSvgoConfig: Config = {
  plugins: [
    ...basePlugins,
    {
      name: 'removeAttrs',
      params: {
        attrs: ['svg:class', 'stroke'],
      },
    },
  ],
};
const colorSvgoConfig: Config = {
  plugins: [
    ...basePlugins,
    {
      name: 'removeAttrs',
      params: {
        attrs: ['svg:class'],
      },
    },
  ],
};

const template = ({
  name,
  componentName,
  svg,
  type,
  componentClass,
}: {
  name: string;
  componentName: string;
  svg: string;
  type: 'fill' | 'stroke' | 'color';
  componentClass: string;
}) => {
  return `<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '${componentName}',
  svgType: '${type}',
  setup() {
    const classnames = ['${componentClass}', '${name}', 'type-${type}'];
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
  input: './svgs',
  output: './components/',
  componentClass: 'svg-icon',
  prefix: '',
  template,
};
