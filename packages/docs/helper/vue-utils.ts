import { parse, NodeTypes, type ElementNode } from '@vue/compiler-dom';
import { type SFCDescriptor, type SFCBlock, type SFCStyleBlock, type SFCTemplateBlock, type SFCScriptBlock } from '@vue/compiler-sfc';

function hasSrc(node: ElementNode) {
  return node.props.some((p) => {
    if (p.type !== NodeTypes.ATTRIBUTE) {
      return false;
    }
    return p.name === 'src';
  });
}

function isEmpty(node: ElementNode) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type !== NodeTypes.TEXT || child.content.trim() !== '') {
      return false;
    }
  }
  return true;
}

function createBlock(node: ElementNode, source: string): SFCBlock {
  const type = node.tag;
  const loc = node.innerLoc!;
  const attrs: Record<string, string | true> = {};
  const block: SFCBlock = {
    type,
    content: source.slice(loc.start.offset, loc.end.offset),
    loc,
    attrs,
  };
  node.props.forEach((p) => {
    if (p.type === NodeTypes.ATTRIBUTE) {
      const name = p.name;
      attrs[name] = p.value ? p.value.content || true : true;
      if (name === 'lang') {
        block.lang = p.value && p.value.content;
      } else if (name === 'src') {
        block.src = p.value && p.value.content;
      } else if (type === 'style') {
        if (name === 'scoped') {
          (block as SFCStyleBlock).scoped = true;
        } else if (name === 'module') {
          (block as SFCStyleBlock).module = attrs[name];
        }
      } else if (type === 'script' && name === 'setup') {
        (block as SFCScriptBlock).setup = attrs.setup;
      }
    }
  });
  return block;
}

const sfcCache = new Map<string, any>();
// 由于 @vue/compiler-sfc 包体积过大，且当前只需要使用其 parse 函数，因此创建一个简单的 parse 函数
// 该函数省略了报错，仅返回解析结果
export function parseSfc(source: string) {
  const cache = sfcCache.get(source);
  if (cache) {
    return cache;
  }
  const descriptor: Pick<SFCDescriptor, 'template' | 'script' | 'scriptSetup' | 'styles' | 'customBlocks'> = {
    template: null,
    script: null,
    scriptSetup: null,
    styles: [],
    customBlocks: [],
  };

  const ast = parse(source, {
    parseMode: 'sfc',
    prefixIdentifiers: true,
  });

  ast.children.forEach((node) => {
    if (node.type !== NodeTypes.ELEMENT) {
      return;
    }
    if (node.tag !== 'template' && isEmpty(node) && !hasSrc(node)) {
      return;
    }
    switch (node.tag) {
      case 'template':
        descriptor.template = createBlock(node, source) as SFCTemplateBlock;
        break;
      case 'script': {
        const scriptBlock = createBlock(node, source) as SFCScriptBlock;
        if (scriptBlock.attrs.setup) {
          descriptor.scriptSetup = scriptBlock;
        } else {
          descriptor.script = scriptBlock;
        }
        break;
      }
      case 'style': {
        const styleBlock = createBlock(node, source) as SFCStyleBlock;
        descriptor.styles.push(styleBlock);
        break;
      }
      default:
        descriptor.customBlocks.push(createBlock(node, source));
        break;
    }
  });
  sfcCache.set(source, descriptor);
  return descriptor;
}
