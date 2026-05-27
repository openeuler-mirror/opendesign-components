/**
 * 自定义 ESLint 规则：累计圈复杂度（cumulative-complexity）
 *
 * 与内置 `complexity` 规则的区别：
 *   内置规则：每个函数单独计算，嵌套函数的复杂度不影响外层函数。
 *   本规则：嵌套函数（闭包）的复杂度向上合并到父函数，父函数为"总负责人"。
 *
 * 豁免规则：
 *   同时满足以下两个条件的函数不参与上限检测：
 *     1. 位于文件根作用域（直接父节点是 Program，export 包装不算间隔）
 *     2. 函数名称匹配 hookPattern 正则（默认 ^use[A-Z]，即 Vue composable 命名规范）
 *
 *   之所以增加命名限制：根作用域下存在非 hook 的普通工具函数，这些函数
 *   不应豁免——只有 composable 入口（useXxx）才是"编排层"，允许总复杂度偏高。
 *
 * 配置项（均为可选）：
 *   max         {number}  复杂度上限，默认 8
 *   hookPattern {string}  豁免函数名的正则字符串，默认 "^use[A-Z]"
 *
 * 用法示例：
 *   // 阈值 8，使用默认 hook 匹配规则
 *   'local/cumulative-complexity': ['warn', 8]
 *
 *   // 阈值 8，自定义豁免规则（以 use 开头即豁免，不限第二个字符大小写）
 *   'local/cumulative-complexity': ['warn', 8, '^use']
 *
 *   // 阈值 10，豁免所有 create 开头的工厂函数
 *   'local/cumulative-complexity': ['warn', 10, '^(use|create)[A-Z]']
 *
 * 计入复杂度的节点（与内置规则相同）：
 *   IfStatement, ConditionalExpression, SwitchCase（非 default）,
 *   LogicalExpression（&& / ||，不含 ??）,
 *   WhileStatement, DoWhileStatement, ForStatement,
 *   ForInStatement, ForOfStatement, CatchClause
 */

import type { Rule } from 'eslint';

// ─── 类型 ──────────────────────────────────────────────────────────────────

/** 函数作用域帧，每进入一个函数就向栈顶压入一帧 */
interface StackFrame {
  /**
   * 该函数的累计复杂度：
   *   = 自身分支数 + 所有直接/间接嵌套函数的复杂度之和
   * 初始值 1，代表函数本身的一条执行路径。
   */
  complexity: number;
}

// ─── 辅助函数 ──────────────────────────────────────────────────────────────

/**
 * 从函数节点中提取函数名，用于判断是否匹配豁免模式。
 *
 * 函数名的来源有三种形式：
 *   - FunctionDeclaration：`function useXxx() {}`  → node.id.name
 *   - 具名 FunctionExpression：`const x = function useXxx() {}` → node.id.name
 *   - 赋值给变量的函数：`const useXxx = () => {}` / `const useXxx = function() {}`
 *     → 向上看 VariableDeclarator 的 id.name
 */
function getFunctionName(node: Rule.Node): string | null {
  const n = node as any;

  // FunctionDeclaration 或具名 FunctionExpression
  if (n.id?.name) return n.id.name;

  // 箭头函数 / 匿名函数赋值给变量：const useXxx = () => {}
  if (n.parent?.type === 'VariableDeclarator' && n.parent.id?.type === 'Identifier') {
    return n.parent.id.name;
  }

  return null;
}

/**
 * 判断一个函数节点是否应被豁免（不参与复杂度上限检测）。
 *
 * 豁免条件（两者同时满足）：
 *   1. 位于文件根作用域：最近的非 export 包装祖先节点是 Program
 *   2. 函数名称与 hookRe 正则匹配
 *
 * export 包装节点（ExportDefaultDeclaration / ExportNamedDeclaration）
 * 本身不是作用域容器，需跳过它们往上找真正的父节点。
 */
function isExemptHook(node: Rule.Node, hookRe: RegExp): boolean {
  // 条件 1：根作用域检测
  let parent = (node as any).parent;
  while (parent && (parent.type === 'ExportDefaultDeclaration' || parent.type === 'ExportNamedDeclaration')) {
    parent = parent.parent;
  }
  if (parent?.type !== 'Program') return false;

  // 条件 2：hook 命名检测
  const name = getFunctionName(node);
  return name !== null && hookRe.test(name);
}

