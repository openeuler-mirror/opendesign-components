import fsp from 'node:fs/promises';
import { createFilter, type Plugin, type ViteDevServer } from 'vite';
import { parse, type SFCDescriptor } from '@vue/compiler-sfc';
import { generateCode } from '../helper/utils';

const virtualModules = new Map<string, string>();

const getVirtualId = (id: string) => {
  return `${id}-demo-source.md`;
};

/**
 * 从 SFCDescriptor 中提取 script/scriptSetup/template/styles 块，
 * 拼接后包装为 markdown 代码块（带行号），用于 DemoSource 展示
 * @param descriptor - SFC 解析后的描述对象
 * @returns markdown 代码块字符串
 */
const generateVirtualModule = (descriptor: SFCDescriptor) => {
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
  // 返回组件源码
  return `\`\`\`vue:line-numbers\n${cleanedSource}\n\`\`\``;
};

/**
 * 解析 Case 组件源码的转换逻辑
 * @param code - 组件源代码
 * @param id - 文件 ID
 * @returns 转换后的代码，或 undefined
 */
const resolveSourceTransform = async (code: string, id: string): Promise<string | undefined> => {
  try {
    const stat = await fsp.stat(id);
    if (!stat.isFile()) {
      return;
    }
  } catch {
    return;
  }
  const source = await fsp.readFile(id, 'utf-8');
  const virtualId = getVirtualId(id);
  const { descriptor } = parse(source);
  if (!descriptor.template) {
    // 无 template 块，属于 Usage 运行时编译组件，不需要生成 DemoSource
    return;
  }
  virtualModules.set(virtualId, generateVirtualModule(descriptor));
  // Case 组件引入虚拟模块 virtualId，该虚拟模块就是 Case 组件的源代码
  return `${code}
;import _DemoSource from ${JSON.stringify(virtualId)};
_sfc_main.DemoSource = _DemoSource;`;
};

interface SourceHotUpdateContext {
  /** 更新的文件路径 */
  file: string;
  /** 文件内容读取函数 */
  read: () => string | Promise<string>;
  /** Vite 开发服务器实例 */
  server: ViteDevServer;
}

/**
 * 处理 Case 组件源码的热更新
 * @param ctx - 热更新上下文
 */
const handleSourceHotUpdate = async (ctx: SourceHotUpdateContext): Promise<void> => {
  const virtualId = getVirtualId(ctx.file);
  if (!virtualModules.has(virtualId)) {
    return;
  }
  // 当Case组件更新时，同时更新对应的虚拟模块，以实现源码的热更新
  const { descriptor } = parse(await ctx.read());
  if (!descriptor.template) {
    return;
  }
  virtualModules.set(virtualId, generateVirtualModule(descriptor));
  ctx.server.watcher.emit('change', virtualId);
};

/**
 * vite 插件，用于将 Case 组件的源代码保存到 _sfc_main 对象中
 * @returns Plugin
 */
export function injectDemoSource(): Plugin {
  const filter = createFilter(/opendesign\/src\/.*?\/__case__\/.+\.vue$/);
  return {
    name: 'portal:inject-demo-source',
    resolveId(id) {
      if (virtualModules.has(id)) {
        return id;
      }
    },
    load(id) {
      // 返回虚拟模块
      return virtualModules.get(id);
    },
    async transform(code, id) {
      if (!filter(id)) {
        return;
      }
      return resolveSourceTransform(code, id);
    },
    async handleHotUpdate(ctx) {
      return handleSourceHotUpdate({ file: ctx.file, read: ctx.read, server: ctx.server });
    },
  };
}
