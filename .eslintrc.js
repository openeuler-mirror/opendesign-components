module.exports = {
  root: true,
  extends: [
    // add more generic rulesets here,
    'plugin:vue/vue3-recommended',
    // '@vue/typescript/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // override/add rules settings here,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'comma-dangle': ['error', 'always-multiline'],
    'camelcase': ['error', { 'properties': 'never' }],
    semi: ['warn', 'always'],
    'no-trailing-spaces': 'warn',
    'prefer-template': 'error',
    'prefer-spread': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    'max-lines-per-function': ['error', 100],
    'complexity': ['warn', 20],
    'max-depth': ['warn', 4],
    'max-len': ['error', { code: 160 }],
    'no-shadow': ['error', { hoist: 'all' }],
    'no-param-reassign': ['error', { props: false }],
    'vue/max-attributes-per-line': ['error', {
      'singleline': { 'max': 4 },
      'multiline': { 'max': 2 },
    }],
    'vue/html-self-closing': ['warn', {
      'html': {
        'void': 'always',
        'normal': 'never',
      },
      'svg': 'never',
    }],
    'vue/html-closing-bracket-newline': ['warn', {
      'singleline': 'never',
      'multiline': 'never',
    }],
  },
};