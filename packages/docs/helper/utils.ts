import { type SFCBlock } from '@vue/compiler-sfc';
export function getLangByFileName(_fileName: string) {
  const fileName = _fileName.slice(_fileName.lastIndexOf('/') + 1);
  const [name, lang, ext] = fileName.split('.');
  if (!ext) {
    return { name, lang: '', ext: lang };
  }
  return { name, lang, ext };
}

export function generateCode(block: SFCBlock) {
  return `<${block.type} ${Object.entries(block.attrs)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else {
        return `${key}`;
      }
    })
    .join(' ')}>${block.content}</${block.type}>\n`;
}
