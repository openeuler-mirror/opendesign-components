module.exports = {
  prefix: '--o-',
  output: '../components/style/',
  globalTokenFile: ['./size.json'],
  tokens: [
    {
      theme: ['default', 'light'],
      file: ['./light.color.json']
    },
    {
      theme: 'dark',
      file: ['./dark.color.json']
    }
  ]
};