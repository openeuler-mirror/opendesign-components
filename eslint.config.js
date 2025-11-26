import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

const rules = {
  'no-debugger': 'warn',
  'no-console': 'warn',
  quotes: ['error', 'single', { avoidEscape: true }],
  'quote-props': ['warn', 'as-needed'],
  'comma-dangle': ['error', 'only-multiline'],
  camelcase: ['error', { properties: 'never' }],

  'array-bracket-spacing': 'warn',
  'arrow-spacing': 'warn',
  'block-spacing': 'warn',
  'comma-spacing': 'warn',
  'computed-property-spacing': 'warn',
  'generator-star-spacing': 'warn',
  'key-spacing': 'warn',
  'keyword-spacing': 'warn',
  'object-curly-spacing': ['warn', 'always'],
  'rest-spread-spacing': 'warn',
  'switch-colon-spacing': 'error',
  'func-call-spacing': 'off',
  'semi-spacing': 'warn',
  'template-curly-spacing': 'warn',
  'template-tag-spacing': 'warn',
  'yield-star-spacing': 'warn',
  'space-unary-ops': 'warn',
  'no-multi-spaces': 'warn',
  'no-mixed-spaces-and-tabs': 'warn',
  'no-trailing-spaces': 'warn',
  'spaced-comment': 'warn',
  'space-infix-ops': 'warn',
  'space-in-parens': 'warn',

  'eol-last': 'warn',
  indent: ['warn', 2, { SwitchCase: 1 }],

  semi: ['warn', 'always'],
  'prefer-template': 'error',
  'prefer-spread': 'error',
  'no-var': 'error',
  'max-lines-per-function': [
    'error',
    {
      max: 100,
      skipComments: true,
      skipBlankLines: true,
    },
  ],
  complexity: ['warn', 20],
  'max-depth': ['warn', 4],
  'max-len': [
    'warn',
    {
      code: 160,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignorePattern: 'd="([\\s\\S]*?)"',
      ignoreComments: true,
    },
  ],
  'default-param-last': 'off',
  'no-param-reassign': ['error', { props: false }],
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
  'no-use-before-define': ['error', { functions: false }],

  'no-unused-vars': 'warn',
  'no-undef-init': 'error',

  /************  eslint-plugin-vue *******************/
  'vue/html-self-closing': [
    'warn',
    {
      html: {
        void: 'always',
        normal: 'never',
      },
    },
  ],
  'vue/singleline-html-element-content-newline': 'off',
  'vue/html-closing-bracket-newline': 'off',
  'vue/multiline-html-element-content-newline': 'warn',
  'vue/no-mutating-props': ['error', { shallowOnly: true }],
  "vue/max-attributes-per-line": ["error", {
    "singleline": {
      "max": 1
    },      
    "multiline": {
      "max": 1
    }
  }],

  /************  typescript-eslint *******************/
  '@typescript-eslint/no-explicit-any': 'off',
};
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules,
  },
  eslintPrettier,
]);