// ─── 触发复杂度 +1 的节点类型 ──────────────────────────────────────────────

/**
 * 这些节点在访问时各令栈顶帧的 complexity +1。
 * LogicalExpression 和 SwitchCase 需要在运行时额外过滤（见 incrementComplexity）。
 */
const BRANCH_NODE_TYPES = [
  'IfStatement',
  'ConditionalExpression',
  'LogicalExpression', // 仅 && / ||；?? 不算分支，在 incrementComplexity 中过滤
  'SwitchCase', // 仅非 default 分支，在 incrementComplexity 中过滤
  'WhileStatement',
  'DoWhileStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'CatchClause',
] as const;

// ─── 规则主体 ──────────────────────────────────────────────────────────────

export const cumulativeComplexityRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '检测函数的累计圈复杂度（含所有嵌套闭包），豁免根作用域 composable 入口（可通过 hookPattern 配置匹配规则）',
    },
    schema: [
      {
        // 第一项：复杂度上限
        type: 'integer',
        minimum: 1,
      },
      {
        // 第二项（可选）：豁免函数名的正则字符串，默认 "^use[A-Z]"
        // 传入非法正则字符串时会在规则初始化阶段抛出 SyntaxError
        type: 'string',
      },
    ],
    messages: {
      exceed: '函数累计圈复杂度（含内部闭包）为 {{complexity}}，超过阈值 {{threshold}}',
    },
  },

  create(context) {
    const threshold: number = context.options[0] ?? 8;

    // 将配置字符串编译为 RegExp；未传时使用 Vue composable 默认命名规范
    const hookPatternStr: string = context.options[1] ?? '^use[A-Z]';
    const hookRe = new RegExp(hookPatternStr);

    /**
     * 函数作用域栈。
     * 每进入一个函数就压入一帧；退出时弹出，并将该帧的复杂度累加到新栈顶（父函数）。
     */
    const stack: StackFrame[] = [];

    // ── 进入函数 ──────────────────────────────────────────────────────────

    function enterFunction(): void {
      // 每个函数的起始复杂度为 1（代表函数自身的一条基础路径）
      stack.push({ complexity: 1 });
    }

    // ── 退出函数 ──────────────────────────────────────────────────────────

    function exitFunction(node: Rule.Node): void {
      const current = stack.pop()!;
      const exempt = isExemptHook(node, hookRe);

      // 向上合并：将本函数的累计复杂度加到父函数帧。
      // 豁免函数同样参与合并——useXxx 的复杂度仍会汇入更外层（如有），
      // 只是 useXxx 自身不受上限约束。
      if (stack.length > 0) {
        stack[stack.length - 1].complexity += current.complexity;
      }

      if (exempt) return;

      if (current.complexity > threshold) {
        context.report({
          node,
          messageId: 'exceed',
          data: {
            complexity: String(current.complexity),
            threshold: String(threshold),
          },
        });
      }
    }

    // ── 分支节点计数 ──────────────────────────────────────────────────────

    function incrementComplexity(node: Rule.Node): void {
      // 没有函数作用域时（如模块顶层表达式），不计入任何帧
      if (stack.length === 0) return;

      // ?? (nullish coalescing) 不产生传统意义上的分支，跳过
      if (node.type === 'LogicalExpression' && (node as any).operator === '??') {
        return;
      }

      // switch default 是"兜底"路径，不额外计入复杂度
      if (node.type === 'SwitchCase' && (node as any).test === null) {
        return;
      }

      stack[stack.length - 1].complexity++;
    }

    // ── 组装 visitor ──────────────────────────────────────────────────────

    const branchVisitors = Object.fromEntries(BRANCH_NODE_TYPES.map((type) => [type, incrementComplexity])) as Rule.RuleListener;

    return {
      FunctionDeclaration: enterFunction,
      FunctionExpression: enterFunction,
      ArrowFunctionExpression: enterFunction,
      'FunctionDeclaration:exit': exitFunction,
      'FunctionExpression:exit': exitFunction,
      'ArrowFunctionExpression:exit': exitFunction,
      ...branchVisitors,
    };
  },
};
