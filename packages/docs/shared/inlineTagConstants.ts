/** ^[内容](颜色)`tooltip`? 语法的正则模式，匹配如 ^[NEXT](primary)、^[deprecated](danger)`NEXT` 等注解标签 */
export const TAG_REG_EXP = /\^\[([^\]]*)\]\((normal|primary|success|warning|danger)\)(?:`([^`]*)`)?/g;

/** OTag 颜色类型 */
export type TagColor = 'normal' | 'primary' | 'success' | 'warning' | 'danger';

/** 行内注解标签的统一左侧间距（popover.ts HTML 渲染与 inlineTag.ts VNode 渲染共用此值） */
export const TAG_INLINE_MARGIN_LEFT = '4px';
