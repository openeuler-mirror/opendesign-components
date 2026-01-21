/**
 * 将h标签的标题转换为规范的id（该id会作为h标签的id以及a便签的href）
 * @param str 待转换的标题
 * @returns id
 */
function slugify(str: string) {
  return str
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
    .replace(/(^-|-$)/g, '');
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
    const title = dom.textContent;
    if (!title) {
      return;
    }
    const level = parseInt(dom.tagName.slice(1));
    let id = '';
    if (dom.id) {
      id = dom.id;
    } else {
      id = slugify(title);
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
