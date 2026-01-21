module.exports = {
  prefix: '--o-',
  output: './dist',
  themeMap: [
    {
      valueKey: 'light',
      name: ['o.light', 'default'],
    },
    {
      valueKey: 'dark',
      name: 'o.dark',
    },
    {
      valueKey: 'light',
      name: 'o',
      root: true
    },
  ],
  tokenFile: ['./opendesign-token.json'],
  codeSnippetsFile: './dist/opendesign.token.code-snippets',
};
