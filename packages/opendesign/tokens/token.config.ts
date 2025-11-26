module.exports = {
  prefix: '--o-',
  output: './dist',
  themeMap: [
    {
      valueKey: 'light',
      name: 'o.light',
    },
    {
      valueKey: 'dark',
      name: 'o.dark',
    },
  ],
  defaultTheme: 'light',
  tokenFile: ['./opendesign-token.json'],
  codeSnippetsFile: './dist/opendesign.token.code-snippets',
};
