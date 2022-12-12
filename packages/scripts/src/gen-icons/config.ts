import type { Config } from 'svgo';

interface GenIconsConfig {
  svgo: Config,
  input: string,
  output: string,
  template: ({ componentName, svg }: { componentName: string, svg: string }) => void
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
  ],
};

const template = ({ componentName, svg }: { componentName: string, svg: string }) => {
  return `<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '${componentName}',
});
</script>
<template>
  ${svg}
</template>`;
};

const config: GenIconsConfig = {
  svgo: svgoConfig,
  input: './icons/svgs',
  output: './components/icons/',
  template,
};

export default config;