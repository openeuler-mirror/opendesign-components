import type { Config, PluginConfig } from 'svgo';

export interface IconsConfig {
  svgo: Config;
  input: string;
  output: string;
}
export const basePlugins: PluginConfig[] = [
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
      attrs: ['class'],
    },
  },
];

export const defaultConfig: IconsConfig = {
  svgo: { plugins: basePlugins },
  input: './src/icons/svgs',
  output: './src/icons/output/',
};
