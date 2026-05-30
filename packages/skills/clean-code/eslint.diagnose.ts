/**
 * 代码质量综合诊断 ESLint 配置
 *
 * 用法：
 *   pnpm exec eslint --config packages/skills/clean-code/eslint.diagnose.ts <目标文件路径>
 */

import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import type { Linter } from 'eslint';

import { cumulativeComplexityRule } from '../../../eslint-rules/cumulative-complexity.ts';

const localPlugin = {
  rules: {
    'cumulative-complexity': cumulativeComplexityRule,
  },
};

const rules: Linter.RulesRecord = {
  // ── 复杂度 ──────────────────────────────────────────────────────────────
  // 关闭内置规则，由 cumulative-complexity 替代（嵌套闭包复杂度向上汇总）
  complexity: 'off',
  // 参考：packages/skills/clean-code/references/reduce-complexity.md
  'local/cumulative-complexity': ['warn', 8, '^use[A-Z]'],

  // ── 嵌套深度 ────────────────────────────────────────────────────────────
  // 参考：packages/skills/clean-code/references/guard-clause.md
  'max-depth': ['warn', 5],

  // ── 函数长度 ────────────────────────────────────────────────────────────
  // 参考：packages/skills/clean-code/references/split-composable.md
  'max-lines-per-function': ['warn', { max: 100, skipComments: true, skipBlankLines: true }],

  // ── 参数数量 ────────────────────────────────────────────────────────────
  // 参考：packages/skills/clean-code/references/config-object.md
  'max-params': ['warn', 3],
};

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { local: localPlugin },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules,
  },
  ...pluginVue.configs['flat/base'],
  {
    files: ['**/*.vue'],
    plugins: { local: localPlugin },
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules,
  },
];
