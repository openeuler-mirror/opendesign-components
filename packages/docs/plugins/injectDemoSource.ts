import fsp from 'node:fs/promises';
import { createFilter, type Plugin } from 'vite';
import { parse, type SFCBlock } from '@vue/compiler-sfc';
import { md } from './markdown/common';

const VIRTUAL_PREFIX = 'virtual:demo-source:';
const virtualModules = new Map<string, string>();

const generateCode = (block: SFCBlock) => {
  return `<${block.type} ${Object.entries(block.attrs)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else {
        return `${key}`;
      }
    })
    .join(' ')}>${block.content}</${block.type}>\n`;
};
const generateVirtualModule = (source: string) => {
  const { descriptor } = parse(source);
  let cleanedSource = '';

  if (descriptor.script) {
    cleanedSource = generateCode(descriptor.script);
  }
  if (descriptor.scriptSetup) {
    cleanedSource += generateCode(descriptor.scriptSetup);
  }
  if (descriptor.template) {
    cleanedSource += generateCode(descriptor.template);
  }
  if (descriptor.styles) {
    descriptor.styles.forEach((style) => {
      cleanedSource += generateCode(style);
    });
  }
  cleanedSource = cleanedSource.trimEnd();
  const result = `${md.render(`\`\`\`vue:line-numbers\n${cleanedSource}\n\`\`\``)}`.replace(
    /(<pre.*?>)<code(.*?)>([\s\S]*?)<\/code><\/pre>/,
    (_, pre, codeAttr, codeContent) => {
      return `${pre}<code v-pre${codeAttr}>${codeContent}</code></pre>`;
    }
  );
  return `<template>${result}</template>`;
};
export function injectDemoSource(): Plugin {
  const filter = createFilter(/opendesign\/src\/.*?\/__demo__\/.+\.vue$/);
  return {
    name: 'portal:inject-demo-source',
    resolveId(id) {
      if (virtualModules.has(id)) {
        return id;
      }
    },
    load(id) {
      return virtualModules.get(id);
    },
    async transform(code, id) {
      if (!filter(id) || id.startsWith(VIRTUAL_PREFIX)) {
        return;
      }
      if (await fsp.stat(id).then((stat) => stat.isFile())) {
        const source = await fsp.readFile(id, 'utf-8');
        const virtualId = `${VIRTUAL_PREFIX}${id}`;
        virtualModules.set(virtualId, generateVirtualModule(source));
        return `${code}
;import _DemoSource from ${JSON.stringify(virtualId)};
_sfc_main.DemoSource = _DemoSource;`;
      }
    },
    async handleHotUpdate(ctx) {
      const virtualId = `${VIRTUAL_PREFIX}${ctx.file}`;
      if (virtualModules.has(virtualId)) {
        virtualModules.set(virtualId, generateVirtualModule(await ctx.read()));
        ctx.server.watcher.emit('change', virtualId);
      }
    },
  };
}
