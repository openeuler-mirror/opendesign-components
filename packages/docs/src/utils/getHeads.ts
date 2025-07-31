/**
 * 将h标签的标题转换为规范的id（该id会作为h标签的id以及a便签的href）
 * @param title 待转换的标题
 * @returns id
 */
function escapeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    // 转换特殊字符，但不转化 unicode 字符
    .replace(/[;,/?:@&=+$#]/g, (char) => encodeURIComponent(char));
}
/**
 * 获取h标签
 * @param el h标签的父元素dom，用来限定h标签查找范围
 * @param minLevel 查找的最小级别，默认为2，即只查找h2到h6的标题
 * @returns 查找结果，格式为[{title: string, level: number, id: string}]
 */
export function getHeads(el: HTMLElement, minLevel = 2) {
  let headerId: Record<string, number> = {};
  const heads: Array<{ title: string; level: number; id: string }> = [];
  let levels = '';
  minLevel = Math.max(Math.floor(minLevel), 1);
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
      id = escapeTitle(title);
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
