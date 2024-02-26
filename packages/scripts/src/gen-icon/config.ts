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
  renderOnServer: boolean;
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
      attributes: [{ ':class': 'classNames' }],
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
  renderOnServer,
}: {
  name: string;
  componentName: string;
  svg: string;
  type: 'fill' | 'stroke' | 'color';
  componentClass: string;
  renderOnServer?: boolean;
}) => {
  return `<script lang="ts">
import { defineComponent${renderOnServer ? ', onMounted, ref' : ''} } from 'vue';

export default defineComponent({
  name: '${componentName}',
  svgType: '${type}',
  setup() {
    const classNames = ['${componentClass}', '${name}', 'type-${type}'];${
    renderOnServer
      ? `
    const isClient = ref(false);
    onMounted(() => {
      isClient.value = true;
    });`
      : ''
  }
    return {${
      renderOnServer
        ? `
      isClient,`
        : ''
    }
      classNames,
    };
  },
});
</script>
<template>
  ${
    renderOnServer
      ? `<template v-if="isClient">
    ${svg}
  </template>`
      : svg
  }
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
  renderOnServer: false,
};
