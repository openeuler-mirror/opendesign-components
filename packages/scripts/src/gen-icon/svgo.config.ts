import type { Config, PluginConfig } from 'svgo';

export interface SVGOConfigT {
  fill: Config;
  stroke: Config;
  color: Config;
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
  'prefixIds',
  {
    // 将 prefixIds 生成的 id 改写为 vue 动态属性绑定
    name: 'replaceIdWithDynamicValue',
    fn: () => {
      return {
        element: {
          enter: (node) => {
            const id = node.attributes.id;
            if (id) {
              delete node.attributes.id;
              node.attributes[':id'] = `\`${id}_\${globalId}\``;
            }
            for (const key of Object.keys(node.attributes)) {
              const value = node.attributes[key];
              const urlReg = /url\((#[^)]+)\)/;
              if (urlReg.test(value)) {
                delete node.attributes[key];
                node.attributes[`:${key}`] = value.replace(urlReg, (_, path) => {
                  return `\`url(${path}_\${globalId})\``;
                });
              }
            }
          },
        },
      };
    },
  },
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

export const svgoConfig: SVGOConfigT = {
  color: colorSvgoConfig,
  stroke: strokeSvgoConfig,
  fill: fillSvgoConfig,
};
