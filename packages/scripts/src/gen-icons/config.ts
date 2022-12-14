import type { Config } from 'svgo';

interface GenIconsConfig {
  svgo: Config,
  input: string,
  output: string,
  template: ({ name, componentName, svg }: { name: string, componentName: string, svg: string }) => void
}

const svgoConfig: Config = {
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

const template = ({ name, componentName, svg }: { name: string, componentName: string, svg: string }) => {
  return `<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '${componentName}',
  setup() {
    const classnames = ['o-icon', '${name}'];
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

const config: GenIconsConfig = {
  svgo: svgoConfig,
  input: './src/icons/svgs',
  output: './src/components/icons/',
  template,
};

export default config;