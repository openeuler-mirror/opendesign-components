import { h, type VNode } from 'vue';
import { OTag, OPopover } from '@opensig/opendesign';
import { TAG_REG_EXP, TAG_INLINE_MARGIN_LEFT, type TagColor } from '../../shared/inlineTagConstants';

interface AnnotationTagNodeContext {
  /** 标签显示内容 */
  content: string;
  /** 标签颜色 */
  color: TagColor;
  /** 垂直居中 CSS 变量表达式（如 var(--menu-text-height)） */
  verticalAlignVar: string;
  /** 气泡提示内容，无则渲染行内标签 */
  tooltip?: string;
}

/**
 * 创建注解标签 VNode，根据是否有 tooltip 决定渲染 Popover 包裹的 Tag 或行内 Tag
 * @param content - 标签显示内容
 * @param color - 标签颜色
 * @param verticalAlignVar - 垂直居中 CSS 变量表达式
 * @param tooltip - 气泡提示内容
 * @returns 注解标签 VNode
 */
function createAnnotationTagNode({ content, color, verticalAlignVar, tooltip }: AnnotationTagNodeContext): VNode {
  const tagStyle = `margin: calc((${verticalAlignVar} - var(--tag-height)) / 2) 0; margin-left: ${TAG_INLINE_MARGIN_LEFT};`;
  const tagVNode = h(OTag, { size: 'small', variant: 'outline', color, class: tooltip ? 'tooltip' : undefined, style: tagStyle }, () => content);
  if (tooltip) {
    return h(OPopover, { wrapper: 'body' }, { target: () => tagVNode, default: () => tooltip });
  }
  return tagVNode;
}

/**
 * 将文本中的 ^[内容](颜色)`tooltip`? 语法转为 VNode
 * - 有 tooltip 时：渲染 OPopover 包裹 OTag（class="tooltip"），hover 显示气泡
 * - 无 tooltip 时：渲染行内 OTag（size="small" variant="outline"）
 *
 * @param text - 含注解语法的文本
 * @param verticalAlignVar - 用于垂直居中的 CSS 变量表达式（如 var(--menu-text-height)）
 * @returns VNode 与纯文本混合数组，用于 slot 渲染
 */
export function renderInlineTagContent(text: string, verticalAlignVar: string): (string | VNode)[] {
  const result: (string | VNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TAG_REG_EXP.lastIndex = 0;
  while ((match = TAG_REG_EXP.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }
    const content = match[1];
    const color = match[2] as TagColor;
    const tooltip = match[3];
    result.push(createAnnotationTagNode({ content, color, verticalAlignVar, tooltip }));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  return result;
}
