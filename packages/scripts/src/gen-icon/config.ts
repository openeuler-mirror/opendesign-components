import { svgoConfig, SVGOConfigT } from './svgo.config';

export interface IconsConfig {
  svgo: SVGOConfigT;
  input: string;
  output: string;
  prefix: string; // 'o-'
  componentClass: string;
  template: typeof template;
  renderOnServer: boolean;
}

const renderTpl = (name: string, componentName: string, type: 'fill' | 'stroke' | 'color', componentClass: string, svg: string) => {
  return `<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: '${componentName}',
  svgType: '${type}',
  setup() {
    const classNames = ['${componentClass}', '${name}', 'type-${type}'];
    return {
      classNames,
    };
  },
});
</script>
<template>
  ${svg}
</template>`;
};

const clientRenderTpl = (name: string, componentName: string, type: 'fill' | 'stroke' | 'color', componentClass: string, svg: string) => {
  const svgReg = /(<svg[^>]*>)([\s\S]*?)<\/svg>/;
  const match = svgReg.exec(svg);
  const outer = (match && match[1]) || '<svg>';
  const inner = (match && match[2]) || '';
  return `<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: '${componentName}',
  svgType: '${type}',
  setup() {
    const classNames = ['${componentClass}', '${name}', 'type-${type}'];
    const isClient = ref(false);
    onMounted(() => {
      isClient.value = true;
    });
    return {
      isClient,
      classNames,
    };
  },
});
</script>
<template>
  ${outer}
    <template v-if="isClient">
      ${inner}
    </template>
  </svg>
</template>`;
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
  const render = renderOnServer ? renderTpl : clientRenderTpl;
  return render(name, componentName, type, componentClass, svg);
};

export const defaultConfig: IconsConfig = {
  svgo: svgoConfig,
  input: './svgs',
  output: './components/',
  componentClass: 'svg-icon',
  prefix: '',
  template,
  renderOnServer: false,
};

export function mergeConfig(config?: IconsConfig | null): IconsConfig {
  if (config) {
    const { svgo, ...rest } = config;
    if (svgo) {
      Object.assign(defaultConfig.svgo.color, svgo.color);
      Object.assign(defaultConfig.svgo.stroke, svgo.stroke);
      Object.assign(defaultConfig.svgo.fill, svgo.fill);
    }
    Object.assign(defaultConfig, rest);
  }
  return defaultConfig;
}
