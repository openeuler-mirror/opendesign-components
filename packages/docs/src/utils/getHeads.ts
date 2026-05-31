/**
 * 从 annotation 元素的 data 属性还原 ^[]() 语法字符串
 * @param el - 含 data-annotation-* 属性的 HTML 元素
 * @returns 还原后的 ^[]() 语法字符串
 */
function restoreAnnotationSyntax(el: HTMLElement): string {
  const text = el.getAttribute('data-annotation-text')!;
  const color = el.getAttribute('data-annotation-color') ?? 'normal';
  const tooltip = el.getAttribute('data-annotation-tooltip');
  return tooltip ? `^[${text}](${color})\`${tooltip}\`` : `^[${text}](${color})`;
}

/**
 * 从渲染后的 h 标签 DOM 中提取标题文本，将带 data-annotation-* 属性的 OTag 元素还原为 ^[]()`` 语法
 * popover.ts 渲染行内 OTag（含/不含 tooltip）时都会在 HTML 上写入 data-annotation-text / data-annotation-color，
 * 含 tooltip 的 OTag 额外写入 data-annotation-tooltip
 * 此函数直接读取这些属性，支持还原完整 ^[内容](颜色)`tooltip` 语法和简化 ^[内容](颜色) 语法
 * @param el - h 标签 DOM 元素
 * @returns 包含 ^[]()`` 语法还原的标题文本
 */
function extractTitleWithTags(el: HTMLElement): string {
  let title = '';
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      title += child.textContent ?? '';
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const elem = child as HTMLElement;
      const annotationText = elem.getAttribute('data-annotation-text');
      if (annotationText) {
        title += restoreAnnotationSyntax(elem);
      } else if (elem.querySelector('[data-annotation-text]')) {
        const annotationEl = elem.querySelector('[data-annotation-text]') as HTMLElement;
        title += restoreAnnotationSyntax(annotationEl);
      } else {
        title += elem.textContent ?? '';
      }
    }
  }
  return title.trim();
}
function slugify(str: string) {
  return (
    str
      // 将驼峰转为中横线
      .replace(/(?<=[a-z])([A-Z])|(?<=[A-Z])([A-Z][a-z])/g, '-$&')
      .toLowerCase()
      // 删除标点符号(含中文标点)及表情符号前后的空格
      .replace(/\s*([\p{Punctuation}\p{Symbol}])\s*/gu, '$1')
      // 将空白字符转为中横线
      .replace(/\s+/g, '-')
      // 合并多个中横线
      .replace(/-+/g, '-')
      // 移除首尾中横线
      .replace(/(^-|-$)/g, '')
  );
  // 不应对 hash 进行编码
}
/**
 * 获取h标签
 * @param el h标签的父元素dom，用来限定h标签查找范围
 * @param minLevel 查找的最小级别，默认为2，即只查找h2到h6的标题
 * @returns 查找结果，格式为[{title: string, level: number, id: string}]
 */
export function getHeads(el: HTMLElement, _minLevel = 2) {
  const headerId: Record<string, number> = {};
  const heads: Array<{ title: string; level: number; id: string }> = [];
  let levels = '';
  const minLevel = Math.max(Math.floor(_minLevel), 1);
  if (minLevel > 6) {
    return heads;
  }
  for (let i = minLevel; i <= 6; i++) {
    levels += `h${i}, `;
  }
  const headDoms = el.querySelectorAll(levels.slice(0, -2));
  headDoms.forEach((dom) => {
    // 从 DOM 中提取标题文本，将 OTag 元素还原为 ^[内容](颜色) 语法
    const title = extractTitleWithTags(dom as HTMLElement);
    if (!title) {
      return;
    }
    const level = parseInt(dom.tagName.slice(1));
    let id = '';
    if (dom.id) {
      id = dom.id;
    } else {
      // slugify 使用纯文本内容生成 id（不含 ^[]() 语法）
      id = slugify(dom.textContent || '');
    }
    // 判断是否有重名id，如果有则加上数字编号；该id会作为锚点的href
    if (headerId[id]) {
      id = `${id}-${headerId[id]++}`;
    } else {
      headerId[id] = 1;
    }
    dom.id = id;
    heads.push({
      level,
      id,
      title,
    });
  });
  return heads;
}
